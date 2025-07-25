<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      v-model:value="where.keywords"
      @pressEnter="search"
      @search="search"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { watch } from 'vue';
  import useSearch from '@/utils/use-search';
  import { CmsMpAdParam } from '@/api/cms/cmsMpAd/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: CmsMpAdParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 新增
  const add = () => {
    emit('add');
  };

  // 表单数据
  const { where, resetFields } = useSearch<CmsMpAdParam>({
    adId: undefined,
    keywords: undefined
  });

  const search = () => {
    emit('search', where);
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
