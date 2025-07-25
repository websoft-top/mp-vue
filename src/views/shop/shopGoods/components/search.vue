<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    <a-button type="primary" class="ele-btn-icon" @click="add">
      <template #icon>
        <PlusOutlined />
      </template>
      <span>添加</span>
    </a-button>
    <a-radio-group v-model:value="type" @change="handleSearch">
      <a-radio-button value="出售中"
        >出售中({{ goodsCount?.totalNum }})
      </a-radio-button>
      <a-radio-button value="待上架"
        >待上架({{ goodsCount?.totalNum2 }})
      </a-radio-button>
      <a-radio-button value="已售罄"
        >已售罄({{ goodsCount?.totalNum3 }})
      </a-radio-button>
    </a-radio-group>
    <a-tree-select
      allow-clear
      :tree-data="navigationList"
      tree-default-expand-all
      style="width: 240px"
      :listHeight="700"
      placeholder="请选择栏目"
      :value="where.categoryId || undefined"
      :dropdown-style="{ overflow: 'auto' }"
      @update:value="(value?: number) => (where.categoryId = value)"
      @change="onCategoryId"
    />
    <a-input-search
      allow-clear
      placeholder="请输入关键词"
      style="width: 360px"
      v-model:value="where.keywords"
      @pressEnter="reload"
      @search="reload"
    />
    <a-button type="text" @click="reset">重置</a-button>
  </a-space>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { ref, watch } from 'vue';
  import { getCount } from '@/api/shop/shopGoods';
  import type { GoodsCount, ShopGoodsParam } from '@/api/shop/shopGoods/model';
  import useSearch from '@/utils/use-search';
  import { getMerchantId } from '@/utils/merchant';
  import {CmsNavigation} from "@/api/cms/cmsNavigation/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
      merchantId?: number;
      navigationList?: CmsNavigation[];
    }>(),
    {
      merchantId: getMerchantId()
    }
  );

  const type = ref<string>();
  // 统计数据
  const goodsCount = ref<GoodsCount>();

  // 表单数据
  const { where, resetFields } = useSearch<ShopGoodsParam>({
    goodsId: undefined,
    isShow: undefined,
    status: undefined,
    stock: undefined,
    categoryId: undefined,
    merchantId: undefined,
    keywords: ''
  });

  const emit = defineEmits<{
    (e: 'search', where?: ShopGoodsParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 新增
  const add = () => {
    emit('add');
  };

  const handleSearch = (e) => {
    const text = e.target.value;
    resetFields();
    if (text === '出售中') {
      where.sceneType = 'on_sale';
    }
    if (text === '待上架') {
      where.sceneType = 'pending';
    }
    if (text === '已售罄') {
      where.sceneType = 'sold_out';
    }
    emit('search', where);
  };

  const reload = () => {
    getCount(where).then((data: any) => {
      goodsCount.value = data;
    });
    emit('search', where);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    type.value = '';
    reload();
  };

  // 按分类查询
  const onCategoryId = (id: number) => {
    where.categoryId = id;
    emit('search', where);
  };

  watch(
    () => props.merchantId,
    (id) => {
      if (Number(id) > 0) {
        where.merchantId = id;
        reload();
      } else {
        where.merchantId = undefined;
        reload();
      }
    },
    { immediate: true }
  );
</script>
