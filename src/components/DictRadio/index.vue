<!-- 选择下拉框 -->
<template>
  <a-radio-group
    v-model:value="content"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
  >
    <a-radio-button
      :value="item.value"
      v-for="(item, index) in data"
      :key="index"
    >
      {{ item.label }}
    </a-radio-button>
  </a-radio-group>
  <!--  <a-radio-group-->
  <!--    :value="value"-->
  <!--    :options="data"-->
  <!--    :placeholder="placeholder"-->
  <!--    @update:value="updateValue"-->
  <!--    @blur="onBlur"-->
  <!--  />-->
</template>

<script lang="ts" setup>
  import { getDictionaryOptions } from '@/utils/common';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: any;
      type?: any;
      placeholder?: string;
      dictCode?: string;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // 字典数据
  const data = getDictionaryOptions(props.dictCode);
  const content = ref<any>()

  /* 更新选中数据 */
  const updateValue = () => {
    emit('update:value', content.value);
  };
  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
