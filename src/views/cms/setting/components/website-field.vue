<template>
  <div class="website-field">
    <!-- 表格 -->
    <ele-pro-table
      ref="tableRef"
      row-key="websiteId"
      :columns="columns"
      :datasource="datasource"
      :customRow="customRow"
      tool-class="ele-toolbar-form"
      class="sys-org-table"
    >
      <template #toolbar>
        <WebsiteFieldSearch @add="openEdit" />
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'comments'">
          <span class="ele-text-placeholder">{{ record.comments }}</span>
        </template>
        <template v-if="column.key === 'action'">
          <a-space>
            <a @click="moveUp(record)">上移<ArrowUpOutlined /></a>
            <a-divider type="vertical" />
            <a @click="openEdit(record)">编辑</a>
            <a-divider type="vertical" />
            <a-popconfirm
              title="确定要删除此记录吗？"
              @confirm="remove(record)"
            >
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </ele-pro-table>
    <!-- 编辑弹窗 -->
    <WebsiteFieldEdit
      v-model:visible="showEdit"
      :website-id="data.websiteId"
      :data="current"
      @done="reload"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { message } from 'ant-design-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import type { DatasourceFunction } from 'ele-admin-pro/es/ele-pro-table/types';
  import WebsiteFieldSearch from './website-field-search.vue';
  import { CmsWebsite } from '@/api/cms/cmsWebsite/model';
  import WebsiteFieldEdit from './website-field-edit.vue';
  import {
    CmsWebsiteField,
    CmsWebsiteFieldParam
  } from '@/api/cms/cmsWebsiteField/model';
  import {
    pageCmsWebsiteField,
    removeCmsWebsiteField,
    updateCmsWebsiteField
  } from '@/api/cms/cmsWebsiteField';
  import { ArrowUpOutlined } from '@ant-design/icons-vue';

  const props = defineProps<{
    websiteId: any;
    data: CmsWebsite;
  }>();

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  const selection = ref<any[]>();
  // 当前编辑数据
  const current = ref<CmsWebsiteField | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    // 搜索条件
    where.websiteId = props.websiteId;
    return pageCmsWebsiteField({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<any[]>([
    {
      title: '键名',
      width: 180,
      dataIndex: 'name'
    },
    {
      title: '参数值',
      dataIndex: 'value',
      key: 'value'
    },
    {
      title: '备注',
      dataIndex: 'comments',
      width: 280,
      key: 'comments'
    },
    {
      title: '排序',
      dataIndex: 'sortNumber',
      width: 180,
      align: 'center'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center',
      hideInSetting: true
    }
  ]);

  const moveUp = (row?: CmsWebsiteField) => {
    updateCmsWebsiteField({
      id: row?.id,
      sortNumber: Number(row?.sortNumber) + 1
    }).then((msg) => {
      message.success(msg);
      reload();
    });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsWebsiteField) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 搜索 */
  const reload = (where?: CmsWebsiteFieldParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 删除单个 */
  const remove = (row: CmsWebsiteField) => {
    const hide = message.loading('请求中..', 0);
    removeCmsWebsiteField(row.id)
      .then((msg) => {
        hide();
        message.success(msg);
        reload();
      })
      .catch((e) => {
        hide();
        message.error(e.message);
      });
  };

  /* 自定义行属性 */
  const customRow = (record: CmsWebsiteField) => {
    return {
      // 行点击事件
      onClick: () => {
        // console.log(record);
      },
      // 行双击事件
      onDblclick: () => {
        openEdit(record);
      }
    };
  };

  watch(
    () => props.websiteId,
    (websiteId) => {
      if (websiteId) {
        reload();
      }
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'WebsiteFieldIndex'
  };
</script>
