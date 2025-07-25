<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-input-search
      allow-clear
      v-model:value="where.keywords"
      placeholder="租户ID|域名"
      @search="search"
      @pressEnter="search"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import useSearch from '@/utils/use-search';
  import { DomainParam } from '@/api/system/domain/model';

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: DomainParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 新增
  const add = () => {
    emit('add');
  };

  /* 搜索 */
  const search = () => {
    emit('search', where);
  };

  // 表单数据
  const { where } = useSearch<DomainParam>({
    keywords: ''
  });

  watch(
    () => props.selection,
    () => {}
  );
</script>
