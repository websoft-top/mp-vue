<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined/>
      </template>
      <span>添加</span>
    </a-button>
<!--    <a-tree-select-->
<!--      allow-clear-->
<!--      :tree-data="navigationList"-->
<!--      tree-default-expand-all-->
<!--      style="width: 240px"-->
<!--      :listHeight="700"-->
<!--      placeholder="请选择栏目"-->
<!--      :value="where.categoryId || undefined"-->
<!--      :dropdown-style="{ overflow: 'auto' }"-->
<!--      @update:value="(value?: number) => (where.categoryId = value)"-->
<!--      @change="onCategoryId"-->
<!--    />-->
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 240px"
      v-model:value="where.keywords"
      @search="reload"
    />
    <a-button type="text" @click="openImport">批量导入</a-button>
  </a-space>

  <!-- 导入弹窗 -->
  <import v-model:visible="showImport" @done="reload"/>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {PlusOutlined} from '@ant-design/icons-vue';
import type {GradeParam} from '@/api/user/grade/model';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import useSearch from "@/utils/use-search";
import {HjmQuestionsParam} from "@/api/hjm/hjmQuestions/model";
import Import from "./Import.vue";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
    navigationList?: CmsNavigation[];
  }>(),
  {}
);

// 是否显示用户导入弹窗
const showImport = ref(false);

const emit = defineEmits<{
  (e: 'search', where?: GradeParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const {where} = useSearch<HjmQuestionsParam>({
  id: undefined,
  courseId: undefined,
  keywords: '',
  type: undefined,
  userId: undefined
});

// 新增
const add = () => {
  emit('add');
};

// 按分类查询
const onCategoryId = (id: number) => {
  where.courseId = id;
  emit('search', where);
};

const reload = () => {
  emit('search', where);
};

/* 打开编辑弹窗 */
const openImport = () => {
  showImport.value = true;
};

watch(
  () => props.selection,
  () => {
  }
);
</script>
