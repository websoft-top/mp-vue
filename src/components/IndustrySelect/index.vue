<!-- 省市区级联选择器 -->
<template>
  <a-cascader
    :value="value"
    :options="regionsData"
    :show-search="showSearch"
    :placeholder="placeholder"
    dropdown-class-name="ele-pop-wrap-higher"
    @update:value="updateValue"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';
  import type { IndustryData } from './types';
  import { getIndustryData } from './load-data';

  const props = withDefaults(
    defineProps<{
      value?: string[];
      placeholder?: string;
      options?: IndustryData[];
      valueField?: 'label';
      type?: 'provinceCity' | 'province';
      showSearch?: boolean;
    }>(),
    {
      showSearch: true
    }
  );

  const emit = defineEmits<{
    (e: 'update:value', value?: string[]): void;
    (e: 'load-data-done', value: IndustryData[]): void;
  }>();

  // 级联选择器数据
  const regionsData = ref<IndustryData[]>([]);

  /* 更新 value */
  const updateValue = (value: ValueType) => {
    emit('update:value', value as string[]);
  };

  /* 级联选择器数据 value 处理 */
  const formatData = (data: IndustryData[]) => {
    if (props.valueField === 'label') {
      return data.map((d) => {
        const item: IndustryData = {
          label: d.label,
          value: d.label
        };
        if (d.children) {
          item.children = d.children.map((c) => {
            const cItem: IndustryData = {
              label: c.label,
              value: c.label
            };
            if (c.children) {
              cItem.children = c.children.map((cc) => {
                return {
                  label: cc.label,
                  value: cc.label
                };
              });
            }
            return cItem;
          });
        }
        return item;
      });
    } else {
      return data;
    }
  };

  /* 省市区数据筛选 */
  const filterData = (data: IndustryData[]) => {
    if (props.type === 'provinceCity') {
      return formatData(
        data.map((d) => {
          const item: IndustryData = {
            label: d.label,
            value: d.value
          };
          if (d.children) {
            item.children = d.children.map((c) => {
              return {
                label: c.label,
                value: c.value
              };
            });
          }
          return item;
        })
      );
    } else if (props.type === 'province') {
      return formatData(
        data.map((d) => {
          return {
            label: d.label,
            value: d.value
          };
        })
      );
    } else {
      return formatData(data);
    }
  };

  watch(
    () => props.options,
    (options) => {
      regionsData.value = filterData(options ?? []);
      if (!options) {
        getIndustryData().then((data) => {
          regionsData.value = filterData(data ?? []);
          emit('load-data-done', data);
        });
      }
    },
    {
      immediate: true
    }
  );
</script>
