<!-- 搜索表单 -->
<template>
  <a-space style="flex-wrap: wrap">
    <a-button
      type="text"
      @click="openUrl(`/website/field`)"
    >字段扩展
    </a-button>
    <a-button
      type="text"
      @click="openUrl('/website/dict')"
    >字典管理
    </a-button>
    <a-button
      type="text"
      @click="openUrl('/website/domain')"
    >域名管理
    </a-button
    >
    <a-button
      type="text"
      @click="openUrl('/website/model')"
    >模型管理
    </a-button
    >
    <a-button
      type="text"
      @click="openUrl('/website/form')"
    >表单管理
    </a-button
    >
    <a-button
      type="text"
      @click="openUrl('/website/lang')"
    >国际化
    </a-button
    >
    <a-button
      type="text"
      @click="openUrl('/website/setting')"
    >网站设置
    </a-button
    >
    <a-button
      type="text"
      class="ele-btn-icon"
      @click="clearSiteInfoCache">
      清除缓存
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {watch,nextTick} from 'vue';
import {CmsWebsite} from '@/api/cms/cmsWebsite/model';
import {openUrl} from "@/utils/common";
import {message} from 'ant-design-vue';
import {removeSiteInfoCache} from "@/api/cms/cmsWebsite";

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
