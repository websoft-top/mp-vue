<template>
  <!-- 表格 -->
  <ele-pro-table
    ref="tableRef"
    row-key="userId"
    :columns="columns"
    :datasource="datasource"
    height="calc(100vh - 290px)"
    tool-class="ele-toolbar-form"
    :scroll="{ x: 800 }"
    bordered
  >
    <template #toolbar>
      <org-user-search
        @search="reload"
        :organizationId="organizationId"
        @add="openEdit()"
      />
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'roles'">
        <a-tag v-for="item in record.roles" :key="item.roleId" color="blue">
          {{ item.roleName }}
        </a-tag>
      </template>
      <template v-else-if="column.key === 'status'">
        <a-switch
          :checked="record.status === 0"
          @change="(checked: boolean) => editStatus(checked, record)"
        />
      </template>

      <template v-if="column.key === 'balance'">
        <span class="ele-text-success">
          ￥{{ formatNumber(record.balance) }}
        </span>
      </template>
      <template v-else-if="column.key === 'action'">
        <a-space>
          <a class="text-red-500" @click="remove(record)">移除</a>
        </a-space>
      </template>
    </template>
  </ele-pro-table>
  <!-- 编辑弹窗 -->
  <org-user-edit
    :data="current"
    v-model:visible="showEdit"
    :organization-list="organizationList"
    :organization-id="organizationId"
    @done="reload"
  />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { messageLoading } from 'ele-admin-pro/es';
  import OrgUserSearch from './org-user-search.vue';
  import OrgUserEdit from './org-user-edit.vue';
  import { timeAgo } from 'ele-admin-pro';
  import { formatNumber } from 'ele-admin-pro/es';
  import {
    pageUsers,
    removeUser,
    updateUser,
    updateUserStatus
  } from '@/api/system/user';
  import type { User, UserParam } from '@/api/system/user/model';
  import type { Organization } from '@/api/system/organization/model';

  const props = defineProps<{
    // 部门 id
    organizationId?: number;
    // 部门列表
    organizationList: Organization[];
  }>();

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      showSorterTooltip: false
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '余额',
      dataIndex: 'balance',
      key: 'balance',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '性别',
      dataIndex: 'sexName',
      width: 80,
      align: 'center',
      showSorterTooltip: false,
      hideInTable: true,
      ellipsis: true
    },
    {
      title: '角色',
      key: 'roles'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      showSorterTooltip: false,
      hideInTable: true,
      ellipsis: true,
      customRender: ({ text }) => timeAgo(text)
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      align: 'center'
    }
  ]);

  // 当前编辑数据
  const current = ref<User | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    if (props.organizationId) {
      where.organizationId = props.organizationId;
    }
    return pageUsers({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: UserParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: User) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: User) => {
    updateUser({ ...row, organizationId: 0 }).then(() => {
      reload();
    });
  };

  /* 修改用户状态 */
  const editStatus = (checked: boolean, row: User) => {
    const status = checked ? 0 : 1;
    updateUserStatus(row.userId, status)
      .then((msg) => {
        row.status = status;
        message.success(msg);
      })
      .catch((e) => {
        message.error(e.message);
      });
  };

  // 监听部门 id 变化
  watch(
    () => props.organizationId,
    () => {
      reload();
    }
  );
</script>
