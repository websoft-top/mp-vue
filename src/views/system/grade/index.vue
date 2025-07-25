<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="gradeId"
          :columns="columns"
          :datasource="datasource"
          v-model:selection="selection"
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
            <template v-if="column.key === 'gradeName'">
              <a-avatar
                :size="30"
                :src="`${record.gradeAvatar}`"
                style="margin-right: 4px"
                :srcset="`https://file.wsdns.cn/${record.gradeAvatar}`"
              >
                <template #icon>
                  <UserOutlined />
                </template>
              </a-avatar>
              <a-tooltip title="查看详情">
                <a href="#" @click="openInfo(record)">{{ record.gradeName }}</a>
              </a-tooltip>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green">启用</a-tag>
              <a-tag v-if="record.status === 1" color="red">禁用</a-tag>
            </template>
            <template v-if="column.key === 'createTime'">
              <a-tooltip :title="`${toDateString(record.createTime)}`">
                {{ timeAgo(record.createTime) }}
              </a-tooltip>
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
      <GradeEdit v-model:visible="showEdit" :data="current" @done="reload" />
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
  import { toDateString } from 'ele-admin-pro';
  import Search from './components/search.vue';
  import GradeEdit from './components/grade-edit.vue';
  import {
    pageGrade,
    removeGrade,
    removeBatchGrade
  } from '@/api/system/user-grade';
  import { timeAgo } from 'ele-admin-pro';
  import type { Grade, GradeParam } from '@/api/user/grade/model';
  import { useUserStore } from '@/store/modules/user';

  const userStore = useUserStore();
  // 当前用户信息
  const loginUser = computed(() => userStore.info ?? {});

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<Grade[]>([]);
  // 当前编辑数据
  const current = ref<Grade | null>(null);
  // 是否显示资产详情
  const showInfo = ref(false);
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
      where.progress = filters.progress;
      where.gradeSource = filters.gradeSource;
      where.gradeType = filters.gradeType;
      where.status = filters.status;
    }
    return pageGrade({
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
      dataIndex: 'gradeId',
      width: 80,
      hideInTable: true
    },
    {
      title: '等级名称',
      dataIndex: 'name'
    },
    {
      title: '等级权重',
      dataIndex: 'weight'
    },
    {
      title: '升级条件',
      dataIndex: 'upgrade'
    },
    {
      title: '等级权益',
      dataIndex: 'equity'
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      customRender: ({ text }) => toDateString(text, 'yyyy-MM-dd')
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
  const reload = (where?: GradeParam) => {
    console.log(where);
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Grade) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 打开用户详情弹窗 */
  const openInfo = (row?: Grade) => {
    current.value = row ?? null;
    showInfo.value = true;
  };

  /* 删除单个 */
  const remove = (row: Grade) => {
    const hide = message.loading('请求中..', 0);
    removeGrade(row.gradeId)
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

  /* 批量转移 */
  const batchMove = (userId) => {
    console.log(userId, '批量转移0000');
    console.log(selection.value);
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
        removeBatchGrade(
          selection.value.map((d) => {
            if (loginUser.value.userId === d.userId) {
              return d.gradeId;
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

  /* 查询 */
  const query = () => {
    loading.value = true;
  };

  /* 自定义行属性 */
  const customRow = (record: Grade) => {
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
    name: 'Grade'
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
