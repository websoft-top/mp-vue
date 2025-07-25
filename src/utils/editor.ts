import { ref } from 'vue';
import TinymceEditor from '@/components/TinymceEditor/index.vue';

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);
// 编辑器配置信息
export function editorConfig(height?: 500): void {
  const resultData = ref<any>({
    height: height,
    // 自定义文件上传(这里使用把选择的文件转成 blob 演示)
    file_picker_callback: (callback: any, _value: any, meta: any) => {
      const input = document.createElement('input');
      input.setAttribute('type', 'file');
      // 设定文件可选类型
      if (meta.filetype === 'image') {
        input.setAttribute('accept', 'image/*');
      } else if (meta.filetype === 'media') {
        input.setAttribute('accept', 'video/*');
      }
      input.onchange = () => {
        const file = input.files?.[0];
        if (!file) {
          return;
        }
        if (meta.filetype === 'media') {
          if (!file.type.startsWith('video/')) {
            editorRef.value?.alert({ content: '只能选择视频文件' });
            return;
          }
        }
        if (file.size / 1024 / 1024 > 20) {
          editorRef.value?.alert({ content: '大小不能超过 20MB' });
          return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result != null) {
            const blob = new Blob([e.target.result], { type: file.type });
            callback(URL.createObjectURL(blob));
          }
        };
        reader.readAsArrayBuffer(file);
      };
      input.click();
    }
  });
  return resultData;
}
