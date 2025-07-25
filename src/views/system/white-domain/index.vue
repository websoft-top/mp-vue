<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="id"
          :columns="columns"
          :datasource="datasource"
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
              <a @click="openPreview('/docs/' + record.code)">{{
                record.name
              }}</a>
            </template>
            <template v-if="column.key === 'path'">
              <span class="ele-text-placeholder">{{ record.path }}</span>
            </template>
            <template v-if="column.key === 'component'">
              <span class="ele-text-placeholder">{{ record.component }}</span>
            </template>
            <template v-if="column.key === 'photo'">
              <a-image :src="record.photo" />
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green">正常</a-tag>
              <a-tag v-if="record.status === 1" color="red">关闭</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a-popconfirm
                  title="确定要删除此记录吗？"
                  :disabled="record.home == 1"
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
      <WhiteDomainEdit
        v-model:visible="showEdit"
        :data="current"
        @done="reload"
      />
    </div>
  </div>
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
  import WhiteDomainEdit from './components/white-domain-edit.vue';
  import {
    pageWhiteDomain,
    removeWhiteDomain,
    removeBatchWhiteDomain
  } from '@/api/system/white-domain';
  import type {
    WhiteDomain,
    WhiteDomainParam
  } from '@/api/system/white-domain/model';
  import { openPreview } from '@/utils/common';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<WhiteDomain[]>([]);
  // 当前编辑数据
  const current = ref<WhiteDomain | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 是否显示批量移动弹窗
  const showMove = ref(false);

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
    return pageWhiteDomain({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '域名',
      dataIndex: 'domain'
    },
    {
      title: '描述',
      dataIndex: 'comments',
      ellipsis: true
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
  const reload = (where?: WhiteDomainParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: WhiteDomain) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: WhiteDomain) => {
    const hide = message.loading('请求中..', 0);
    removeWhiteDomain(row.id)
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
        removeBatchWhiteDomain(selection.value.map((d) => d.id))
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
    name: 'WhiteDomain'
  };
</script>
