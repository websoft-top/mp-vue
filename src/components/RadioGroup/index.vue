<!-- 选择下拉框 -->
<template>
  <a-radio-group
    :value="value"
    :options="data"
    :option-type="type"
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

  const props = withDefaults(
    defineProps<{
      value?: string;
      type?: string;
      placeholder?: string;
      dictCode?: string;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // 字典数据
  const data = getDictionaryOptions(props.dictCode);

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    console.log(value);
    emit('update:value', value);
  };
  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
