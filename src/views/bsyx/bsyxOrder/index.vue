<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="orderId"
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
            @add="openEdit"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            <div @click="onSearch(record)" class="cursor-pointer">{{ record.name || '匿名' }}</div>
          </template>
          <template v-if="column.key === 'phone'">
            <div v-if="record.mobile" class="text-gray-400">{{ record.mobile }}</div>
            <div v-else class="text-gray-600">{{ record.phone }}</div>
          </template>
          <template v-if="column.key === 'payType'">
            <template v-for="item in getPayType()">
              <template v-if="record.payStatus == 1">
                <span v-if="item.value == record.payType">{{ item.label }}</span>
              </template>
              <template v-else>
                <span></span>
              </template>
            </template>
          </template>
          <template v-if="column.key === 'payStatus'">
            <a-tag v-if="record.payStatus == 1" color="green" @click="updatePayStatus(record)">已付款</a-tag>
            <a-tag v-if="record.payStatus == 0" @click="updatePayStatus(record)">未付款</a-tag>
            <a-tag v-if="record.payStatus == 3">未付款,占场中</a-tag>
          </template>
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="50"/>
          </template>
          <template v-if="column.key === 'sex'">
            <a-tag v-if="record.sex === 1">男</a-tag>
            <a-tag v-if="record.sex === 2">女</a-tag>
          </template>
          <template v-if="column.key === 'deliveryStatus'">
            <a-tag v-if="record.deliveryStatus == 10">未核销</a-tag>
            <a-tag v-if="record.deliveryStatus == 20" color="green">已核销</a-tag>
            <a-tag v-if="record.deliveryStatus == 30" color="bule">部分核销</a-tag>
          </template>
          <template v-if="column.key === 'orderStatus'">
            <a-tag v-if="record.orderStatus === 0">未完成</a-tag>
            <a-tag v-if="record.orderStatus === 1" color="green">已完成</a-tag>
            <a-tag v-if="record.orderStatus === 2" color="red">已取消</a-tag>
            <a-tag v-if="record.orderStatus === 3" color="red">取消中</a-tag>
            <a-tag v-if="record.orderStatus === 4" color="red">退款申请中</a-tag>
            <a-tag v-if="record.orderStatus === 5" color="red">退款被拒绝</a-tag>
            <a-tag v-if="record.orderStatus === 6" color="orange">退款成功</a-tag>
            <a-tag v-if="record.orderStatus === 7" color="pink">客户端申请退款</a-tag>
          </template>
          <template v-if="column.key === 'isInvoice'">
            <a-tag v-if="record.isInvoice == 0">未开具</a-tag>
            <a-tag v-if="record.isInvoice == 1" color="green">已开具</a-tag>
            <a-tag v-if="record.isInvoice == 2" color="blue">不能开具</a-tag>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">显示</a-tag>
            <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
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
    <OrderInfo v-model:visible="showEdit" :data="current" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import type {EleProTable} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/bszx/extra.vue";
import {pageBszxOrder} from "@/api/bszx/bszxOrder";
import OrderInfo from './components/orderInfo.vue';
import {ShopOrder, ShopOrderParam} from "@/api/shop/shopOrder/model";
import {updateShopOrder} from "@/api/shop/shopOrder";
import {message} from "ant-design-vue";
import {updateUser} from "@/api/system/user";
import {getPayType} from '@/utils/shop';
import {repairOrder} from "@/api/bszx/bszxPay";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<ShopOrder[]>([]);
// 当前编辑数据
const current = ref<ShopOrder | null>(null);
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
  return pageBszxOrder({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: '订单号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    align: 'center',
    width: 200,
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
    align: 'center'
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center'
  },
  {
    title: '实付金额',
    dataIndex: 'payPrice',
    key: 'payPrice',
    align: 'center',
    customRender: ({text}) => '￥' + text
  },
  {
    title: '支付方式',
    dataIndex: 'payType',
    key: 'payType',
    align: 'center'
  },
  {
    title: '支付状态',
    dataIndex: 'payStatus',
    key: 'payStatus',
    align: 'center'
  },
  {
    title: '核销状态',
    dataIndex: 'deliveryStatus',
    key: 'deliveryStatus',
    align: 'center',
  },
  {
    title: '开票状态',
    dataIndex: 'isInvoice',
    key: 'isInvoice',
    align: 'center',
  },
  {
    title: '订单状态',
    dataIndex: 'orderStatus',
    key: 'orderStatus',
    align: 'center',
  },
  // {
  //   title: '支付时间',
  //   dataIndex: 'payTime',
  //   key: 'payTime',
  //   align: 'center',
  //   width: 180,
  //   sorter: true,
  //   ellipsis: true
  // },
  {
    title: '下单时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 180,
    sorter: true,
    ellipsis: true
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   width: 180,
  //   fixed: 'right',
  //   align: 'center',
  //   hideInSetting: true
  // }
]);

/* 搜索 */
const reload = (where?: ShopOrderParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

const onSearch = (item: ShopOrder) => {
  reload({userId: item.userId})
}

/* 打开编辑弹窗 */
const openEdit = (row?: ShopOrder) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/**
 * 修复订单支付状态
 */
const updatePayStatus = (record: ShopOrder) => {
  // 修复订单
  repairOrder(record).then(() => {
    message.success('修复成功');
  }).then(() => {
    if(record.realName == '' || record.realName == undefined){
      // 更新用户真实姓名
      updateUser({
        userId: record.userId,
        realName: record.realName
      })
    }
    reload();
  })
}

/* 查询 */
const query = () => {
  loading.value = true;
};

/* 自定义行属性 */
const customRow = (record: ShopOrder) => {
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
import * as MenuIcons from '@/layout/menu-icons';

export default {
  name: 'BszxOrder',
  components: MenuIcons
};
</script>

<style lang="less" scoped></style>
