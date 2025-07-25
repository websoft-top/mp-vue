<!-- 公共参数数据源 -->
<template>
  <a-select
    :allow-clear="allowClear"
    show-search
    optionFilterProp="label"
    :options="data"
    :value="value"
    class="w-full"
    :placeholder="placeholder"
    @update:value="updateValue"
    @change="change"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { listDictionaryData } from '@/api/system/dictionary-data';
  import type { DictionaryData } from '@/api/system/dictionary-data/model';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'index', index: number): void;
    (e: 'blur'): void;
    (e: 'done', item: DictionaryData): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      allowClear?: boolean;
      width?: number;
      index?: number;
    }>(),
    {
      placeholder: '请选择'
    }
  );

  const data = ref<DictionaryData[]>();

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
    emit('index', Number(props.index));
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };

  const change = (e: any, item: any) => {
    emit('done', item);
  };

  const reload = () => {
    data.value = [];
    listDictionaryData({ dictCode: 'NavigationModel' }).then((list) => {
      data.value = list.map((d) => {
        return {
          label: d.dictDataName,
          value: d.dictDataCode,
          component: d.component
        };
      });
    });
  };

  reload();
</script>
