<!-- 搜索表单 -->
<template>
<!--  <a-space style="flex-wrap: wrap">-->
<!--    <a-button-->
<!--      type="text"-->
<!--      @click="openUrl(`/website/plug`)"-->
<!--    >企业官网-->
<!--    </a-button>-->
<!--    <a-button-->
<!--      type="text"-->
<!--      @click="openUrl('/website/plug')"-->
<!--    >项目管理-->
<!--    </a-button-->
<!--    >-->
<!--    <a-button-->
<!--      type="text"-->
<!--      @click="openUrl('/website/plug')"-->
<!--    >河马商店-->
<!--    </a-button-->
<!--    >-->
<!--  </a-space>-->
  <a-space :size="10" style="flex-wrap: wrap">
<!--    <a-button type="primary" class="ele-btn-icon">-->
<!--      <template #icon>-->
<!--        <PlusOutlined/>-->
<!--      </template>-->
<!--      <span>创建应用</span>-->
<!--    </a-button>-->
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      v-model:value="where.keywords"
      @pressEnter="search"
      @search="search"
      style="width: 240px"
    />
  </a-space>
</template>

<script lang="ts" setup>
import {PlusOutlined} from '@ant-design/icons-vue';
import type {CompanyParam} from '@/api/system/company/model';
import {watch} from 'vue';
import useSearch from "@/utils/use-search";
import {openSpmUrl} from "@/utils/common";
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
    navigationList?: CmsNavigation[];
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'search', where?: CompanyParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const {where, resetFields} = useSearch<CompanyParam>({
  companyId: undefined,
  userId: undefined,
  phone: undefined,
  tenantId: undefined,
  version: undefined,
  type: undefined,
  official: undefined,
  keywords: undefined
});

// 新增
const add = () => {
  openSpmUrl(`https://websoft.top/passport/login`)
};

// 按分类查询
const onCategoryId = (id: number) => {
  where.categoryId = id;
  emit('search', where);
};

const search = () => {
  emit('search', {
    ...where
  });
};

/*  重置 */
const reset = () => {
  resetFields();
  search();
};

watch(
  () => props.selection,
  () => {
  }
);
</script>
