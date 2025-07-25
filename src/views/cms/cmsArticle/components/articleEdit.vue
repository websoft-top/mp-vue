<!-- 编辑弹窗 -->
<template>
  <a-drawer
    width="70%"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑文章' : '添加文章'"
    :body-style="{ paddingBottom: '18px' }"
    @update:visible="updateVisible"
    :confirm-loading="loading"
    @ok="save"
  >
    <template #extra>
      <a-button type="primary" style="margin-right: 8px" @click="save">保存</a-button>
    </template>
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 2, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 20, sm: 20, xs: 20 } : { flex: '1' }
      "
    >
      <a-spin :spinning="loading">
        <!--        <a-tabs type="card" v-model:active-key="active" @change="onChange">-->
        <!--          <a-tab-pane tab="基本信息" key="base">-->
        <a-form-item label="封面图" name="files">
          <SelectFile
            :placeholder="`请选择图片`"
            :limit="6"
            :data="files"
            @done="chooseFile"
            @del="onDeleteFile"
          />
        </a-form-item>
        <a-form-item label="所属栏目" name="categoryId">
          <a-tree-select
            allow-clear
            :tree-data="navigationList"
            tree-default-expand-all
            style="width: 320px"
            placeholder="请选择栏目"
            :value="form.categoryId || undefined"
            :listHeight="700"
            :dropdown-style="{ overflow: 'auto' }"
            @update:value="(value?: number) => (form.categoryId = value)"
            @change="onCategoryId"
          />
        </a-form-item>
        <a-form-item label="文章标题" name="title">
          <div class="title-input-container">
            <a-input
              allow-clear
              placeholder="文章标题"
              v-model:value="form.title"
              @pressEnter="save"
              :maxlength="100"
            />
          </div>
        </a-form-item>
        <a-form-item label="内容详情" name="content">
          <!-- 富文本编辑器 -->
          <div v-if="editor == 1">
            <tinymce-editor
              ref="editorRef"
              class="editor-content"
              v-model:value="content"
              :disabled="disabled"
              :init="config"
              placeholder="支持直接粘贴或拖拽图片，也可点击工具栏图片按钮从文件库选择"
            />
            <div class="file-selector-tip">
              💡 提示：工具栏"图片"按钮从图片库选择，"上传"按钮快速上传图片；"视频"按钮从视频库选择，"上传视频"按钮快速上传视频；"一键排版"按钮自动优化文章格式；"首行缩进"按钮切换段落缩进
            </div>
          </div>

          <!-- Markdown编辑器 -->
          <div v-if="editor == 2">
            <!-- 📝 Markdown编辑器工具栏扩展 -->
            <div class="markdown-toolbar-extension">
              <a-button
                type="primary"
                size="small"
                @click="openMarkdownImageSelector"
                style="margin-right: 8px;"
              >
                📷 从图片库选择
              </a-button>
              <a-button
                type="default"
                size="small"
                @click="openMarkdownVideoSelector"
                style="margin-right: 8px;"
              >
                🎬 从视频库选择
              </a-button>
            </div>

            <MdEditor
              v-model="content"
              :disabled="disabled"
              height="500px"
              :placeholder="'请输入Markdown内容...'"
              :toolbars="markdownToolbars"
              :onUploadImg="onMarkdownUploadImg"
            />
            <div class="file-selector-tip">
              💡 提示：支持Markdown语法，可以使用工具栏按钮从文件库选择图片/视频，也可以直接拖拽上传文件
            </div>
          </div>

          <a-space
            class="py-2 flex items-center text-gray-400"
            v-if="lang == 'zh_CN'"
          >
            <a-switch
              checked-children="AI翻译"
              v-model:checked="form.translation"
            />
            <div v-if="form.translation">启用后，将自动翻译其他语言版本</div>
          </a-space>
        </a-form-item>
        <a-form-item label="摘要">
          <a-textarea
            :rows="3"
            :maxlength="200"
            show-count
            placeholder="请输入文章摘要"
            @focus="onComments"
            v-model:value="form.comments"
          />
        </a-form-item>
        <a-form-item
          label="状态"
          name="status"
          v-if="setting.setting?.articleReview"
        >
          <a-radio-group v-model:value="form.status">
            <a-radio :value="1">待审核</a-radio>
            <a-radio :value="0">已发布</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-divider class="py-4 mb-3"  style="height: 20px" />
        <a-form-item label="关键词" name="tags">
          <a-select
            v-model:value="form.tags"
            mode="tags"
            placeholder="按回车分隔"
          ></a-select>
        </a-form-item>
        <a-form-item label="描述" name="overview">
          <a-textarea
            :rows="3"
            show-count
            placeholder="请输入描述"
            v-model:value="form.overview"
          />
        </a-form-item>
        <a-form-item label="自定义链接" name="pdfUrl">
          <a-input
            allow-clear
            placeholder="https://"
            v-model:value="form.pdfUrl"
          />
        </a-form-item>
        <a-form-item label="文章来源" name="source">
          <source-select
            v-model:value="form.source"
            style="width: 206px"
            :placeholder="`文章来源`"
          />
        </a-form-item>
        <a-form-item
          label="虚拟阅读量"
          name="virtualViews"
          :extra="`用户看到的阅读量(${
                Number(form?.actualViews) + Number(form?.virtualViews)
              }) = 实际阅读量(${form.actualViews}) + 虚拟阅读量(${
                form.virtualViews
              })`"
        >
          <a-input-number
            :min="0"
            :max="999999999"
            style="width: 206px"
            placeholder="请输入虚拟阅读量"
            v-model:value="form.virtualViews"
          />
        </a-form-item>
        <a-form-item label="访问权限" name="permission">
          <a-radio-group v-model:value="form.permission">
            <a-radio :value="0">所有人可见</a-radio>
            <a-radio :value="1">登录可见</a-radio>
            <a-radio :value="2">密码可见</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="访问密码"
          name="password"
          v-if="form.permission == 2"
        >
          <a-input-password
            allow-clear
            placeholder="请输入查看密码"
            v-model:value="password"
          />
        </a-form-item>
        <a-form-item label="排序" name="sortNumber">
          <a-input-number
            :min="0"
            :max="9999"
            style="width: 206px"
            placeholder="请输入排序号"
            v-model:value="form.sortNumber"
          />
        </a-form-item>
        <a-form-item label="发布时间" name="createTime" v-if="isUpdate">
          <a-date-picker
            v-model:value="form.createTime"
            show-time
            placeholder="Select Time"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </a-form-item>
        <!--        </a-tab-pane>-->
        <!--          <a-tab-pane tab="其他选项" key="other">-->
        <!--        </a-tabs>-->
      </a-spin>
    </a-form>
  </a-drawer>

  <!-- 文件库选择弹窗 -->
  <SelectData
    v-model:visible="showFileSelector"
    title="选择图片"
    type="image"
    class="file-selector-modal"
    @done="onFileSelected"
  />

  <!-- 视频库选择弹窗 -->
  <SelectData
    v-model:visible="showVideoSelector"
    title="选择视频"
    type="video"
    class="file-selector-modal"
    @done="onVideoSelected"
  />


</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message, Modal} from 'ant-design-vue';
import {assignObject, htmlToText, uuid} from 'ele-admin-pro';
import {addCmsArticle, updateCmsArticle} from '@/api/cms/cmsArticle';
import {CmsArticle} from '@/api/cms/cmsArticle/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {useI18n} from 'vue-i18n';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance, RuleObject} from 'ant-design-vue/es/form';
import {FileRecord} from '@/api/system/file/model';
import TinymceEditor from '@/components/TinymceEditor/index.vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'md-editor-v3/lib/preview.css';
import {uploadOss} from '@/api/system/file';
import {CmsArticleCategory} from '@/api/cms/cmsArticleCategory/model';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';
import SourceSelect from '@/views/cms/cmsArticle/dictionary/source-select.vue';
import {useWebsiteSettingStore} from '@/store/modules/setting';
import SelectData from '@/components/SelectFile/components/select-data.vue';

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
const setting = useWebsiteSettingStore();
const {locale} = useI18n();
const editor = ref<number>(1);

// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsArticle | null;
  // 商户ID
  merchantId?: number;
  categoryId?: number;
  // 栏目数据
  navigationList?: CmsNavigation[];
  // 栏目数据
  categoryList?: CmsArticleCategory[];
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 是否显示最大化切换按钮
const maxable = ref(true);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);
const images = ref<ItemType[]>([]);
const content = ref('');
const disabled = ref(false);
// 当前选项卡
// const active = ref('base');
const files = ref<ItemType[]>([]);
const category = ref<string[]>([]);
const password = ref();
const lang = localStorage.getItem('i18n-lang');

// 用户信息
const form = reactive<CmsArticle>({
  articleId: undefined,
  // 文章模型
  model: 'detail',
  // 封面图
  image: '',
  // 文章标题
  title: '',
  type: 0,
  // 展现方式
  showType: 10,
  // 文章来源
  source: undefined,
  // 产品概述
  overview: undefined,
  // 标签集
  tags: undefined,
  // 父级栏目ID
  parentId: undefined,
  // 栏目ID
  categoryId: undefined,
  // 栏目名称
  categoryName: undefined,
  // 文章内容
  content: '',
  // 编辑器类型 1富文本 2Markdown
  editor: 1,
  // 虚拟阅读量
  virtualViews: 0,
  // 实际阅读量
  actualViews: 0,
  recommend: undefined,
  translation: true,
  permission: 0,
  password: undefined,
  password2: undefined,
  // 用户ID
  userId: undefined,
  files: '',
  lang: locale.value || undefined,
  // 排序
  sortNumber: 100,
  // 备注
  comments: undefined,
  // 状态
  status: 1,
  // 创建时间
  createTime: '',
  // 更新时间
  updateTime: ''
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  title: [
    {
      required: true,
      message: '请选择文章标题',
      type: 'string',
      trigger: 'blur'
    }
  ],
  categoryId: [
    {
      required: true,
      message: '请选择栏目',
      type: 'number',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      type: 'string',
      message: '请输入文章内容',
      trigger: 'blur',
      validator: async (_rule: RuleObject, value: string) => {
        if (content.value == '') {
          return Promise.reject('请输入文字内容');
        }
        return Promise.resolve();
      }
    }
  ]
});

const chooseImage = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.image = data.path;
};

// 选择栏目
const onCategoryId = (id: number) => {
  form.categoryId = id;
  // 💾 在新增模式下，用户手动选择栏目时也保存到本地存储
  if (!isUpdate.value && id) {
    saveLastCategory(id);
  }
};

const onChange = () => {
  // 加载文章多规格
};

// 📝 编辑器类型切换处理
const onEditorTypeChange = (e: any) => {
  const newEditorType = e.target.value;
  const oldEditorType = editor.value;

  // 如果编辑器类型没有变化，直接返回
  if (newEditorType === oldEditorType) {
    return;
  }

  // 如果当前有内容，提示用户确认切换
  if (content.value && content.value.trim() !== '' && content.value !== '<p><br></p>') {
    Modal.confirm({
      title: '🔄 切换编辑器类型',
      content: '切换编辑器类型可能会影响内容格式，是否继续？',
      okText: '确认切换',
      cancelText: '取消',
      onOk: () => {
        performEditorSwitch(newEditorType, oldEditorType);
      },
      onCancel: () => {
        // 恢复原来的编辑器类型
        editor.value = oldEditorType;
      }
    });
  } else {
    // 没有内容直接切换
    performEditorSwitch(newEditorType, oldEditorType);
  }
};

// 执行编辑器切换
const performEditorSwitch = (newType: number, oldType: number) => {
  try {
    editor.value = newType;

    // 保存编辑器类型偏好到本地存储
    localStorage.setItem('cms_article_editor_preference', newType.toString());

    // 显示切换成功提示
    const editorName = newType === 1 ? '富文本编辑器' : 'Markdown编辑器';
    message.success({
      content: `✅ 已切换到${editorName}`,
      duration: 2
    });

    // 如果有内容，尝试进行格式转换
    if (content.value && content.value.trim() !== '') {
      convertContentFormat(oldType, newType);
    }
  } catch (error) {
    console.error('编辑器切换失败:', error);
    message.error('编辑器切换失败，请重试');
    // 恢复原来的编辑器类型
    editor.value = oldType;
  }
};

// 内容格式转换
const convertContentFormat = (fromType: number, toType: number) => {
  if (!content.value) return;

  try {
    if (fromType === 1 && toType === 2) {
      // 富文本转Markdown（简单转换）
      let markdownContent = content.value
        .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '# $1\n\n')
        .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '## $1\n\n')
        .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '### $1\n\n')
        .replace(/<h4[^>]*>(.*?)<\/h4>/gi, '#### $1\n\n')
        .replace(/<h5[^>]*>(.*?)<\/h5>/gi, '##### $1\n\n')
        .replace(/<h6[^>]*>(.*?)<\/h6>/gi, '###### $1\n\n')
        .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '**$1**')
        .replace(/<b[^>]*>(.*?)<\/b>/gi, '**$1**')
        .replace(/<em[^>]*>(.*?)<\/em>/gi, '*$1*')
        .replace(/<i[^>]*>(.*?)<\/i>/gi, '*$1*')
        .replace(/<code[^>]*>(.*?)<\/code>/gi, '`$1`')
        .replace(/<a[^>]*href="([^"]*)"[^>]*>(.*?)<\/a>/gi, '[$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*alt="([^"]*)"[^>]*>/gi, '![$2]($1)')
        .replace(/<img[^>]*src="([^"]*)"[^>]*>/gi, '![图片]($1)')
        .replace(/<p[^>]*>(.*?)<\/p>/gi, '$1\n\n')
        .replace(/<br[^>]*>/gi, '\n')
        .replace(/<[^>]+>/g, '') // 移除其他HTML标签
        .replace(/\n{3,}/g, '\n\n') // 清理多余换行
        .trim();

      content.value = markdownContent;
      message.info('已尝试将富文本内容转换为Markdown格式');
    } else if (fromType === 2 && toType === 1) {
      // Markdown转富文本（基本转换）
      let htmlContent = content.value
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
        .replace(/^##### (.*$)/gim, '<h5>$1</h5>')
        .replace(/^###### (.*$)/gim, '<h6>$1</h6>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
        .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%;" />')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

      // 包装在段落标签中
      if (htmlContent && !htmlContent.startsWith('<')) {
        htmlContent = '<p>' + htmlContent + '</p>';
      }

      content.value = htmlContent;
      message.info('已尝试将Markdown内容转换为富文本格式');
    }
  } catch (error) {
    console.error('内容格式转换失败:', error);
    message.warning('内容格式转换失败，请手动调整内容格式');
  }
};

const onEditor = (value: any) => {
  editor.value = value.target.value;
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.image = '';
};

const onComments = () => {
  if (form.comments == undefined) {
    form.comments = htmlToText(content.value);
    form.comments = form.comments.slice(0, 120);
  }
};

const chooseFile = (data: FileRecord) => {
  files.value.push({
    uid: data.id,
    url: data.url,
    status: 'done'
  });
  form.files = JSON.stringify(files.value.map((d) => d.url));
};

const onDeleteFile = (index: number) => {
  files.value.splice(index, 1);
};

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);

// 文件库选择弹窗状态
const showFileSelector = ref(false);
const fileSelectCallback = ref<((url: string) => void) | null>(null);

// 视频库选择弹窗状态
const showVideoSelector = ref(false);
const videoSelectCallback = ref<((url: string) => void) | null>(null);

// 📝 Markdown编辑器配置
const markdownToolbars = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog'
] as any;

// 📝 Markdown编辑器图片上传处理
const onMarkdownUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  try {
    const uploadPromises = files.map(async (file) => {
      // 检查文件大小（限制为10MB）
      if (file.size > 10 * 1024 * 1024) {
        message.error(`图片 ${file.name} 大小超过10MB，请选择更小的文件`);
        return null;
      }

      // 检查文件类型
      if (!file.type.startsWith('image/')) {
        message.error(`文件 ${file.name} 不是有效的图片格式`);
        return null;
      }

      try {
        const result = await uploadOss(file);
        return result.url || result.path;
      } catch (error) {
        console.error('图片上传失败:', error);
        message.error(`图片 ${file.name} 上传失败`);
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successUrls = results.filter(url => url !== null) as string[];

    if (successUrls.length > 0) {
      callback(successUrls);
      message.success(`成功上传 ${successUrls.length} 张图片`);
    }
  } catch (error) {
    console.error('批量上传失败:', error);
    message.error('图片上传失败，请重试');
  }
};

// 📝 Markdown编辑器图片选择器
const openMarkdownImageSelector = () => {
  fileSelectCallback.value = (url: string) => {
    // 在当前光标位置插入Markdown图片语法
    const imageMarkdown = `![图片](${url})`;
    insertMarkdownText(imageMarkdown);
  };
  showFileSelector.value = true;
};

// 📝 Markdown编辑器视频选择器
const openMarkdownVideoSelector = () => {
  videoSelectCallback.value = (url: string) => {
    // 在当前光标位置插入Markdown视频语法（使用HTML标签）
    const videoMarkdown = `<video controls style="max-width: 100%; height: auto;">
  <source src="${url}" type="video/mp4">
  您的浏览器不支持视频播放。
