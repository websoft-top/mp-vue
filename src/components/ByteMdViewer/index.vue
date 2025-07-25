<!-- markdown 解析 -->
<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    ref="rootRef"
    v-html="content"
    class="markdown-body"
    @click="handleClick"
  >
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
  import type { BytemdPlugin } from 'bytemd';
  import { getProcessor } from 'bytemd';

  const props = defineProps<{
    value: string;
    plugins?: BytemdPlugin[];
    sanitize?: (schema: any) => any;
  }>();

  const rootRef = ref<HTMLElement | null>(null);
  const content = ref<any | null>(null);
  const cbs = ref<(void | (() => void))[]>([]);

  const on = () => {
    if (props.plugins && rootRef.value && content.value) {
      cbs.value = props.plugins.map(({ viewerEffect }) => {
        return (
          viewerEffect &&
          viewerEffect({
            markdownBody: rootRef.value as HTMLElement,
            file: content.value
          })
        );
      });
    }
  };

  const off = () => {
    if (cbs.value) {
      cbs.value.forEach((cb) => cb && cb());
    }
  };

  const handleClick = (e: MouseEvent) => {
    const $ = e.target as HTMLElement;
    if ($.tagName !== 'A') {
      return;
    }

    const href = $.getAttribute('href');
    if (!href || !href.startsWith('#')) {
      return;
    }

    const dest = rootRef.value?.querySelector('#user-content-' + href.slice(1));
    if (dest) {
      dest.scrollIntoView();
    }
  };

  watch(
    [() => props.value, () => props.plugins, () => props.sanitize],
    () => {
      try {
        content.value = getProcessor({
          plugins: props.plugins,
          sanitize: props.sanitize
        }).processSync(props.value);
      } catch (e) {
        console.error(e);
      }
      off();
      nextTick(() => {
        on();
      });
    },
    {
      immediate: true
    }
  );

  onMounted(() => {
    on();
  });

  onBeforeUnmount(() => {
    off();
  });
</script>
