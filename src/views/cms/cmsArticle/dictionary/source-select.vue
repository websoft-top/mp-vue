<!-- 文章来源选择下拉框 -->
<template>
  <a-select
    optionFilterProp="label"
    :options="data"
    allow-clear
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
  import { getDictionaryOptions } from '@/utils/common';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
    (e: 'change'): void;
  }>();

  withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择文章来源'
    }
  );

  // 字典数据
  const data = getDictionaryOptions('articleSource');

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };

  /* 选择事件 */
  const onChange = () => {
    emit('change');
  };
</script>
