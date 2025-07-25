<template>
  <a-select
    style="min-width: 100px"
    show-search
    optionFilterProp="label"
    :options="data"
    allow-clear
    :value="value"
    mode="multiple"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue';
  import { listDictionaryData } from '@/api/system/dictionary-data';
  import type { SelectProps } from 'ant-design-vue';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      dictCode?: string;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // 字典数据
  const data = ref<SelectProps['options']>([]);

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };
  /* 获取字典数据 */
  listDictionaryData({
    dictCode: props.dictCode
  })
    .then((list) => {
      data.value = list.map((d) => {
        return {
          value: d.dictDataCode,
          label: d.dictDataName
        };
      });
    })
    .catch((e) => {
      message.error(e.message);
    });

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
