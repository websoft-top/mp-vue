<template>
  <a-modal
    :width="450"
    :visible="visible"
    :title="title || '分享二维码'"
    :maskClosable="false"
    @cancel="save"
    @ok="save"
  >
    <div class="flex p-3 flex-col justify-center items-center">
      <ele-qr-code-svg :value="`${data}`" :size="260" />
      <span class="text-gray-400 py-3" @click="copyText(data)">{{ data }}</span>
      <span class="text-gray-500 text-lg">
        使用手机扫一扫
      </span>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
  import {CmsArticle} from "@/api/cms/cmsArticle/model";
  import {copyText} from "@/utils/common";

  withDefaults(
    defineProps<{
      // 弹窗是否打开
      visible: boolean;
      title: String | undefined;
      data: CmsArticle;
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'done'): void;
  }>();

  const save = () => {
    emit('done');
  };
</script>
