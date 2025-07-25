<template>
  <div class="page">
    <a-page-header :ghost="false" title="秘钥管理">
      <div class="ele-text-secondary">
        AccessKey ID 和 AccessKey Secret 是您访WebSoft-API
        的密钥，具有该账户完全的权限，请您妥善保管。
      </div>
    </a-page-header>
    <div class="ele-body">
      <a-card :bordered="false">
        <!-- 表格 -->
        <ele-pro-table
          ref="tableRef"
          row-key="logId"
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
                <span>创建 AccessKey</span>
              </a-button>
              <a-button @click="reset">刷新</a-button>
            </a-space>
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'accessSecret'">
              <span v-if="record.accessSecret">
                {{ record.accessSecret }}
              </span>
              <a @click="openEdit(record)" v-else>查看 Secret</a>
            </template>
            <template v-if="column.key === 'action'">
              <a-space>
                <a @click="openEdit(record)">查看 Secret</a>
                <!--                <a-divider type="vertical" />-->
                <!--                <a @click="resetPsw(record)">禁用</a>-->
              </a-space>
            </template>
          </template>
        </ele-pro-table>
      </a-card>
    </div>
    <!-- 编辑弹窗 -->
    <AccessKeyEdit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import AccessKeyEdit from './components/accesskey-edit.vue';
  import { toDateString } from 'ele-admin-pro/es';
  import { addAccessKey, pageAccessKey } from '@/api/system/access-key';
  import { AccessKey, AccessKeyParam } from '@/api/system/access-key/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'AccessKey ID',
      key: 'accessKey',
      dataIndex: 'accessKey',
      showSorterTooltip: false
    },
    {
      title: 'AccessSecret',
      key: 'accessSecret',
      dataIndex: 'accessSecret',
      showSorterTooltip: false
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      customRender: ({ text }) => toDateString(text)
    }
  ]);

  // 表格选中数据
  const selection = ref<AccessKey[]>([]);
  const searchText = ref('');
  const userId = ref<number>(0);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 当前编辑数据
  const current = ref<any>(null);

  // 默认搜索条件
  const defaultWhere = reactive({
    code: '',
    phone: '',
    username: '',
    nickname: '',
    userId: undefined
  });

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageAccessKey({ ...where, ...orders, page, limit }).catch((e) => {
      message.error(e.message);
    });
  };

  const reset = () => {
    userId.value = 0;
    searchText.value = '';
    reload();
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: any) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 搜索 */
  const reload = (where?: AccessKeyParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  const add = () => {
    addAccessKey({})
      .then((res) => {
        reload();
      })
      .catch((err) => {
        message.error(err.message);
      });
  };
</script>

<script lang="ts">
  export default {
    name: 'AccessKeyIndex'
  };
</script>
