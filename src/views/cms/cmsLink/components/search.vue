<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-button
      :disabled="selection?.length === 0"
      @click="updateBatch"
    >
      移动
    </a-button>
    <a-tree-select
      allow-clear
      :tree-data="navigationList"
      tree-default-expand-all
      style="width: 280px"
      :listHeight="700"
      placeholder="请选择栏目"
      :value="where.categoryId || undefined"
      :dropdown-style="{ overflow: 'auto' }"
      @update:value="(value?: number) => (where.categoryId = value)"
      @change="onCategoryId"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 280px"
      v-model:value="where.keywords"
      @search="reload"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { GradeParam } from '@/api/user/grade/model';
  import { watch } from 'vue';
  import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
  import useSearch from "@/utils/use-search";
  import {CmsLinkParam} from "@/api/cms/cmsLink/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      navigationList?: CmsNavigation[];
    }>(),
    {}
  );

  // 网站ID
  const websiteId = localStorage.getItem('WebsiteId')

  const emit = defineEmits<{
    (e: 'search', where?: GradeParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 表单数据
  const { where } = useSearch<CmsLinkParam>({
    id: undefined,
    categoryId: undefined,
    keywords: '',
    userId: undefined
  });

  // 新增
  const add = () => {
    emit('add');
  };

  // 批量更新
  const updateBatch = () => {
    emit('batchMove');
  }

  // 按分类查询
  const onCategoryId = (id: number) => {
    where.categoryId = id;
    emit('search', where);
  };

  const reload = () => {
    emit('search', where);
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
