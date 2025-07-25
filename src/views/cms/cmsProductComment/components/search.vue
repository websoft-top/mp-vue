<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      v-model:value="where.keywords"
      @pressEnter="search"
      @search="search"
    />
    <a-button
      danger
      type="primary"
      class="ele-btn-icon"
      :disabled="selection?.length === 0"
      @click="removeBatch"
    >
      <template #icon>
        <DeleteOutlined />
      </template>
      <span>批量删除</span>
    </a-button>
  </a-space>
</template>

<script lang="ts" setup>
import {watch} from 'vue';
import {CmsProductCommentParam} from "@/api/cms/cmsProductComment/model";
import useSearch from "@/utils/use-search";
import {DeleteOutlined} from "@ant-design/icons-vue";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
  }>(),
  {}
);

const emit = defineEmits<{
  (e: 'search', where?: CmsProductCommentParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 表单数据
const { where } = useSearch<CmsProductCommentParam>({
  keywords: '',
  userId: undefined
});

// 新增
const search = () => {
  emit('search',where);
};

// 批量删除
const removeBatch = () => {
  emit('remove');
};

watch(
  () => props.selection,
  () => {
  }
);
</script>
