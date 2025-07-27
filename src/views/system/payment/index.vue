<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="id"
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
              @remove="removeBatch"
              @batchMove="openMove"
            />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'name'">
              <a-space class="ele-cell">
                <a-avatar :src="record.image" size="small" shape="square" />
                <span class="ele-text-secondary">{{ record.name }}</span>
              </a-space>
            </template>
            <template v-if="column.key === 'code'">
              <span class="ele-text-secondary">{{ record.code }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <a-switch
                v-model:checked="record.status"
                @change="updateStatus(record)"
              />
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">修改</a>
                <a-divider type="vertical" />
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
      <PaymentEdit v-model:visible="showEdit" :data="current" @done="reload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import {
    ExclamationCircleOutlined,
    WechatOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import PaymentEdit from './components/paymentEdit.vue';
  import {
    pagePayment,
    removePayment,
    removeBatchPayment,
    updatePayment, certHealth, wechatCertTest
  } from '@/api/system/payment';
  import type { Payment, PaymentParam } from '@/api/system/payment/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<Payment[]>([]);
  // 当前编辑数据
  const current = ref<Payment | null>(null);
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
    return pagePayment({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '支付方式',
      dataIndex: 'name',
      key: 'name'
    },
    // {
    //   title: '标识',
    //   dataIndex: 'code',
    //   key: 'code',
    //   width: 280,
    //   align: 'center'
    // },
    // {
    //   title: '商户号类型',
    //   dataIndex: 'wechatType',
    //   key: 'wechatType',
    //   align: 'center',
    //   width: 180,
    //   customRender: ({ text }) => ['普通商户', '子商户'][text]
    // },
    {
      title: '是否启用',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      align: 'center'
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
  const reload = (where?: PaymentParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Payment) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  const updateStatus = (item: Payment) => {
    updatePayment(item)
      .then((msg) => {
        message.success(msg);
      })
      .catch((msg) => {
        message.error(msg);
      });
  };

  /* 删除单个 */
  const remove = (row: Payment) => {
    const hide = message.loading('请求中..', 0);
    removePayment(row.id)
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
        removeBatchPayment(selection.value.map((d) => d.id))
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
    certHealth().then((data) => {
      console.log(data,'微信支付证书健康状态')
    })
    wechatCertTest().then((data) => {
      console.log(data,'微信支付证书测试')
    })
  };

  /* 自定义行属性 */
  const customRow = (record: Payment) => {
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
    name: 'Payment'
  };
</script>

<style lang="less" scoped></style>
