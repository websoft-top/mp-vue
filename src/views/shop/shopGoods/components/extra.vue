<!-- 搜索表单 -->
<template>
  <a-space
    style="flex-wrap: wrap"
    v-if="hasRole('superAdmin') || hasRole('admin') || hasRole('foundation')"
  >
    <a-button type="text" @click="push('/website/navigation')">商品分类</a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { watch, nextTick } from 'vue';
  import { CmsWebsite } from '@/api/cms/cmsWebsite/model';
  import { push } from '@/utils/common';
  import { hasRole } from '@/utils/permission';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      website?: CmsWebsite;
      count?: 0;
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'add'): void;
  }>();

  nextTick(() => {
    if (localStorage.getItem('NotActive')) {
      // IsActive.value = false
    }
  });

  watch(
    () => props.selection,
    () => {}
  );
</script>
