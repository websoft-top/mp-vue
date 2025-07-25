<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 240px"
      v-model:value="where.keywords"
      @search="reload"
    />
  </a-space>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import type {CmsArticle, CmsArticleParam} from '@/api/cms/cmsArticle/model';
import useSearch from '@/utils/use-search';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: CmsArticle[];
    merchantId?: number;
    navigationList?: CmsNavigation[];
    categoryId?: number;
  }>(),
  {}
);

// 表单数据
const {where} = useSearch<CmsArticleParam>({
  articleId: undefined,
  model: undefined,
  categoryId: undefined,
  merchantId: undefined,
  keywords: '',
  sceneType: undefined,
  userId: undefined
});

const emit = defineEmits<{
  (e: 'search', where?: CmsArticleParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

const reload = () => {
  emit('search', where);
};

// 按分类查询
const onCategoryId = (id: number) => {
  where.categoryId = id;
  emit('search', where);
};

watch(
  () => props.merchantId,
  () => {
    if (props.categoryId) {
      where.categoryId = props.categoryId;
    }
    reload();
  },
  {immediate: true}
);
</script>
