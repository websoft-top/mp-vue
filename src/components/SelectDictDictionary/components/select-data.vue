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
      row-key="dictDataId"
      :columns="columns"
      :customRow="customRow"
      :datasource="datasource"
      tool-class="ele-toolbar-form"
      class="sys-org-table"
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
        <template v-if="column.key === 'dictDataName'">
          <a-tag class="cursor-pointer">{{ record.dictDataName }}</a-tag>
        </template>
        <template v-if="column.key === 'comments'">
          <span class="text-gray-300">{{ record.comments }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a-button type="link">选择</a-button>
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
  import { EleProTable } from 'ele-admin-pro';
  import useSearch from '@/utils/use-search';
  import { DictData, DictDataParam } from '@/api/system/dict-data/model';
  import { pageDictionaryData } from '@/api/system/dictionary-data';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    title?: any;
    // 修改回显的数据
    data?: DictData | null;
    dictCode?: string;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: DictData): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单数据
  const { where } = useSearch<DictDataParam>({
    dictCode: undefined,
    keywords: ''
  });

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'dictDataId',
      key: 'dictDataId'
    },
    {
      title: '名称',
      dataIndex: 'dictDataName',
      key: 'dictDataName'
    },
    {
      title: '描述',
      dataIndex: 'comments',
      key: 'comments'
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
    where.dictCode = props.dictCode;
    return pageDictionaryData({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = () => {
    // selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 自定义行属性 */
  const customRow = (record: DictData) => {
    return {
      // 行点击事件
      onClick: () => {
        updateVisible(false);
        emit('done', record);
      }
    };
  };
</script>
<style lang="less">
  .app-box {
    display: flex;
    .app-info {
      display: flex;
      margin-left: 15px;
      margin-right: 15px;
      flex-direction: column;
    }
  }
</style>
