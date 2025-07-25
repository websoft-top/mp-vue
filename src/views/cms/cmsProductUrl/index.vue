<template>
  <ele-pro-table
    ref="tableRef"
    row-key="cmsProductUrlId"
    :columns="columns"
    :datasource="datasource"
    :customRow="customRow"
    :need-page="false"
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
      <template v-if="column.key === 'qrcode'">
        <a-image :src="record.qrcode" :width="50" />
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
  <!-- 编辑弹窗 -->
  <CmsProductUrlEdit v-model:visible="showEdit" :data="current" :productId="productId" @done="reload" />
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsProductUrlEdit from './components/cmsProductUrlEdit.vue';
  import { pageCmsProductUrl, removeCmsProductUrl, removeBatchCmsProductUrl } from '@/api/cms/cmsProductUrl';
  import type { CmsProductUrl, CmsProductUrlParam } from '@/api/cms/cmsProductUrl/model';

  const props = withDefaults(
    defineProps<{
      productId?: number;
    }>(),
    {}
  );

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsProductUrl[]>([]);
  // 当前编辑数据
  const current = ref<CmsProductUrl | null>(null);
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
    where.productId = props.productId;
    return pageCmsProductUrl({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '名称',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '内容',
      dataIndex: 'domain',
      key: 'domain',
      align: 'center',
    },
    {
      title: '二维码',
      dataIndex: 'qrcode',
      key: 'qrcode',
      align: 'center',
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: CmsProductUrlParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsProductUrl) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsProductUrl) => {
    const hide = message.loading('请求中..', 0);
    removeCmsProductUrl(row.id)
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
        removeBatchCmsProductUrl(selection.value.map((d) => d.id))
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
  const customRow = (record: CmsProductUrl) => {
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
    name: 'CmsProductUrl'
  };
</script>

<style lang="less" scoped></style>
