<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsProductSkuId"
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
            <template v-if="column.key === 'image'">
              <a-image :src="record.image" :width="50" />
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green">显示</a-tag>
              <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
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
      <CmsProductSkuEdit v-model:visible="showEdit" :data="current" @done="reload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsProductSkuEdit from './components/cmsProductSkuEdit.vue';
  import { pageCmsProductSku, removeCmsProductSku, removeBatchCmsProductSku } from '@/api/cms/cmsProductSku';
  import type { CmsProductSku, CmsProductSkuParam } from '@/api/cms/cmsProductSku/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsProductSku[]>([]);
  // 当前编辑数据
  const current = ref<CmsProductSku | null>(null);
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
    return pageCmsProductSku({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '主键ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '商品ID',
      dataIndex: 'goodsId',
      key: 'goodsId',
      align: 'center',
    },
    {
      title: '商品属性索引值 (attr_value|attr_value[|....])',
      dataIndex: 'sku',
      key: 'sku',
      align: 'center',
    },
    {
      title: '商品图片',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
    },
    {
      title: '商品价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
    },
    {
      title: '市场价格',
      dataIndex: 'salePrice',
      key: 'salePrice',
      align: 'center',
    },
    {
      title: '成本价',
      dataIndex: 'cost',
      key: 'cost',
      align: 'center',
    },
    {
      title: '库存',
      dataIndex: 'stock',
      key: 'stock',
      align: 'center',
    },
    {
      title: 'sku编码',
      dataIndex: 'skuNo',
      key: 'skuNo',
      align: 'center',
    },
    {
      title: '商品条码',
      dataIndex: 'barCode',
      key: 'barCode',
      align: 'center',
    },
    {
      title: '重量',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center',
    },
    {
      title: '体积',
      dataIndex: 'volume',
      key: 'volume',
      align: 'center',
    },
    {
      title: '唯一值',
      dataIndex: 'uuid',
      key: 'uuid',
      align: 'center',
    },
    {
      title: '状态, 0正常, 1异常',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      sorter: true,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text, 'yyyy-MM-dd')
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
  const reload = (where?: CmsProductSkuParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsProductSku) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsProductSku) => {
    const hide = message.loading('请求中..', 0);
    removeCmsProductSku(row.cmsProductSkuId)
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
        removeBatchCmsProductSku(selection.value.map((d) => d.cmsProductSkuId))
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
  };

  /* 自定义行属性 */
  const customRow = (record: CmsProductSku) => {
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
    name: 'CmsProductSku'
  };
</script>

<style lang="less" scoped></style>
