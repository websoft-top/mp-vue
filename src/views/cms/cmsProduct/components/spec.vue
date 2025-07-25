<!-- 搜索表单 -->
<template>
  <a-form-item label="交付方式" name="specs">
    <a-radio-group v-model:value="form.specs">
      <a-radio :value="0">单规格</a-radio>
    </a-radio-group>
  </a-form-item>
  <a-radio-group v-model:value="form.deliveryMethod">
    <a-radio-button :value="2"
    >不限
    </a-radio-button
    >
    <a-radio-button :value="0"
    >SaaS交付
    </a-radio-button
    >
    <a-radio-button :value="1"
    >源码交付
    </a-radio-button
    >
  </a-radio-group>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import type {ArticleCount} from '@/api/cms/article/model';
import useSearch from '@/utils/use-search';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';
import {getCount} from '@/api/cms/cmsProduct';
import {CmsProduct, CmsProductParam} from '@/api/cms/cmsProduct/model';
import {listCmsNavigation} from '@/api/cms/cmsNavigation';
import {toTreeData} from 'ele-admin-pro';
import {CmsSpecValue} from "@/api/cms/cmsSpecValue/model";
import {GoodsSku} from "@/api/shop/goodsSku/model";

const props = withDefaults(
  defineProps<{
    // 选中的角色
    selection?: [];
    merchantId?: number;
    navigationList?: CmsNavigation[];
    categoryId?: number;
    model?: string;
    form?: CmsProduct;
  }>(),
  {}
);

const type = ref<string>();
// 统计数据
const articleCount = ref<ArticleCount>();
// 栏目数据
const navigationList = ref<CmsNavigation[]>();
const spec = ref<CmsSpecValue[]>([]);
const skuList = ref<GoodsSku[]>([]);

// 表单数据
const {where, resetFields} = useSearch<CmsProductParam>({
  productId: undefined,
  type: undefined,
  status: undefined,
  keywords: ''
});

const emit = defineEmits<{
  (e: 'search', where?: CmsProductParam): void;
  (e: 'add'): void;
  (e: 'remove'): void;
  (e: 'batchMove'): void;
}>();

// 用户信息
const form = reactive<CmsProduct>({
  productId: undefined,
  type: undefined,
  code: undefined,
  title: undefined,
  image: undefined,
  content: undefined,
  parentId: undefined,
  categoryId: 661,
  menuId: undefined,
  path: undefined,
  specs: 0,
  position: undefined,
  unitName: undefined,
  price: 0,
  salePrice: undefined,
  deductStockType: undefined,
  files: undefined,
  sales: undefined,
  stock: undefined,
  gainIntegral: undefined,
  recommend: undefined,
  merchantId: undefined,
  isShow: undefined,
  status: undefined,
  userId: undefined,
  deleted: undefined,
  tenantId: undefined,
  createTime: undefined,
  updateTime: undefined,
  comments: '',
  sortNumber: 100
});

// 新增
const add = () => {
  emit('add');
};

// 批量删除
const removeBatch = () => {
  emit('remove');
};

const handleSearch = (e) => {
  const text = e.target.value;
  if (text === '已发布') {
    where.status = 0;
  }
  if (text === '待审核') {
    where.status = 1;
  }
  if (text === '已驳回') {
    where.status = 2;
  }
  where.type = text
  emit('search', where);
};

const reload = () => {
  emit('search', where);
};


const chooseSkuImage = (data: FileRecord) => {
  const index = data?.index;
  skuList.value[index].images?.push({
    uid: uuid(),
    url: data.path,
    status: 'done'
  });
  skuList.value[index].image = data.path;
}

const onDeleteSkuItem = (index: number) => {
  images.value.splice(index, 1);
};

const onChange = (text: string) => {
  // 加载商品多规格
  if (text == 'spec') {
    const goodsId = props.data?.goodsId;
    if (goodsId) {
      listGoodsSpec({goodsId}).then(data => {

        const specValue = data[0].specValue;
        if (specValue) {
          spec.value = JSON.parse(specValue).map(d => {
            console.log(d);
            return {
              value: d.value,
              detail: d.detail
            };
          })
        }
        console.log(spec.value);
      })
      listGoodsSku({goodsId}).then(data => {
        skuList.value = data;
      })
    }
  }
};


const onSpec = (row: CmsSpec) => {
  form.specName = row.specName;
  goodsSpec.value = row;
  if (row.specValue) {
    spec.value = JSON.parse(row?.specValue);
  }
}

/*  重置 */
const reset = () => {
  resetFields();
  type.value = undefined;
  reload();
};

// 加载栏目数据
if (!navigationList.value) {
  listCmsNavigation({}).then((res) => {
    navigationList.value = toTreeData({
      data: res?.map((d) => {
        d.value = d.navigationId;
        d.label = d.title;
        return d;
      }),
      idField: 'navigationId',
      parentIdField: 'parentId'
    });
  });
}
// 统计数据
getCount(where).then((data: any) => {
  articleCount.value = data;
});

watch(
  () => props.merchantId,
  () => {
    if (props.categoryId) {
      where.categoryId = props.categoryId;
    }
    reload();
  },
  {immediate: true}
);
</script>