</video>`;
    insertMarkdownText(videoMarkdown);
  };
  showVideoSelector.value = true;
};

// 📝 在Markdown编辑器中插入文本
const insertMarkdownText = (text: string) => {
  // 简单的文本插入，在内容末尾添加
  if (content.value) {
    content.value += '\n\n' + text;
  } else {
    content.value = text;
  }
};

const config = ref({
  height: 420,
  paste_data_images: true,
  automatic_uploads: true,

  // 自定义工具栏，移除默认的image和media按钮，添加自定义按钮
  toolbar: [
    'fullscreen preview code codesample emoticons custom_image_selector quick_upload custom_video_selector quick_video_upload auto_format toggle_indent',
    'undo redo | forecolor backcolor',
    'bold italic underline strikethrough',
    'alignleft aligncenter alignright alignjustify',
    'outdent indent | numlist bullist',
    'formatselect fontselect fontsizeselect',
    'link charmap anchor pagebreak | ltr rtl'
  ].join(' | '),

  // 图片上传处理器 - 支持拖拽和粘贴上传
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();

    // 检查文件大小（限制为10MB）
    if (file.size > 10 * 1024 * 1024) {
      error('图片大小不能超过10MB');
      return;
    }

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
      error('只能上传图片文件');
      return;
    }

    // 显示上传进度提示
    const loadingMsg = message.loading('图片上传中...', 0);

    uploadOss(file)
      .then((res) => {
        loadingMsg();
        success(res.url || res.path);
        message.success('图片上传成功');
      })
      .catch((msg) => {
        loadingMsg();
        error(msg || '图片上传失败');
        message.error('图片上传失败：' + msg);
      });
  },

  // 图片工具栏
  image_toolbar: 'alignleft aligncenter alignright | rotateleft rotateright | imageoptions',

  // 图片标题
  image_title: true,

  // 图片描述
  image_description: true,

  // 图片尺寸
  image_dimensions: true,

  // 图片类别
  image_class_list: [
    {title: '无样式', value: ''},
    {title: '响应式图片', value: 'img-responsive'},
    {title: '圆角图片', value: 'img-rounded'},
    {title: '圆形图片', value: 'img-circle'}
  ],

  // 自定义按钮设置
  setup: (editor: any) => {
    // 添加自定义图片选择按钮
    editor.ui.registry.addButton('custom_image_selector', {
      text: '图片',
      icon: 'image',
      tooltip: '插入图片（从文件库选择或上传）',
      onAction: () => {
        // 打开文件库选择弹窗
        fileSelectCallback.value = (url: string) => {
          editor.insertContent(`<img src="${url}" alt="图片" style="max-width: 100%;" />`);
        };
        showFileSelector.value = true;
      }
    });

    // 添加快速上传按钮
    editor.ui.registry.addButton('quick_upload', {
      text: '上传',
      icon: 'upload',
      tooltip: '快速上传图片',
      onAction: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            // 检查文件大小
            if (file.size > 10 * 1024 * 1024) {
              message.error('图片大小不能超过10MB');
              return;
            }

            const loadingMsg = message.loading('图片上传中...', 0);
            uploadOss(file)
              .then((res) => {
                loadingMsg();
                const imageUrl = res.url || res.path;
                editor.insertContent(`<img src="${imageUrl}" alt="${file.name}" style="max-width: 100%;" />`);
                message.success('图片上传成功');
              })
              .catch((msg) => {
                loadingMsg();
                message.error('图片上传失败：' + msg);
              });
          }
        };
        input.click();
      }
    });

    // 添加自定义视频选择按钮
    editor.ui.registry.addButton('custom_video_selector', {
      text: '视频',
      icon: 'embed',
      tooltip: '插入视频（从视频库选择）',
      onAction: () => {
        // 打开视频库选择弹窗
        videoSelectCallback.value = (url: string) => {
          // 插入视频标签，使用HTML5 video元素
          editor.insertContent(`
              <video controls style="max-width: 100%; height: auto;">
                <source src="${url}" type="video/mp4">
                您的浏览器不支持视频播放。
              </video>
            `);
        };
        showVideoSelector.value = true;
      }
    });

    // 添加快速视频上传按钮
    editor.ui.registry.addButton('quick_video_upload', {
      text: '上传视频',
      icon: 'upload',
      tooltip: '快速上传视频',
      onAction: () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          if (file) {
            // 检查文件大小（限制为100MB）
            if (file.size > 100 * 1024 * 1024) {
              message.error('视频大小不能超过100MB');
              return;
            }

            const loadingMsg = message.loading('视频上传中...', 0);
            uploadOss(file)
              .then((res) => {
                loadingMsg();
                const videoUrl = res.path || res.downloadUrl;
                editor.insertContent(`
                    <video controls style="max-width: 100%; height: auto;">
                      <source src="${videoUrl}" type="video/mp4">
                      您的浏览器不支持视频播放。
                    </video>
                  `);
                message.success('视频上传成功');
              })
              .catch((msg) => {
                loadingMsg();
                message.error('视频上传失败：' + msg);
              });
          }
        };
        input.click();
      }
    });

    // 添加一键排版按钮
    editor.ui.registry.addButton('auto_format', {
      text: '一键排版',
      icon: 'template',
      tooltip: '智能优化文章格式和排版',
      onAction: () => {
        // 直接在这里处理排版，因为此时编辑器肯定已经初始化完成
        handleAutoFormat(editor);
      }
    });

    // 添加段落首行缩进切换按钮
    editor.ui.registry.addButton('toggle_indent', {
      text: '首行缩进',
      icon: 'indent',
      tooltip: '切换段落首行缩进（适合中文排版）',
      onAction: () => {
        toggleParagraphIndent(editor);
      }
    });
  }
});

// 从文件库选择图片的回调
const onFileSelected = (data: FileRecord) => {
  if (fileSelectCallback.value) {
    // 使用文件的完整URL，确保有值
    const imageUrl = data.url || data.path || '';
    if (imageUrl) {
      fileSelectCallback.value(imageUrl);
      message.success('图片插入成功');
    }
    fileSelectCallback.value = null;
  }
  showFileSelector.value = false;
};

// 从视频库选择视频的回调
const onVideoSelected = (data: FileRecord) => {
  if (videoSelectCallback.value) {
    // 使用文件的完整URL，确保有值
    const videoUrl = data.path || data.downloadUrl || '';
    if (videoUrl) {
      videoSelectCallback.value(videoUrl);
      message.success('视频插入成功');
    }
    videoSelectCallback.value = null;
  }
  showVideoSelector.value = false;
};

// 🎨 智能一键排版 - 人性化设计
const handleAutoFormat = (editor: any) => {
  try {
    // 1. 检查内容
    const content = editor.getContent();
    if (!content || content.trim() === '' || content === '<p><br></p>' || content === '<p></p>') {
      message.warning({
        content: '📝 请先输入一些内容，然后再使用一键排版功能',
        duration: 3
      });
      return;
    }

    // 2. 显示友好的加载提示
    const loadingMsg = message.loading({
      content: '✨ 正在为您的文章进行智能排版优化...',
      duration: 0
    });

    // 3. 延迟执行，让用户看到加载效果
    setTimeout(() => {
      try {
        const optimizedContent = smartFormatContent(content);
        editor.setContent(optimizedContent);

        loadingMsg();

        // 4. 显示成功提示
        message.success({
          content: '🎉 排版优化完成！您的文章现在看起来更专业了',
          duration: 4
        });

        // 5. 可选：显示优化统计
        showOptimizationStats(content, optimizedContent);

      } catch (error) {
        loadingMsg();
        console.error('排版优化失败:', error);
        message.error({
          content: '😅 排版优化遇到了问题，请检查文章内容后重试',
          duration: 4
        });
      }
    }, 800); // 给用户一个良好的反馈体验

  } catch (error) {
    console.error('一键排版功能错误:', error);
    message.error({
      content: '🔧 功能暂时不可用，请刷新页面后重试',
      duration: 4
    });
  }
};

// 📊 显示优化统计信息
const showOptimizationStats = (originalContent: string, optimizedContent: string) => {
  const stats = analyzeOptimization(originalContent, optimizedContent);

  if (stats.optimizations.length > 0) {
    message.info({
      content: `📈 本次优化: ${stats.optimizations.join('、')}`,
      duration: 6
    });
  }
};

// 🔍 分析优化效果
const analyzeOptimization = (original: string, optimized: string) => {
  const optimizations: string[] = [];

  // 检查各种优化项目
  if ((optimized.match(/<h[1-6][^>]*style/g) || []).length > (original.match(/<h[1-6][^>]*style/g) || []).length) {
    optimizations.push('标题样式');
  }

  if ((optimized.match(/<p[^>]*style/g) || []).length > (original.match(/<p[^>]*style/g) || []).length) {
    optimizations.push('段落格式');
  }

  if ((optimized.match(/<img[^>]*style/g) || []).length > (original.match(/<img[^>]*style/g) || []).length) {
    optimizations.push('图片布局');
  }

  if ((optimized.match(/<ul[^>]*style|<ol[^>]*style/g) || []).length > (original.match(/<ul[^>]*style|<ol[^>]*style/g) || []).length) {
    optimizations.push('列表格式');
  }

  return {optimizations};
};

// 🎨 智能排版核心函数 - 简单而强大
const smartFormatContent = (content: string): string => {
  let optimized = content;

  // 1. 🏷️ 标题优化 - 让标题更有层次感
  optimized = optimized.replace(/<h1([^>]*)>/g, '<h1$1 style="font-size: 28px; font-weight: 700; margin: 24px 0 16px 0; line-height: 1.3; color: #1a1a1a; border-bottom: 2px solid #e8e8e8; padding-bottom: 10px;">');
  optimized = optimized.replace(/<h2([^>]*)>/g, '<h2$1 style="font-size: 24px; font-weight: 600; margin: 20px 0 14px 0; line-height: 1.4; color: #2c2c2c;">');
  optimized = optimized.replace(/<h3([^>]*)>/g, '<h3$1 style="font-size: 20px; font-weight: 600; margin: 18px 0 12px 0; line-height: 1.4; color: #3c3c3c;">');
  optimized = optimized.replace(/<h4([^>]*)>/g, '<h4$1 style="font-size: 16px; font-weight: 600; margin: 14px 0 8px 0; line-height: 1.4; color: #4c4c4c;">');
  optimized = optimized.replace(/<h5([^>]*)>/g, '<h5$1 style="font-size: 14px; font-weight: 600; margin: 12px 0 6px 0; line-height: 1.4; color: #5c5c5c;">');
  optimized = optimized.replace(/<h6([^>]*)>/g, '<h6$1 style="font-size: 13px; font-weight: 600; margin: 10px 0 5px 0; line-height: 1.4; color: #6c6c6c;">');

  // 2. 📝 段落优化 - 让阅读更舒适
  optimized = optimized.replace(/<p([^>]*)>/g, (match, attrs) => {
    if (!attrs.includes('style=')) {
      return `<p${attrs} style="line-height: 1.8; margin: 16px 0; text-indent: 2em; color: #333;">`;
    }
    return match;
  });

  // 3. 🖼️ 图片优化 - 让图片更美观
  optimized = optimized.replace(/<img([^>]*?)>/g, (match, attrs) => {
    if (!attrs.includes('style=')) {
      const hasAlt = attrs.includes('alt=');
      return `<img${attrs} style="max-width: 100%; height: auto; margin: 20px auto; display: block; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"${!hasAlt ? ' alt="图片"' : ''}>`;
    }
    return match;
  });

  // 4. 📋 列表优化 - 让列表更清晰
  optimized = optimized.replace(/<ul([^>]*)>/g, '<ul$1 style="margin: 16px 0; padding-left: 24px; line-height: 1.6;">');
  optimized = optimized.replace(/<ol([^>]*)>/g, '<ol$1 style="margin: 16px 0; padding-left: 24px; line-height: 1.6;">');
  optimized = optimized.replace(/<li([^>]*)>/g, '<li$1 style="margin: 8px 0; color: #333;">');

  // 5. 💬 引用优化 - 让引用更突出
  optimized = optimized.replace(/<blockquote([^>]*)>/g, '<blockquote$1 style="margin: 20px 0; padding: 16px 20px; border-left: 4px solid #1890ff; background: linear-gradient(90deg, #f6f8fa 0%, #ffffff 100%); font-style: italic; color: #555;">');

  // 6. 💻 代码优化 - 让代码更专业
  optimized = optimized.replace(/<code([^>]*)>/g, '<code$1 style="background-color: #f1f3f4; padding: 2px 6px; border-radius: 4px; font-family: \'Fira Code\', Consolas, Monaco, monospace; font-size: 0.9em; color: #d73a49;">');
  optimized = optimized.replace(/<pre([^>]*)>/g, '<pre$1 style="margin: 20px 0; padding: 20px; background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; overflow-x: auto; font-family: \'Fira Code\', Consolas, Monaco, monospace; font-size: 14px; line-height: 1.5;">');

  // 7. 📊 表格优化 - 让表格更美观
  optimized = optimized.replace(/<table([^>]*)>/g, '<table$1 style="width: 100%; border-collapse: collapse; margin: 20px 0; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden;">');
  optimized = optimized.replace(/<th([^>]*)>/g, '<th$1 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px; text-align: left; font-weight: 600;">');
  optimized = optimized.replace(/<td([^>]*)>/g, '<td$1 style="padding: 12px; border-bottom: 1px solid #eee; color: #333;">');

  // 8. 🔗 链接优化 - 让链接更友好
  optimized = optimized.replace(/<a([^>]*)>/g, '<a$1 style="color: #1890ff; text-decoration: none; border-bottom: 1px solid transparent; transition: border-bottom 0.2s ease;" onmouseover="this.style.borderBottom=\'1px solid #1890ff\'" onmouseout="this.style.borderBottom=\'1px solid transparent\'">');

  // 9. ➖ 分隔线优化 - 让分隔线更优雅
  optimized = optimized.replace(/<hr([^>]*)>/g, '<hr$1 style="border: none; height: 2px; background: linear-gradient(90deg, transparent, #e8e8e8, transparent); margin: 30px 0;">');

  // 10. 🧹 清理多余空白
  optimized = optimized.replace(/\s+/g, ' '); // 清理多余空格
  optimized = optimized.replace(/<p[^>]*>\s*<\/p>/g, ''); // 清理空段落
  optimized = optimized.replace(/(<\/[^>]+>)\s+(<[^>]+>)/g, '$1$2'); // 清理标签间空白

  return optimized;
};

// 🔄 段落首行缩进切换功能
const toggleParagraphIndent = (editor: any) => {
  try {
    const content = editor.getContent();

    if (!content || content.trim() === '' || content === '<p><br></p>' || content === '<p></p>') {
      message.warning({
        content: '📝 请先输入一些段落内容，然后再切换首行缩进',
        duration: 3
      });
      return;
    }

    // 检查当前是否有首行缩进
    const hasIndent = content.includes('text-indent: 2em') || content.includes('text-indent:2em');

    let newContent: string;
    let actionText: string;

    if (hasIndent) {
      // 移除首行缩进
      newContent = removeIndentFromParagraphs(content);
      actionText = '已移除段落首行缩进';
    } else {
      // 添加首行缩进
      newContent = addIndentToParagraphs(content);
      actionText = '已添加段落首行缩进';
    }

    editor.setContent(newContent);

    message.success({
      content: `📐 ${actionText}`,
      duration: 3
    });

  } catch (error) {
    console.error('首行缩进切换失败:', error);
    message.error({
      content: '🔧 首行缩进切换失败，请重试',
      duration: 3
    });
  }
};

// 为段落添加首行缩进
const addIndentToParagraphs = (content: string): string => {
  return content.replace(/<p([^>]*)>/g, (match, attrs) => {
    // 如果已经有 style 属性
    if (attrs.includes('style=')) {
      // 检查是否已经有 text-indent
      if (attrs.includes('text-indent')) {
        // 更新现有的 text-indent
        return match.replace(/text-indent:\s*[^;]+;?/g, 'text-indent: 2em;');
      } else {
        // 在现有 style 中添加 text-indent
        return match.replace(/style="([^"]*)"/, 'style="$1 text-indent: 2em;"');
      }
    } else {
      // 添加新的 style 属性
      return `<p${attrs} style="text-indent: 2em;">`;
    }
  });
};

// 从段落移除首行缩进
const removeIndentFromParagraphs = (content: string): string => {
  return content.replace(/<p([^>]*)>/g, (match, attrs) => {
    if (attrs.includes('text-indent')) {
      // 移除 text-indent 属性
      let newAttrs = attrs.replace(/text-indent:\s*[^;]+;?\s*/g, '');

      // 如果 style 属性变空了，移除整个 style 属性
      newAttrs = newAttrs.replace(/style="\s*"/g, '');
      newAttrs = newAttrs.replace(/style=''\s*/g, '');

      return `<p${newAttrs}>`;
    }
    return match;
  });
};

const {resetFields} = useForm(form, rules);

// �💾 保存和恢复栏目选择的功能
const LAST_CATEGORY_KEY = 'cms_article_last_category';

// 保存最后选择的栏目到本地存储
const saveLastCategory = (categoryId: number | undefined) => {
  if (categoryId) {
    localStorage.setItem(LAST_CATEGORY_KEY, categoryId.toString());
  }
};

// 从本地存储获取最后选择的栏目
const getLastCategory = (): number | undefined => {
  const saved = localStorage.getItem(LAST_CATEGORY_KEY);
  return saved ? parseInt(saved) : undefined;
};

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      if (password.value) {
        form.password = password.value;
      }
      if (form.tags) {
        form.tags = JSON.stringify(form.tags);
      }
      // 取第一张图片作为封面图
      if (files.value.length > 0) {
        form.image = files.value[0].url;
        form.files = JSON.stringify(files.value.map((d) => d.url));
      }else {
        form.image = '';
        form.files = '';
      }
      const formData = {
        ...form,
        editor: editor.value || 1,
        status: setting.setting?.articleReview ? 1 : 0,
        content: content.value
      };
      const saveOrUpdate = isUpdate.value ? updateCmsArticle : addCmsArticle;
      saveOrUpdate(formData)
        .then((msg) => {
          loading.value = false;
          message.success(msg);

          // 💾 保存成功后，记住当前选择的栏目（仅在新增时）
          if (!isUpdate.value && form.categoryId) {
            saveLastCategory(form.categoryId);
          }

          updateVisible(false);
          emit('done');
        })
        .catch((e) => {
          message.error(e.message);
        })
        .finally(() => {
          loading.value = false;
        });
    })
    .catch(() => {
    });
};

watch(
  () => props.visible,
  (visible) => {
    if (localStorage.getItem('Editor')) {
      editor.value = Number(localStorage.getItem('Editor'));
    } else {
      editor.value = 1;
    }

    if (visible) {
      images.value = [];
      category.value = [];
      files.value = [];
      content.value = '';

      if (props.data) {
        // 编辑模式：加载现有文章数据
        loading.value = true;
        const data = props.data;
        // 文章详情
        assignObject(form, data);
        if (data.content) {
          content.value = data.content;
        }
        if (!data.source) {
          form.source = undefined;
        }
        if (data.tags) {
          form.tags = JSON.parse(form.tags);
        } else {
          form.tags = undefined;
        }
        if (data.editor) {
          editor.value = data.editor;
        }
        if (data.files) {
          const arr = JSON.parse(data.files);
          arr.map((url: string) => {
            files.value.push({
              uid: uuid(),
              url: url,
              status: 'done'
            });
          });
        }
        if (data.image && !data.files) {
          files.value.push({
            uid: uuid(),
            url: data.image,
            status: 'done'
          });
        }
        loading.value = false;
        isUpdate.value = true;
      } else {
        // 新增模式：恢复上次选择的栏目
        isUpdate.value = false;

        // 🎯 优先级设置栏目：
        // 1. 如果传入了 categoryId（从栏目页面点击添加），使用传入的
        // 2. 否则使用上次保存的栏目
        if (props.categoryId) {
          form.categoryId = props.categoryId;
        } else {
          const lastCategory = getLastCategory();
          if (lastCategory) {
            form.categoryId = lastCategory;
          }
        }
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>

<style lang="less" scoped>
.editor-content {
  :deep(.tox-tinymce) {
    border-radius: 6px;
  }

  // 编辑器内图片样式
  :deep(.mce-content-body) {
    img {
      max-width: 100%;
      height: auto;

      &.img-responsive {
        width: 100%;
        height: auto;
      }

      &.img-rounded {
        border-radius: 8px;
      }

      &.img-circle {
        border-radius: 50%;
      }
    }
  }
}

// 文件选择提示
.file-selector-tip {
  color: #666;
  font-size: 12px;
  margin-top: 4px;
}

// 文件选择弹窗样式
:deep(.file-selector-modal) {
  .ant-modal {
    z-index: 10000 !important;
  }

  .ant-modal-mask {
    z-index: 9999 !important;
  }
}

// 排版选项弹窗样式
:deep(.format-options-modal) {
  .ant-modal {
    z-index: 10000 !important;
  }

  .ant-modal-mask {
    z-index: 9999 !important;
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.format-presets {
  .format-preset-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }

  .format-preset-card {
    border: 2px solid #e8e8e8;
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    background: #ffffff;

    &:hover {
      border-color: #1890ff;
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
      transform: translateY(-2px);
    }

    .preset-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;

      h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        color: #1a1a1a;
      }

      .preset-icon {
        font-size: 24px;
      }
    }

    .preset-description {
      color: #666;
      font-size: 14px;
      margin-bottom: 12px;
      line-height: 1.5;
    }

    .preset-preview {
      background: #f8f9fa;
      border-radius: 4px;
      padding: 12px;

      .preview-title {
        font-weight: 600;
        font-size: 14px;
        color: #1a1a1a;
        margin-bottom: 6px;
      }

      .preview-text {
        font-size: 12px;
        color: #666;
        line-height: 1.4;
      }
    }
  }

  .format-tips {
    background: #f6f8fa;
    border-radius: 8px;
    padding: 16px;
    border-left: 4px solid #1890ff;

    h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }

    ul {
      margin: 0;
      padding-left: 20px;

      li {
        color: #666;
        font-size: 13px;
        line-height: 1.6;
        margin-bottom: 4px;
      }
    }
  }
}

// 📝 编辑器选择器样式
.editor-selector-container {
  margin-bottom: 16px;

  .editor-selector {
    padding: 16px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

    .selector-label {
      font-size: 14px;
      font-weight: 600;
      color: #333;
      margin-right: 16px;
    }

    .editor-radio-group {
      .editor-radio {
        margin-right: 24px;

        .radio-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;

          .radio-icon {
            font-size: 18px;
            margin-bottom: 4px;
          }

          .radio-text {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 2px;
          }

          .radio-desc {
            font-size: 12px;
            color: #666;
            line-height: 1.4;
          }
        }

        &:hover {
          .radio-content {
            .radio-text {
              color: #1890ff;
            }
          }
        }
      }
    }
  }
}

// 📝 编辑器包装器样式
.editor-wrapper {
  margin-top: 16px;
}

// 📝 Markdown编辑器工具栏扩展样式
.markdown-toolbar-extension {
  margin-bottom: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);

  .ant-btn {
    border-radius: 6px;
    font-size: 13px;
    height: 32px;
    display: inline-flex;
    align-items: center;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  }
}
</style>
