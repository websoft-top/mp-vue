import type {
  Editor as TinyMCEEditor,
  EditorEvent,
  RawEditorSettings
} from 'tinymce';
const BASE_URL = import.meta.env.BASE_URL;

// 默认加载插件
const PLUGINS: string = [
  'code',
  'preview',
  'fullscreen',
  'paste',
  'searchreplace',
  'save',
  'autosave',
  'link',
  'autolink',
  'image',
  'media',
  'table',
  'codesample',
  'lists',
  'advlist',
  'hr',
  'charmap',
  'emoticons',
  'anchor',
  'directionality',
  'pagebreak',
  'quickbars',
  'nonbreaking',
  'visualblocks',
  'visualchars',
  'wordcount'
].join(' ');

// 默认工具栏布局
const TOOLBAR: string = [
  'fullscreen',
  'preview',
  'code',
  'codesample',
  'emoticons',
  'image',
  'media',
  '|',
  'undo',
  'redo',
  '|',
  'forecolor',
  'backcolor',
  '|',
  'bold',
  'italic',
  'underline',
  'strikethrough',
  '|',
  'alignleft',
  'aligncenter',
  'alignright',
  'alignjustify',
  '|',
  'outdent',
  'indent',
  'textindent',
  '|',
  'numlist',
  'bullist',
  '|',
  'formatselect',
  'fontselect',
  'fontsizeselect',
  '|',
  'link',
  'charmap',
  'anchor',
  'pagebreak',
  '|',
  'ltr',
  'rtl'
].join(' ');

// 默认配置
export const DEFAULT_CONFIG: RawEditorSettings = {
  height: 300,
  branding: false,
  skin_url: BASE_URL + 'tinymce/skins/ui/oxide',
  content_css: BASE_URL + 'tinymce/skins/content/default/content.min.css',
  language_url: BASE_URL + 'tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  plugins: PLUGINS,
  toolbar: TOOLBAR,
  draggable_modal: true,
  toolbar_mode: 'sliding',
  quickbars_insert_toolbar: '',
  images_upload_handler: (blobInfo: any, success: any, error: any) => {
    if (blobInfo.blob().size / 1024 > 400) {
      error('大小不能超过 400KB');
      return;
    }
    success('data:image/jpeg;base64,' + blobInfo.base64());
  },
  file_picker_types: 'media',
  file_picker_callback: () => {},

  // 添加自定义样式
  content_style: `
    .text-indent { text-indent: 2em; }
    p.text-indent { text-indent: 2em; }
    p[style*="text-indent"] {
      text-indent: 2em;
    }
    /* 确保首行缩进在各种情况下都能正确显示 */
    body p {
      margin: 0 0 10px 0;
      line-height: 1.6;
    }
  `
};

// 暗黑主题配置
export const DARK_CONFIG: RawEditorSettings = {
  skin_url: BASE_URL + 'tinymce/skins/ui/oxide-dark',
  content_css: BASE_URL + 'tinymce/skins/content/dark/content.min.css'
};

// 支持监听的事件
export const VALID_EVENTS = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid'
];

let unique = 0;

/**
 * 生成编辑器 id
 */
export function uuid(prefix: string): string {
  const time = Date.now();
  const random = Math.floor(Math.random() * 1000000000);
  unique++;
  return prefix + '_' + random + unique + String(time);
}

/**
 * 绑定事件
 */
export function bindHandlers(
  initEvent: EditorEvent<any>,
  listeners: Record<string, any>,
  editor: TinyMCEEditor
): void {
  const validEvents = VALID_EVENTS.map((event) => event.toLowerCase());
  Object.keys(listeners)
    .filter((key: string) => validEvents.includes(key.toLowerCase()))
    .forEach((key: string) => {
      const handler = listeners[key];
      if (typeof handler === 'function') {
        if (key === 'onInit') {
          handler(initEvent, editor);
        } else {
          editor.on(key.substring(2), (e: EditorEvent<any>) =>
            handler(e, editor)
          );
        }
      }
    });
}

/**
 * 弹出提示框
 */
export function openAlert(
  editor: TinyMCEEditor | null,
  option: AlertOption = {}
) {
  editor?.windowManager?.open({
    title: option.title ?? '提示',
    body: {
      type: 'panel',
      items: [
        {
          type: 'htmlpanel',
          html: `<p>${option.content ?? ''}</p>`
        }
      ]
    },
    buttons: [
      {
        type: 'cancel',
        name: 'closeButton',
        text: '确定',
        primary: true
      }
    ]
  });
}

export interface AlertOption {
  title?: string;
  content?: string;
}

/**
 * 添加首行缩进功能
 */
export function setupTextIndent(editor: TinyMCEEditor) {
  // 注册首行缩进按钮
  editor.ui.registry.addButton('textindent', {
    icon: 'indent',
    tooltip: '段落首行缩进 (Ctrl+Shift+I)',
    onAction: () => {
      const selection = editor.selection;
      const selectedNode = selection.getNode();

      // 获取当前段落元素
      let paragraph = selectedNode;
      while (paragraph && paragraph.nodeName !== 'P' && paragraph.nodeName !== 'DIV') {
        paragraph = paragraph.parentNode as Element;
      }

      if (paragraph && (paragraph.nodeName === 'P' || paragraph.nodeName === 'DIV')) {
        const currentIndent = (paragraph as HTMLElement).style.textIndent;

        if (currentIndent === '2em' || currentIndent === '32px') {
          // 如果已经有首行缩进，则取消
          (paragraph as HTMLElement).style.textIndent = '';
          editor.notificationManager.open({
            text: '已取消段落首行缩进',
            type: 'info',
            timeout: 2000
          });
        } else {
          // 添加首行缩进
          (paragraph as HTMLElement).style.textIndent = '2em';
          editor.notificationManager.open({
            text: '已应用段落首行缩进',
            type: 'success',
            timeout: 2000
          });
        }
      } else {
        // 如果没有选中段落，则对当前行应用首行缩进
        const content = selection.getContent();
        if (content) {
          // 如果有选择内容，将选择的内容包装在带缩进的段落中
          editor.execCommand('mceInsertContent', false, `<p style="text-indent: 2em;">${content}</p>`);
        } else {
          // 如果没有选择内容，在当前位置插入带缩进的段落
          editor.execCommand('FormatBlock', false, 'p');
          const newParagraph = selection.getNode();
          if (newParagraph && newParagraph.nodeName === 'P') {
            (newParagraph as HTMLElement).style.textIndent = '2em';
          }
        }
        editor.notificationManager.open({
          text: '已应用段落首行缩进',
          type: 'success',
          timeout: 2000
        });
      }
    }
  });

  // 注册快捷键
  editor.addShortcut('ctrl+shift+i', '段落首行缩进', () => {
    // 触发按钮点击事件
    const button = editor.ui.registry.getAll().buttons.textindent;
    // @ts-ignore
    if (button && button.onAction) {
      // @ts-ignore
      button.onAction();
    }
  });

  // 添加菜单项
  editor.ui.registry.addMenuItem('textindent', {
    text: '首行缩进',
    icon: 'indent',
    onAction: () => {
      const button = editor.ui.registry.getAll().buttons.textindent;
      // @ts-ignore
      if (button && button.onAction) {
        // @ts-ignore
        button.onAction();
      }
    }
  });
}
