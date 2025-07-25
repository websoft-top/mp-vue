<!-- 搜索表单 -->
<template>
  <a-space
    style="flex-wrap: wrap"
    v-if="hasRole('superAdmin') || hasRole('admin') || hasRole('foundation')"
  >
    <a-button
      type="text"
      v-if="hasAnyRole(['superAdmin', 'admin'])"
      @click="openUrl('/fence')"
      >电子围栏
    </a-button>
    <a-button
      type="text"
      v-if="hasAnyRole(['superAdmin', 'admin'])"
      @click="openUrl('/hjm/count')"
      >安装车辆统计
    </a-button>
    <a-button
      type="text"
      v-if="hasAnyRole(['superAdmin', 'admin'])"
      @click="openUrl('/hjm/gps-log')"
      >gps定位
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { watch, nextTick } from 'vue';
  import { CmsWebsite } from '@/api/cms/cmsWebsite/model';
  import { openUrl } from '@/utils/common';
  import { hasAnyRole, hasRole } from '@/utils/permission';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      website?: CmsWebsite;
      count?: 0;
    }>(),
    {}
  );

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
