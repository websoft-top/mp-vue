<!-- 选择下拉框 -->
<template>
  <a-select
    allow-clear
    :show-search="true"
    optionFilterProp="label"
    :options="list"
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    :style="`width: ${width}px`"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { listForm } from '@/api/cms/form';
  import { ref } from 'vue';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'index', index: number): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      dictCode?: string;
      showSearch?: string;
      width?: number;
      index?: number;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // 下拉数据
  const list = ref<any[]>([]);

  listForm({}).then((data) => {
    list.value = data.map((d) => {
      return {
        label: d.name,
        value: d.formId
      };
    });
  });

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
    emit('index', Number(props.index));
  };
  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
