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
    <a-input-search
      allow-clear
      v-model:value="where.keywords"
      placeholder="用户ID|手机号码|姓名"
      class="w-full mb-3"
      @search="search"
      @pressEnter="search"
    />
    <a-table
      ref="tableRef"
      row-key="userId"
      :dataSource="list"
      :columns="columns"
      :pagination="false"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'avatar'">
          <a-avatar
            :size="30"
            :src="`${record.avatar}`"
            style="margin-right: 4px"
          >
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="primary" @click="done(record)">选择</a-button>
          </a-space>
        </template>
      </template>
    </a-table>
    <div class="flex justify-center py-3">
      <a-pagination
        v-model:current="where.page"
        :total="total"
        show-less-items
        @change="reload"
      />
    </div>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  import { ColumnItem } from 'ele-admin-pro/es/ele-pro-table/types';
  import { pageUsers } from '@/api/system/user';
  import { User, UserParam } from '@/api/system/user/model';
  import { EleProTable } from 'ele-admin-pro';
  import useSearch from '@/utils/use-search';

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    title?: string;
    // 修改回显的数据
    data?: User | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: User): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const list = ref<User[]>([]);
  const total = ref<number>(0);
  // 表单数据
  const { where } = useSearch<UserParam>({
    userId: undefined,
    nickname: undefined,
    keywords: '',
    page: 1
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
      title: '手机号码',
      dataIndex: 'mobile',
      key: 'mobile'
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      key: 'avatar'
    },
    {
      title: '姓名',
      dataIndex: 'realName'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      hideInSetting: true
    }
  ]);

  const done = (record: User) => {
    updateVisible(false);
    emit('done', record);
  };

  const search = () => {
    where.page = 1;
    reload();
  };

  /* 搜索 */
  const reload = () => {
    pageUsers(where).then((res) => {
      if (res?.list) {
        list.value = res?.list;
        total.value = res.count;
      }
    });
  };

  reload();
</script>
