<!-- 搜索表单 -->
<template>
  <a-space style="flex-wrap: wrap" v-if="hasRole('superAdmin') || hasRole('admin') || hasRole('foundation')">
    <a-button
      type="text"
      v-if="hasPermission('sys:org:list')"
      @click="openUrl('/staff')"
    >人员管理
    </a-button
    >
    <a-button
      type="text"
      v-if="hasPermission('sys:userVerify:list')"
      @click="openUrl('/system/user-verify')"
    >实名认证
    </a-button
    >
    <a-button
      type="text"
      v-if="hasAnyRole(['superAdmin','admin'])"
      @click="openUrl('/system/admin')"
    >管理员列表
    </a-button
    >
  </a-space>
</template>

<script lang="ts" setup>
import {watch, nextTick} from 'vue';
import {CmsWebsite} from '@/api/cms/cmsWebsite/model';
import {openUrl} from "@/utils/common";
import {hasAnyRole, hasPermission, hasRole} from "@/utils/permission";

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
})

watch(
  () => props.selection,
  () => {
  }
);
</script>
