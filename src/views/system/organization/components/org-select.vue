<!-- 机构选择下拉框 -->
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
  import type { Organization } from '@/api/system/organization/model';

  const emit = defineEmits<{
    (e: 'update:value', value?: number): void;
  }>();

  withDefaults(
    defineProps<{
      // 选中的数据(v-modal)
      value?: number;
      // 提示信息
      placeholder?: string;
      // 机构数据
      data: Organization[];
    }>(),
    {
      placeholder: '请选择角色'
    }
  );

  /* 更新选中数据 */
  const updateValue = (value?: number) => {
    emit('update:value', value);
  };
</script>
