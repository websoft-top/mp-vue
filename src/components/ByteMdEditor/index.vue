<!-- markdown 编辑器 -->
<template>
  <div ref="rootRef" class="ele-bytemd-wrap"></div>
</template>

<script lang="ts" setup>
  import { onMounted, ref, watch } from 'vue';
  import { Editor } from 'bytemd';
  import type { BytemdPlugin, BytemdLocale, ViewerProps } from 'bytemd';
  import 'bytemd/dist/index.min.css';

  const props = withDefaults(
    defineProps<{
      value: string;
      plugins?: BytemdPlugin[];
      sanitize?: (schema: any) => any;
      mode?: 'split' | 'tab' | 'auto';
      previewDebounce?: number;
      placeholder?: string;
      editorConfig?: Record<string, any>;
      locale?: Partial<BytemdLocale>;
      uploadImages?: (
        files: File[]
      ) => Promise<Pick<any, 'url' | 'alt' | 'title'>[]>;
      overridePreview?: (el: HTMLElement, props: ViewerProps) => void;
      maxLength?: number;
      height?: string;
      fullZIndex?: number;
    }>(),
    {
      fullZIndex: 999
    }
  );

  const emit = defineEmits<{
    (e: 'update:value', value?: string): void;
    (e: 'change', value?: string): void;
  }>();

  const rootRef = ref<HTMLElement | null>(null);
  const editor = ref<InstanceType<typeof Editor> | null>(null);

  onMounted(() => {
    editor.value = new Editor({
      target: rootRef.value as HTMLElement,
      props
    });
    editor.value.$on('change', (e: any) => {
      emit('update:value', e.detail.value);
      emit('change', e.detail.value);
    });
  });

  watch(
    [
      () => props.value,
      () => props.plugins,
      () => props.sanitize,
      () => props.mode,
      () => props.previewDebounce,
      () => props.placeholder,
      () => props.editorConfig,
      () => props.locale,
      () => props.uploadImages,
      () => props.maxLength
    ],
    () => {
      const option = { ...props };
      for (let key in option) {
        if (typeof option[key] === 'undefined') {
          delete option[key];
        }
      }
      editor.value?.$set(option);
    }
  );
</script>

<style lang="less" scoped>
  // 修改编辑器高度
  .ele-bytemd-wrap :deep(.bytemd) {
    height: v-bind(height);

    // 修改全屏的 zIndex
    &.bytemd-fullscreen {
      z-index: v-bind(fullZIndex);
    }

    // 去掉默认的最大宽度限制
    .CodeMirror .CodeMirror-lines {
      max-width: 100%;
    }

    pre.CodeMirror-line,
    pre.CodeMirror-line-like {
      padding: 0 24px;
    }

    .markdown-body {
      max-width: 100%;
      padding: 16px 24px;
    }

    // 去掉 github 图标
    .bytemd-toolbar-right > .bytemd-toolbar-icon:last-child {
      display: none;
    }
  }
</style>
