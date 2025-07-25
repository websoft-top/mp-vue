<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="groupId"
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
            <template v-if="column.key === 'groupName'">
              <a-avatar
                :size="30"
                :src="`${record.groupAvatar}`"
                style="margin-right: 4px"
                :srcset="`https://file.wsdns.cn/${record.groupAvatar}`"
              >
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <a-tooltip title="查看详情">
                <a href="#" @click="openInfo(record)">{{ record.groupName }}</a>
              </a-tooltip>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green">正常</a-tag>
              <a-tag v-if="record.status === 1" color="red">待审核</a-tag>
              <a-tag v-if="record.status === 2" color="purple">已驳回</a-tag>
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
      <GroupEdit v-model:visible="showEdit" :data="current" @done="reload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import {
    ExclamationCircleOutlined,
    UserOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toTreeData } from 'ele-admin-pro';
  import GroupEdit from './components/group-edit.vue';
  import {
    pageGroup,
    removeGroup,
    removeBatchGroup
  } from '@/api/system/user-group';
  import type { Group, GroupParam } from '@/api/system/user-group/model';
  import { useUserStore } from '@/store/modules/user';
  import Search from './components/search.vue';

  const userStore = useUserStore();
  // 当前用户信息
  const loginUser = computed(() => userStore.info ?? {});

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<Group[]>([]);
  // 当前编辑数据
  const current = ref<Group | null>(null);
  // 树形数据
  // const data = ref<Category[]>([]);

  // 是否显示资产详情
  const showInfo = ref(false);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 是否显示批量移动弹窗
  const showMove = ref(false);
  // 加载状态
  const loading = ref(true);
  // 树展开的key
  const expandedRowKeys = ref<number[]>([]);
  // 树选中的key
  const selectedRowKeys = ref<number[]>([]);

  // 表格数据源
  const datasource: DatasourceFunction = ({
    page,
    limit,
    where,
    orders,
    filters
  }) => {
    if (filters) {
      where.progress = filters.progress;
      where.groupSource = filters.groupSource;
      where.groupType = filters.groupType;
      where.status = filters.status;
    }
    return pageGroup({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'groupId',
      width: 80
    },
    {
      title: '分组名称',
      dataIndex: 'name'
    },
    {
      title: '备注',
      dataIndex: 'comments'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: GroupParam) => {
    console.log(where);
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Group) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 打开用户详情弹窗 */
  const openInfo = (row?: Group) => {
    current.value = row ?? null;
    showInfo.value = true;
  };

  /* 删除单个 */
  const remove = (row: Group) => {
    const hide = message.loading('请求中..', 0);
    removeGroup(row.groupId)
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
        removeBatchGroup(
          selection.value.map((d) => {
            console.log(d);
            if (loginUser.value.userId === d.groupId) {
              return d.groupId;
            }
          })
        )
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

  /* 自定义行属性 */
  const customRow = (record: Group) => {
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
</script>

<script lang="ts">
  export default {
    name: 'Group'
  };
</script>

<style lang="less" scoped>
  .sys-org-table :deep(.ant-table-body) {
    overflow: auto !important;
    overflow: overlay !important;
  }

  .sys-org-table :deep(.ant-table-pagination.ant-pagination) {
    padding: 0 4px;
    margin-bottom: 0;
  }
</style>
