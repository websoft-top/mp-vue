<!-- 目录选择下拉框 -->
<template>
  <a-tree-select
    allow-clear
    tree-default-expand-all
    :placeholder="placeholder"
    :value="value || undefined"
    :tree-data="data"
    :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
    @update:value="updateValue"
  />
</template>

<script lang="ts" setup>
  import type { Goods } from '@/api/goods/model';

  const emit = defineEmits<{
    (e: 'update:value', value?: number): void;
  }>();

  withDefaults(
    defineProps<{
      // 选中的数据(v-modal)
      value?: number;
      // 提示信息
      placeholder?: string;
      // 文章分类
      data: Goods[];
    }>(),
    {
      placeholder: '请选择上级分类'
    }
  );

  /* 更新选中数据 */
  const updateValue = (value?: number) => {
    emit('update:value', value);
  };
</script>
