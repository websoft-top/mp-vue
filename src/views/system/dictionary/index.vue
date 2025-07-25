<template>
  <div class="ele-body">
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-split-layout
        width="366px"
        allow-collapse
        :right-style="{ overflow: 'hidden' }"
        :style="{ minHeight: 'calc(100vh - 152px)' }"
      >
        <!-- 表格 -->
        <ele-pro-table
          ref="tableRef"
          row-key="dictId"
          :columns="columns"
          :datasource="datasource"
          v-model:current="current"
          selection-type="radio"
          :row-selection="{ columnWidth: 32 }"
          :need-page="false"
          :toolkit="[]"
          height="calc(100vh - 290px)"
          tools-theme="default"
          bordered
          class="sys-dict-table"
          @done="done"
        >
          <template #toolbar>
            <a-space :size="10">
              <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
                <template #icon>
                  <plus-outlined />
                </template>
                <span>新建</span>
              </a-button>
              <a-button
                type="primary"
                :disabled="!current"
                class="ele-btn-icon"
                @click="openEdit(current)"
              >
                <template #icon>
                  <edit-outlined />
                </template>
                <span>修改</span>
              </a-button>
              <a-button
                danger
                type="primary"
                :disabled="!current"
                class="ele-btn-icon"
                @click="remove"
              >
                <template #icon>
                  <delete-outlined />
                </template>
                <span>删除</span>
              </a-button>
            </a-space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'dictName'">
              <a-space>
                <a-tooltip :title="`${record.dictCode}`">
                  {{ record.dictName }}
                  <span class="dict-code">{{ record.dictCode }}</span>
                </a-tooltip>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
        <template #content>
          <dict-data
            v-if="current && current.dictId"
            :dict-id="current.dictId"
          />
        </template>
      </ele-split-layout>
    </a-card>
    <!-- 编辑弹窗 -->
    <dict-edit v-model:visible="showEdit" :data="editData" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import {
    PlusOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem,
    EleProTableDone
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import DictData from './components/dict-data.vue';
  import DictEdit from './components/dict-edit.vue';
  import { listDictionaries, removeDictionary } from '@/api/system/dictionary';
  import type { Dictionary } from '@/api/system/dictionary/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    // {
    //   key: 'index',
    //   width: 45,
    //   ellipsis: true,
    //   align: 'center',
    //   fixed: 'left',
    //   hideInSetting: true,
    //   customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    // },
    {
      title: 'ID',
      dataIndex: 'dictId',
      key: 'dictId',
      width: 50,
      align: 'center',
      fixed: 'left'
    },
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName'
    }
  ]);

  // 表格选中数据
  const current = ref<Dictionary | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 编辑回显数据
  const editData = ref<Dictionary | null>(null);

  // 表格数据源
  const datasource: DatasourceFunction = () => {
    return listDictionaries();
  };

  /* 表格渲染完成回调 */
  const done: EleProTableDone<Dictionary> = (res) => {
    if (res.data?.length) {
      current.value = res.data[0];
    }
  };

  /* 刷新表格 */
  const reload = () => {
    tableRef?.value?.reload();
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Dictionary | null) => {
    editData.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除 */
  const remove = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中的字典吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = message.loading('请求中..', 0);
        removeDictionary(current.value?.dictId)
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
    name: 'SystemDictionary'
  };
</script>

<style lang="less" scoped>
  .sys-dict-table :deep(.ant-table-body) {
    overflow: auto !important;
    overflow: overlay !important;
  }
  .dict-code {
    color: #cccccc;
  }
</style>
