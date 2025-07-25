<!-- 搜索表单 -->
<template>
  <a-space style="flex-wrap: wrap" v-if="hasRole('superAdmin') || hasRole('admin') || hasRole('foundation')">
<!--    <a-button-->
<!--      type="text"-->
<!--      @click="openUrl('/courses')"-->
<!--    >课程管理-->
<!--    </a-button>-->
  </a-space>
</template>

<script lang="ts" setup>
import {watch,nextTick} from 'vue';
import {CmsWebsite} from '@/api/cms/cmsWebsite/model';
import {message} from 'ant-design-vue';
import {removeSiteInfoCache} from "@/api/cms/cmsWebsite";
import {hasRole} from "@/utils/permission";

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

const add = () => {
  emit('add');
};

// 清除缓存
const clearSiteInfoCache = () => {
  removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId') + "*").then(
    (msg) => {
      if (msg) {
        message.success(msg);
      }
    }
  );
};

nextTick(() => {
  if(localStorage.getItem('NotActive')){
    // IsActive.value = false
  }
})

watch(
  () => props.selection,
  () => {
  }
);
</script>
