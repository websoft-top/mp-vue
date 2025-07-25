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
      row-key="formId"
      :datasource="datasource"
      :columns="columns"
      :customRow="customRow"
      :pagination="false"
    >
      <template #toolbar>
        <a-input-search
          allow-clear
          v-model:value="searchText"
          placeholder="请输入搜索关键词"
          style="width: 200px"
          @search="reload"
          @pressEnter="reload"
        />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <template v-if="pageId == record.formId">
            <a-radio v-model:checked="checked" @click="onRadio(record)" />
          </template>
          <template v-else>
            <a-radio @click="onRadio(record)" />
            <span class="ele-text-secondary">选择</span>
          </template>
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
  import { Form } from '@/api/cms/form/model';
  import { pageForm } from '@/api/cms/form';
  import { FormParam } from '@/api/cms/form/model';

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 修改回显的数据
    data?: Form | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: Form): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const searchText = ref(null);
  const pageId = ref<number>(0);
  const checked = ref<boolean>(true);

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: '操作',
      width: 180,
      key: 'action'
    },
    {
      title: '表单ID',
      dataIndex: 'formId',
      key: 'formId'
    },
    {
      title: '表单名称',
      dataIndex: 'name',
      key: 'name'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where = {};
    // 搜索条件
    if (searchText.value) {
      where.title = searchText.value;
    }
    return pageForm({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: FormParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: Form) => {
    pageId.value = Number(record.formId);
    updateVisible(false);
    emit('done', record);
  };

  /* 自定义行属性 */
  const customRow = (record: Form) => {
    return {
      // 行点击事件
      // onClick: () => {
      //   updateVisible(false);
      //   emit('done', record);
      // },
      // 行双击事件
      onDblclick: () => {
        updateVisible(false);
        emit('done', record);
      }
    };
  };
</script>
<style lang="less"></style>
