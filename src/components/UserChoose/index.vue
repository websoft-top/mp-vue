<template>
  <ele-table-select
    ref="selectRef"
    :allow-clear="true"
    :placeholder="placeholder"
    v-model:value="selectedValue"
    value-key="userId"
    label-key="nickname"
    :table-config="tableConfig"
    :overlay-style="{ width: '520px', maxWidth: '80%' }"
    :init-value="initValue"
    @select="onSelect"
    @clear="onClear"
  >
    <!-- 角色列 -->
    <template #bodyCell="{ column, record }">
      <template v-if="column.key === 'nickname'">
        <a-tooltip :title="`ID：${record.userId}`">
          <a-avatar
            :size="30"
            :src="`${record.avatar}`"
            style="margin-right: 4px"
          >
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
          {{ record.nickname }}
        </a-tooltip>
      </template>
      <template v-else-if="column.key === 'roles'">
        <a-tag v-for="item in record.roles" :key="item.roleId" color="blue">
          {{ item.roleName }}
        </a-tag>
      </template>
    </template>
    <!-- 表头工具栏 -->
    <template #toolbar>
      <ChooseSearch @search="search" />
    </template>
  </ele-table-select>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import ChooseSearch from './choose-search.vue';
  import type { EleTableSelect } from 'ele-admin-pro/es';
  import type { ProTableProps } from 'ele-admin-pro/es/ele-pro-table/types';
  import type { WhereType } from './types';
  import { pageUsers, getUser } from '@/api/system/user';
  import type { User } from '@/api/user/model';
  import { UserOutlined } from '@ant-design/icons-vue';

  const props = withDefaults(
    defineProps<{
      value?: number | 0;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择用户'
    }
  );

  const emit = defineEmits<{
    (e: 'select', where?: User): void;
    (e: 'clear'): void;
  }>();

  const selectedValue = ref<number>();
  // 回显值
  const initValue = ref<User | null>(null);
  // 选择框实例
  const selectRef = ref<InstanceType<typeof EleTableSelect> | null>(null);

  // 表格配置
  const tableConfig = reactive<ProTableProps>({
    datasource: ({ page, limit, where, orders }) => {
      return pageUsers({ ...where, ...orders, page, limit });
    },
    columns: [
      {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
        showSorterTooltip: false
      },
      {
        title: '手机号码',
        dataIndex: 'phone',
        showSorterTooltip: false
      },
      {
        title: '角色',
        dataIndex: 'roles',
        key: 'roles',
        showSorterTooltip: false
      }
    ],
    toolkit: ['reload', 'columns'],
    size: 'small',
    pageSize: 6,
    toolStyle: {
      padding: '0 8px'
    }
  });

  // 搜索
  const search = (where: WhereType) => {
    selectRef.value?.reload({
      where,
      page: 1
    });
  };

  const onClear = () => {
    emit('clear');
  };

  const onSelect = (item) => {
    emit('select', item);
  };

  /* 回显数据 */
  const setInitValue = () => {
    const userId = Number(props.value);
    if (!userId) {
      return;
    }
    getUser(userId).then((res) => {
      if (res) {
        initValue.value = res;
      }
    });
  };

  setInitValue();

  watch(
    () => props.value,
    (value) => {
      if (value) {
        setInitValue();
      }
    }
  );
</script>
