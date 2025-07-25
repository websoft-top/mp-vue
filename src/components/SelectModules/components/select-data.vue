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
      row-key="id"
      :datasource="datasource"
      :columns="columns"
      :customRow="customRow"
      :pagination="false"
    >
      <template #toolbar>
        <a-space :size="10">
          <a-input-search
            allow-clear
            v-model:value="searchText"
            placeholder="请输入搜索关键词"
            style="width: 200px"
            @search="reload"
            @pressEnter="reload"
          />
          <a-button @click="openUrl('/system/modules')">模块管理</a-button>
        </a-space>
      </template>
      <template #bodyCell="{ column }">
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
  import { pageModules } from '@/api/system/modules';
  import { Modules, ModulesParam } from '@/api/system/modules/model';
  import { openUrl } from '@/utils/common';

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    title?: string;
    // 修改回显的数据
    data?: Modules | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: Modules): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const searchText = ref(null);
  // 表单数据
  const { where } = useSearch<ModulesParam>({
    id: 0,
    modules: '',
    modulesUrl: ''
  });

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '模块ID',
      dataIndex: 'modules'
    },
    {
      title: 'URL',
      dataIndex: 'modulesUrl'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      hideInSetting: true
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ where }) => {
    // 搜索条件
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    return pageModules({
      ...where
    });
  };

  /* 搜索 */
  const reload = (where?: ModulesParam) => {
    // selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 自定义行属性 */
  const customRow = (record: Modules) => {
    return {
      // 行点击事件
      onClick: () => {
        updateVisible(false);
        emit('done', record);
      }
    };
  };
</script>
<style lang="less"></style>
