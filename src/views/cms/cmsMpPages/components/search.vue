<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
      展开
    </a-button>
    <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
      折叠
    </a-button>
    <a-input-search
      allow-clear
      v-model:value="where.keywords"
      placeholder="请输入搜索关键词"
      @search="search"
      @pressEnter="search"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { watch } from 'vue';
  import useSearch from '@/utils/use-search';
  import { CmsMpPagesParam } from '@/api/cms/cmsMpPages/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  // 表单数据
  const { where } = useSearch<CmsMpPagesParam>({
    keywords: ''
  });

  const emit = defineEmits<{
    (e: 'search', where?: CmsMpPagesParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  /* 搜索 */
  const search = () => {
    emit('search', where);
  };

  // 新增
  const add = () => {
    emit('add');
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
