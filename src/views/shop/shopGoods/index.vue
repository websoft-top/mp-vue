<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="goodsId"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
      >
        <template #toolbar>
          <search
            @search="reload"
            :selection="selection"
            :navigationList="navigationList"
            @add="openEdit"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <a-space class="flex items-center">
              <a-image :src="record.image" v-if="record.image" :width="50"/>
              <span class="text-gray-700 font-bold">{{ record.name }}</span>
            </a-space>
          </template>
          <template v-if="column.key === 'recommend'">
            <a-space @click="onRecommend(record)">
              <span v-if="record.recommend === 1" class="ele-text-success"
              ><CheckOutlined
              /></span>
              <span v-else class="ele-text-placeholder"><CloseOutlined/></span>
            </a-space>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">出售中</a-tag>
            <a-tag v-if="record.status === 1" color="orange">待上架</a-tag>
            <a-tag v-if="record.status === 2" color="purple">待审核</a-tag>
            <a-tag v-if="record.status === 3" color="red">审核不通过</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                title="确定要删除此记录吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <ShopGoodsEdit v-model:visible="showEdit" :navigationList="navigationList" :data="current" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined, CheckOutlined, CloseOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import {toTreeData} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import ShopGoodsEdit from './components/shopGoodsEdit.vue';
import Extra from '@/views/shop/shopGoods/components/extra.vue';
import {
  pageShopGoods,
  removeShopGoods,
  removeBatchShopGoods, updateShopGoods
} from '@/api/shop/shopGoods';
import type {ShopGoods, ShopGoodsParam} from '@/api/shop/shopGoods/model';
import {getPageTitle} from '@/utils/common';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import {listCmsNavigation} from "@/api/cms/cmsNavigation";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<ShopGoods[]>([]);
// 当前编辑数据
const current = ref<ShopGoods | null>(null);
// 栏目数据
const navigationList = ref<CmsNavigation[]>();
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders,
                                          filters
                                        }) => {
  if (filters) {
    where.status = filters.status;
  }
  return pageShopGoods({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: 'ID',
    dataIndex: 'goodsId',
    key: 'goodsId',
    align: 'center',
    width: 90
  },
  {
    title: '商品',
    dataIndex: 'name',
    key: 'name',
    width: 280
  },
  // {
  //   title: '编号',
  //   dataIndex: 'code',
  //   key: 'code',
  //   align: 'center',
  // },
  {
    title: '价格',
    dataIndex: 'price',
    key: 'price',
    align: 'center'
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
    align: 'center'
  },
  {
    title: '库存',
    dataIndex: 'stock',
    key: 'stock',
    align: 'center'
  },
  {
    title: '推荐',
    dataIndex: 'recommend',
    key: 'recommend',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  // {
  //   title: '备注',
  //   dataIndex: 'comments',
  //   key: 'comments',
  //   align: 'center',
  // },
  {
    title: '排序号',
    dataIndex: 'sortNumber',
    key: 'sortNumber',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: true,
    ellipsis: true,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
  {
    title: '操作',
    key: 'action',
    width: 180,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: ShopGoodsParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: ShopGoods) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: ShopGoods) => {
  const hide = message.loading('请求中..', 0);
  removeShopGoods(row.goodsId)
    .then((msg) => {
      hide();
      message.success(msg);
      reload();
    })
    .catch((e) => {
      hide();
      message.error(e.message);
    });
};

/* 批量删除 */
const removeBatch = () => {
  if (!selection.value.length) {
    message.error('请至少选择一条数据');
    return;
  }
  Modal.confirm({
    title: '提示',
    content: '确定要删除选中的记录吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = message.loading('请求中..', 0);
      removeBatchShopGoods(selection.value.map((d) => d.goodsId))
        .then((msg) => {
          hide();
          message.success(msg);
          reload();
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    }
  });
};

/* 查询 */
const query = () => {
  loading.value = true;
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
};

const onRecommend = (row: ShopGoods) => {
  updateShopGoods({
    ...row,
    recommend: row.recommend == 1 ? 0 : 1
  }).then((msg) => {
    message.success(msg);
    reload();
  });
};

/* 自定义行属性 */
const customRow = (record: ShopGoods) => {
  return {
    // 行点击事件
    onClick: () => {
      // console.log(record);
    },
    // 行双击事件
    onDblclick: () => {
      openEdit(record);
    }
  };
};
query();
</script>

<script lang="ts">
export default {
  name: 'ShopGoods'
};
</script>

<style lang="less" scoped></style>
