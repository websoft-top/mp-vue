<!-- 省市区级联选择器 -->
<template>
  <a-cascader
    :value="value"
    :options="regionsData"
    :show-search="showSearch"
    :placeholder="placeholder"
    dropdown-class-name="ele-pop-wrap-higher"
    @update:value="updateValue"
    @change="onChange"
  />
</template>

<script lang="ts" setup>
  import { ref, watch, reactive } from 'vue';
  import type { ValueType } from 'ant-design-vue/es/vc-cascader/Cascader';
  import { listShopGoodsCategory } from '@/api/shop/shopGoodsCategory';
  import { toTreeData } from 'ele-admin-pro/es';
  import { ShopGoodsCategory } from '@/api/shop/shopGoodsCategory/model';

  const props = withDefaults(
    defineProps<{
      value?: string[];
      placeholder?: string;
      options?: ShopGoodsCategory[];
      valueField?: 'label';
      type?: 'provinceCity' | 'province';
      showSearch?: boolean;
      merchantId?: number;
    }>(),
    {
      showSearch: true
    }
  );

  const emit = defineEmits<{
    (e: 'done', item?: any, value?: ValueType);
    (e: 'update:value', value?: string[]): void;
    (e: 'load-data-done', value: ShopGoodsCategory[]): void;
  }>();

  // 搜索表单
  const where = reactive<ShopGoodsCategory>({
    merchantId: undefined
  });

  // 级联选择器数据
  const regionsData = ref<ShopGoodsCategory[]>([]);

  /* 更新 value */
  const updateValue = (value: ValueType) => {
    emit('update:value', value as string[]);
  };

  const onChange = (item: any, value: ValueType) => {
    console.log(item, value);
    emit('done', item, value);
  };

  /* 级联选择器数据 value 处理 */
  const formatData = (data: ShopGoodsCategory[]) => {
    if (props.valueField === 'label') {
      return data.map((d) => {
        const item: ShopGoodsCategory = {
          label: d.title,
          value: d.categoryId
        };
        if (d.children) {
          item.children = d.children.map((c) => {
            const cItem: ShopGoodsCategory = {
              label: c.title,
              value: c.categoryId
            };
            if (c.children) {
              cItem.children = c.children.map((cc) => {
                return {
                  label: cc.title,
                  value: cc.categoryId
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
  const filterData = (data: ShopGoodsCategory[]) => {
    return formatData(
      data.map((d) => {
        const item: ShopGoodsCategory = {
          label: d.title,
          value: d.categoryId
        };
        if (d.children) {
          item.children = d.children.map((c) => {
            return {
              label: c.title,
              value: c.categoryId
            };
          });
        }
        return item;
      })
    );
  };

  watch(
    () => props.options,
    () => {
      console.log(props.merchantId);
      if (props.merchantId) {
        where.merchantId = props.merchantId;
      }
      listShopGoodsCategory(where).then((data) => {
        const list = toTreeData({
          data: data?.map((d) => {
            d.value = d.categoryId;
            d.label = d.title;
            return d;
          }),
          idField: 'categoryId',
          parentIdField: 'parentId'
        });
        regionsData.value = filterData(list ?? []);
        emit('load-data-done', data);
      });
    },
    {
      immediate: true
    }
  );
</script>
