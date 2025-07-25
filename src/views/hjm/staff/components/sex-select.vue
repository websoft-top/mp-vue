<!-- 角色选择下拉框 -->
<template>
  <a-select
    show-search
    optionFilterProp="label"
    :options="data"
    allow-clear
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { getDictionaryOptions } from '@/utils/common';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择性别'
    }
  );

  // 字典数据
  const data = getDictionaryOptions('sex');

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
