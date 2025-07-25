<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch />
    </template>
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsLangId"
          :columns="columns"
          :datasource="datasource"
          :customRow="customRow"
          tool-class="ele-toolbar-form"
          class="sys-org-table"
        >
          <template #toolbar>
            <search
              @search="reload"
              :selection="selection"
              @add="openEdit"
              @remove="removeBatch"
              @batchMove="openMove"
            />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <a-switch v-model:checked="record.enable" :disabled="record.status" @change="onChange(record)"/>
            </template>
          </template>
        </ele-pro-table>
      </a-card>

      <!-- 编辑弹窗 -->
      <CmsLangEdit v-model:visible="showEdit" :data="current" @done="reload" />

  </a-page-header>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsLangEdit from './components/cmsLangEdit.vue';
  import {pageCmsLang, removeBatchCmsLang} from '@/api/cms/cmsLang';
  import type { CmsLang, CmsLangParam } from '@/api/cms/cmsLang/model';
  import {addCmsLangLog, removeCmsLangLog} from "@/api/cms/cmsLangLog";
  import {getPageTitle} from "@/utils/common";
  import CmsWebsiteSearch from "@/views/cms/cmsWebsite/components/search.vue";

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsLang[]>([]);
  // 当前编辑数据
  const current = ref<CmsLang | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 是否显示批量移动弹窗
  const showMove = ref(false);
  // 加载状态
  const loading = ref(true);

  // 表格数据源
  const datasource: DatasourceFunction = ({
    page,
    limit,
    where,
    orders
  }) => {
    return pageCmsLang({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
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
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '编码',
      dataIndex: 'code',
      key: 'code',
      align: 'center',
    },
    // {
    //   title: '排序',
    //   dataIndex: 'sortNumber',
    //   key: 'sortNumber',
    //   align: 'center',
    // },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: CmsLangParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsLang) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  // 启用禁用开关
  const onChange = (item:any) => {
    if (item.enable == true) {
      addCmsLangLog({
        code: item.code,
        langId: item.id,
        lang: item.name
      })
    }else {
      removeCmsLangLog(item.id);
    }
  }

  /* 批量删除 */
  const removeBatch = () => {
    if (!selection.value.length) {
      message.error('请至少选择一条数据');
      return;
    }
    Modal.confirm({
      title: '提示',
      content: '确定要删除选中的记录吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = message.loading('请求中..', 0);
        removeBatchCmsLang(selection.value.map((d) => d.id))
          .then((msg) => {
            hide();
            message.success(msg);
            reload();
          })
          .catch((e) => {
            hide();
            message.error(e.message);
          });
      }
    });
  };

  /* 查询 */
  const query = () => {
    loading.value = true;
  };

  /* 自定义行属性 */
  const customRow = (record: CmsLang) => {
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
  query();
</script>

<script lang="ts">
  export default {
    name: 'CmsLang'
  };
</script>

<style lang="less" scoped></style>
