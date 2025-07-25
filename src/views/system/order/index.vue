<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="orderId"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        :scroll="{ x: 800 }"
        cache-key="proSystemOrderTable"
      >
        <template #toolbar>
          <search
            @search="reload"
            :selection="selection"
            @add="openEdit"
            @remove="removeBatch"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'money'">
            <span class="ele-text-warning">
              ￥{{ formatNumber(record.money) }}
            </span>
          </template>
          <template v-if="column.key === 'type'">
            <a-tag v-if="record.type === 0">续费订单</a-tag>
            <a-tag v-if="record.type === 1" color="purple">普通订单</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此模块吗？"
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
    <order-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { EleProTable, formatNumber } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { messageLoading } from 'ele-admin-pro/es';
  import OrderEdit from './components/order-edit.vue';
  import { pageOrder, removeOrder } from '@/api/system/order';
  import type { Order, OrderParam } from '@/api/system/order/model';
  import { Menu } from '@/api/system/menu/model';
  import Search from '@/views/system/order/components/search.vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { removeBatchCompany } from '@/api/system/company';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '订单号',
      dataIndex: 'orderId',
      width: 90
    },
    {
      title: '订单类型',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      width: 120
    },
    {
      title: '租户名称',
      dataIndex: 'tenantName',
      key: 'tenantName',
      align: 'center'
    },
    {
      title: '订单金额(元)',
      dataIndex: 'money',
      key: 'money',
      align: 'center'
    },
    {
      title: '备注',
      dataIndex: 'comments',
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<Order[]>([]);

  // 当前编辑数据
  const current = ref<Order | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageOrder({ ...where, ...orders, limit, page });
  };

  /* 搜索 */
  const reload = (where?: OrderParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Order) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 自定义行属性 */
  const customRow = (record: Menu) => {
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

  /* 删除单个 */
  const remove = (row: Order) => {
    const hide = messageLoading('请求中..', 0);
    removeOrder(row.orderId)
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
        removeBatchCompany(selection.value.map((d) => d.orderId))
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
</script>

<script lang="ts">
  export default {
    name: 'SystemOrder'
  };
</script>
