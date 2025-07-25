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
      row-key="gradeId"
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
        <template v-if="column.key === 'companyLogo'">
          <a-image
            v-if="record.companyLogo"
            :src="FILE_THUMBNAIL + record.companyLogo"
            :preview="false"
            :width="45"
          />
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
  import { pageGrade } from '@/api/user/grade';
  import { FILE_THUMBNAIL } from '@/config/setting';
  import { EleProTable } from 'ele-admin-pro';
  import { Grade, GradeParam } from '@/api/user/grade/model';

  defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 修改回显的数据
    data?: Grade | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: Grade): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const searchText = ref(null);

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
      title: '等级名称',
      dataIndex: 'name'
    },
    {
      title: '操作',
      key: 'action',
      align: 'center'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where = {};
    // 搜索条件
    if (searchText.value) {
      where.keywords = searchText.value;
    }
    where.isStaff = true;
    return pageGrade({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: GradeParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 自定义行属性 */
  const customRow = (record: Grade) => {
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
