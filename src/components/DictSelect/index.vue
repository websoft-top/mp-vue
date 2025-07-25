<!-- 选择下拉框 -->
<template>
  <a-select
    :allow-clear="true"
    :show-search="true"
    optionFilterProp="label"
    :options="data"
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    :style="`width: ${width}px`"
    @change="change"
    @blur="onBlur"
  />
</template>

<script lang="ts" setup>
  import {ref} from 'vue';
  import {listDictData} from "@/api/system/dict-data";

  const data = ref<any[]>([]);

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'index', index: number): void;
    (e: 'blur'): void;
    (e: 'done', item: any): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      dictCode?: string;
      showSearch?: string;
      allowClear?: boolean;
      width?: number;
      index?: number;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // 字典数据
  listDictData({dictCode: props.dictCode}).then(res => {
    data.value = res.map(d => {
      return {
        dictDataId: d.dictDataId,
        dictDataCode: d.dictDataCode,
        dictDataName: d.dictDataName,
        key: d.dictDataCode,
        value: d.dictDataId,
        label: d.dictDataName,
        comments: d.comments
      };
    });
  });

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
    emit('index', Number(props.index));
    emit('done', data.value.find(d => d.value === value))
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };

  const change = (e, item) => {
    emit('done', item);
  };
</script>
