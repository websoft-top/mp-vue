<template>
  <a-drawer
    width="70%"
    :visible="visible"
    :title="`${data?.title}`"
    placement="left"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    :confirm-loading="loading"
    :footer="null"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="navigationId"
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
          :categoryId="categoryId"
          @add="openEdit"
          @remove="removeBatch"
          @batchMove="openMove"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'isStatus'">
          <a-tag v-if="record.isStatus === 1" color="green">开启</a-tag>
          <a-tag v-if="record.isStatus === 2" color="red">关闭</a-tag>
        </template>
        <template v-if="column.key === 'isFree'">
          <a-tag v-if="record.isFree === 1" color="green">免费</a-tag>
          <a-tag v-if="record.isFree === 2" color="orange">收费</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="moveUp(record)">上移<ArrowUpOutlined /></a>
            <a-divider type="vertical" />
            <a @click="openEdit(record)">编辑</a>
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
    <DesignRecordEdit
      v-model:visible="showEdit"
      :merchant="data"
      :categoryId="categoryId"
      :data="current"
      @done="reload"
    />
  </a-drawer>
</template>

<script lang="ts" setup>
  import { createVNode, ref, watch } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import {
    ArrowUpOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import { EleProTable } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import DesignRecordEdit from './components/designRecordEdit.vue';
  import {
    removeCmsDesignRecord,
    removeBatchCmsDesignRecord,
    updateCmsDesignRecord
  } from '@/api/cms/cmsDesignRecord';
  import type { CmsDesignRecord } from '@/api/cms/cmsDesignRecord/model';
  import { CmsNavigation } from '@/api/cms/cmsNavigation/model';
  import { pageCmsDesignRecord } from '@/api/cms/cmsDesignRecord';
  import { CmsDesignRecordParam } from '@/api/cms/cmsDesignRecord/model';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    categoryId?: number | null;
    // 导航信息
    data?: CmsNavigation;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  // 表格选中数据
  const selection = ref<CmsDesignRecord[]>([]);
  // 当前编辑数据
  const current = ref<CmsDesignRecord | null>(null);
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
    where.navigationId = props.categoryId;
    return pageCmsDesignRecord({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      key: 'navigationId',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '组件',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '排序',
      dataIndex: 'sortNumber',
      key: 'sortNumber',
      width: 120,
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
  const reload = (where?: CmsDesignRecordParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsDesignRecord) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsDesignRecord) => {
    const hide = message.loading('请求中..', 0);
    removeCmsDesignRecord(row.periodId)
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
        removeBatchCmsDesignRecord(selection.value.map((d) => d.periodId))
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

  // 上移
  const moveUp = (row?: CmsDesignRecord) => {
    updateCmsDesignRecord({
      periodId: row?.periodId,
      sortNumber: Number(row?.sortNumber) - 1
    }).then((msg) => {
      message.success(msg);
      reload();
    });
  };

  /* 自定义行属性 */
  const customRow = (record: CmsDesignRecord) => {
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

  watch(
    () => props.categoryId,
    (categoryId) => {
      if (categoryId) {
        reload();
      }
    }
  );
</script>

<script lang="ts">
  export default {
    name: 'DesignRecord'
  };
</script>

<style lang="less" scoped></style>
