<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch />
    </template>
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
                <a-tooltip>
                  <template #title>
                    {{ record.dictId }}
                  </template>
                  {{ record.dictName }}
                </a-tooltip>
                <span class="ele-text-placeholder">
                {{ record.dictCode }}
              </span>
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
  </a-page-header>
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
  import { listDictionaries, removeDict } from '@/api/system/dict';
  import type { Dict } from '@/api/system/dict/model';
  import {getPageTitle} from "@/utils/common";
  import CmsWebsiteSearch from "@/views/cms/cmsWebsite/components/search.vue";

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '字典名称',
      dataIndex: 'dictName',
      key: 'dictName'
    }
  ]);

  // 表格选中数据
  const current = ref<Dict | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 编辑回显数据
  const editData = ref<Dict | null>(null);

  // 表格数据源
  const datasource: DatasourceFunction = () => {
    return listDictionaries();
  };

  /* 表格渲染完成回调 */
  const done: EleProTableDone<Dict> = (res) => {
    if (res.data?.length) {
      current.value = res.data[0];
    }
  };

  /* 刷新表格 */
  const reload = () => {
    tableRef?.value?.reload();
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Dict | null) => {
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
        removeDict(current.value?.dictId)
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
    name: 'SystemDict'
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
