<template>
  <div class="page">
    <a-page-header :ghost="false" title="缓存管理">
      <div class="ele-text-secondary">
        启用缓存可以缓解服务器压力，提升加载速度。
      </div>
    </a-page-header>
    <div class="ele-body">
      <a-card :bordered="false">
        <!-- 表格 -->
        <ele-pro-table
          ref="tableRef"
          row-key="key"
          :columns="columns"
          :datasource="datasource"
          :where="defaultWhere"
          cache-key="userBalanceLogTable"
        >
          <template #toolbar>
            <a-space>
              <a-button type="primary" class="ele-btn-icon" @click="add">
                <template #icon>
                  <plus-outlined />
                </template>
                <span>添加</span>
              </a-button>
              <a-button @click="reset">刷新</a-button>
            </a-space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'content'">
              <div class="ele-text-secondary">
                <a-tooltip placement="topLeft">
                  <template #title>{{ record.content }}</template>
                  {{ record.content }}
                </a-tooltip>
              </div>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="remove(record)">删除</a>
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
    <!-- 编辑弹窗 -->
    <CacheEdit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, createVNode } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import CacheEdit from './components/cache-edit.vue';
  import { updateCache, listCache, removeCache } from '@/api/system/cache';
  import { Cache, CacheParam } from '@/api/system/cache/model';
  import { App } from '@/api/app/model';
  import {
    PlusOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import { messageLoading } from 'ele-admin-pro';
  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'KEY',
      dataIndex: 'key'
    },
    {
      title: 'CONTENT',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center',
      hideInSetting: true
    }
  ]);

  // 表格选中数据
  const selection = ref<Cache[]>([]);
  const searchText = ref('');
  const userId = ref<number>(0);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 当前编辑数据
  const current = ref<App | null>(null);

  // 默认搜索条件
  const defaultWhere = reactive({
    code: '',
    phone: '',
    username: '',
    nickname: '',
    userId: undefined
  });

  // 表格数据源
  const datasource: DatasourceFunction = () => {
    return listCache({ key: '*' });
  };

  const reset = () => {
    userId.value = 0;
    searchText.value = '';
    reload();
  };

  /* 搜索 */
  const reload = (where?: CacheParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  const add = () => {
    showEdit.value = true;
    // setCache({})
    //   .then((res) => {
    //     reload();
    //   })
    //   .catch((err) => {
    //     message.error(err.message);
    //   });
  };

  /* 删除单个 */
  const remove = (row: Cache) => {
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中的记录吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeCache(row.key)
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
    name: 'CacheIndex'
  };
</script>
