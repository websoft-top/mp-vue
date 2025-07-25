<!-- 机构类型选择下拉框 -->
<template>
  <a-select
    allow-clear
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
  >
    <a-select-option v-for="item in data" :key="item.label" :value="item.value">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
  import { getDictionaryOptions } from '@/utils/common';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
  }>();

  withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择机构类型'
    }
  );

  // 机构类型数据
  const data = getDictionaryOptions('organizationType');

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };
</script>
