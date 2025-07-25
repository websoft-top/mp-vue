<template>
  <ele-modal
    :width="750"
    :visible="visible"
    :maskClosable="false"
    :title="title"
    :footer="null"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="userId"
      :datasource="datasource"
      :columns="columns"
      :pagination="false"
    >
      <template #toolbar>
        <a-space>
          <a-input-search
            allow-clear
            v-model:value="where.keywords"
            placeholder="请输入搜索关键词"
            style="width: 200px"
            @search="reload"
            @pressEnter="reload"
          />
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'roles'">
          <a-tag v-for="(item, index) in record.roles" :key="index">{{
            item.roleName
          }}</a-tag>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" @click="done(record)">选择</a-button>
          </a-space>
        </template>
      </template>
    </ele-pro-table>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { pageUsers } from '@/api/system/user';
  import { User, UserParam } from '@/api/system/user/model';
  import { EleProTable } from 'ele-admin-pro';
  import useSearch from '@/utils/use-search';
  import { message } from 'ant-design-vue/es';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    title?: string;
    // 修改回显的数据
    data?: User | null;
    type?: string;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: User): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单数据
  const { where } = useSearch<UserParam>({
    userId: undefined,
    nickname: undefined,
    isStaff: true,
    keywords: ''
  });

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'userId'
    },
    {
      title: '姓名',
      dataIndex: 'nickname'
    },
    {
      title: '所属部门',
      dataIndex: 'organizationName'
    },
    {
      title: '角色',
      dataIndex: 'roles',
      key: 'roles'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      hideInSetting: true
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where.isStaff = true;
    return pageUsers({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = () => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const done = (record: User) => {
    if (props.type == 'task') {
      record.roles?.map((d) => {
        if (d.roleCode == 'promoter') {
          message.error('只能指派给受理人员');
          return false;
        }
      });
    }
    updateVisible(false);
    emit('done', record);
  };
</script>
<style lang="less"></style>
