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
            v-model:value="searchText"
            placeholder="请输入搜索关键词"
            style="width: 200px"
            @search="reload"
            @pressEnter="reload"
          />
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
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
  import { User, UserParam } from '@/api/system/user/model';
  import { EleProTable } from 'ele-admin-pro';
  import useSearch from '@/utils/use-search';
  import {pageHjmFence} from "@/api/hjm/hjmFence";
  import {HjmFenceParam} from "@/api/hjm/hjmFence/model";

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    title?: string;
    organizationId?: number;
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
  const searchText = ref(null);
  // 表单数据
  const { where } = useSearch<HjmFenceParam>({
    type: undefined,
    keywords: ''
  });

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    // {
    //   key: 'index',
    //   width: 48,
    //   align: 'center',
    //   fixed: 'left',
    //   hideInSetting: true,
    //   customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    // },
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '围栏名称',
      dataIndex: 'name'
    },
    // {
    //   title: '经纬度',
    //   dataIndex: 'location',
    //   key: 'location'
    // },
    // {
    //   title: '半径',
    //   dataIndex: 'district'
    // },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      hideInSetting: true
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageHjmFence({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: UserParam) => {
    // selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  const done = (record: User) => {
    updateVisible(false);
    emit('done', record);
  };
</script>
<style lang="less"></style>
