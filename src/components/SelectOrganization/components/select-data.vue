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
    <!-- 表格 -->
    <ele-pro-table
      ref="tableRef"
      row-key="organizationId"
      :columns="columns"
      :datasource="datasource"
      :parse-data="parseData"
      :customRow="customRow"
      :need-page="false"
      :expand-icon-column-index="1"
      :expanded-row-keys="expandedRowKeys"
      cache-key="proSelectOrgTable"
      @done="onDone"
      @expand="onExpand"
    >
      <template #toolbar>
        <a-space>
          <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
            展开全部
          </a-button>
          <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
            折叠全部
          </a-button>
          <!-- 搜索表单 -->
          <!--          <a-input-search-->
          <!--            allow-clear-->
          <!--            v-model:value="searchText"-->
          <!--            placeholder="请输入搜索关键词"-->
          <!--            @search="search"-->
          <!--            @pressEnter="search"-->
          <!--          />-->
        </a-space>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'title'">
          <a-tooltip :title="`分类ID：${record.categoryId}`">
            <span>{{ record.title }}</span>
          </a-tooltip>
        </template>
        <template v-if="column.key === 'status'">
          <a-tag v-if="record.status === 0" color="green">显示</a-tag>
          <a-tag v-if="record.status === 1" color="orange">隐藏</a-tag>
        </template>
        <template v-else-if="column.key === 'action'">
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
  import type {
    DatasourceFunction,
    ColumnItem,
    EleProTableDone
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { toTreeData, eachTreeData } from 'ele-admin-pro/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import { listOrganizations } from '@/api/system/organization';
  import {
    Organization,
    OrganizationParam
  } from '@/api/system/organization/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center'
    },
    {
      title: '部门名称',
      dataIndex: 'organizationName'
    }
  ]);

  // 分类数据
  const categoryData = ref<Organization[]>([]);

  // 表格展开的行
  const expandedRowKeys = ref<number[]>([]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ where }) => {
    return listOrganizations({ ...where });
  };

  /* 数据转为树形结构 */
  const parseData = (data) => {
    return toTreeData({
      data: data.map((d) => {
        return { ...d, key: d.organizationId, value: d.organizationId };
      }),
      idField: 'organizationId',
      parentIdField: 'parentId'
    });
  };

  /* 表格渲染完成回调 */
  const onDone: EleProTableDone<Organization> = ({ data }) => {
    categoryData.value = data;
  };

  /* 刷新表格 */
  const reload = (where?: OrganizationParam) => {
    tableRef?.value?.reload({ where });
  };

  // import { ref } from 'vue';
  // import {
  //   ColumnItem,
  //   DatasourceFunction
  // } from 'ele-admin-pro/es/ele-pro-table/types';
  // import {
  //   listOrganizations,
  //   pageOrganizations
  // } from '@/api/system/organization';
  // import { EleProTable, toTreeData } from 'ele-admin-pro';
  // import {
  //   Organization,
  //   OrganizationParam
  // } from '@/api/system/organization/model';
  // import { message } from 'ant-design-vue/es';
  // import { ArticleCategory } from '@/api/cms/category/model';
  //
  // defineProps<{
  //   // 弹窗是否打开
  //   visible: boolean;
  //   // 标题
  //   title?: string;
  //   // 修改回显的数据
  //   data?: Organization | null;
  // }>();
  //
  const emit = defineEmits<{
    (e: 'done', data: Organization): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const searchText = ref(null);
  //
  // // 表格实例
  // const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  //
  // // 表格配置
  // const columns = ref<ColumnItem[]>([
  //   {
  //     title: '部门名称',
  //     dataIndex: 'organizationName'
  //   },
  //   {
  //     title: '操作',
  //     key: 'action',
  //     align: 'center'
  //   }
  // ]);

  /* 展开全部 */
  const expandAll = () => {
    let keys: number[] = [];
    eachTreeData(categoryData.value, (d) => {
      if (d.children && d.children.length && d.organizationId) {
        keys.push(d.organizationId);
      }
    });
    expandedRowKeys.value = keys;
  };

  /* 折叠全部 */
  const foldAll = () => {
    expandedRowKeys.value = [];
  };

  /* 点击展开图标时触发 */
  const onExpand = (expanded: boolean, record: Organization) => {
    if (expanded) {
      expandedRowKeys.value = [
        ...expandedRowKeys.value,
        record.organizationId as number
      ];
    } else {
      expandedRowKeys.value = expandedRowKeys.value.filter(
        (d) => d !== record.organizationId
      );
    }
  };

  /* 自定义行属性 */
  const customRow = (record: Organization) => {
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
