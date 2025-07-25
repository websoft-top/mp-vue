<!-- 选择下拉框 -->
<template>
  <a-select
    :allow-clear="allowClear"
    :show-search="showSearch"
    optionFilterProp="label"
    :options="data"
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    :style="`width: ${width}px`"
    @blur="onBlur"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { listSpecValue } from '@/api/shop/specValue';

  const props = withDefaults(
    defineProps<{
      value?: string;
      placeholder?: string;
      showSearch?: string;
      allowClear?: boolean;
      width?: number;
      specId?: number;
      index?: number;
    }>(),
    {
      placeholder: '请选择服务器厂商'
    }
  );

  // specValues
  const data = ref<any>([]);

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
    (e: 'done', value: any, index: number): void;
  }>();

  /* 更新选中数据 */
  const updateValue = (value: string) => {
    emit('update:value', value);
  };

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };

  const onChange = (value: any) => {
    console.log(value);
    data.value.map(d => {
      if(d.value == value){
        emit('done',d, Number(props.index))
      }
    })
  };

  watch(
    () => props.specId,
    (specId) => {
      if (specId) {
        listSpecValue({ specId }).then((list) => {
          data.value = list.map(v => {
              v.label = v.specValue
              v.value = v.specValue
            return v;
          })
        });
      } else {
        data.value = [];
      }
    },
    { immediate: true }
  );
</script>
