<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        v-model:selection="selection"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
      >
        <template #toolbar>
          <search
            @search="reload"
            :selection="selection"
            :navigationList="navigationList"
            @add="openEdit"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'icon'">
            <a-image :src="record.icon" :width="50"/>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">显示</a-tag>
            <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
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
    </a-card>

    <!-- 编辑弹窗 -->
    <CmsLinkEdit v-model:visible="showEdit" :navigationList="navigationList" :data="current" @done="reload"/>

    <!-- 批量更新 -->
    <LinkUpdate
      v-model:visible="showMove"
      :navigationList="navigationList"
      :selection="selection"
      @done="reload"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import {toTreeData} from 'ele-admin-pro';
import CmsLinkEdit from './components/cmsLinkEdit.vue';
import {pageCmsLink, removeCmsLink, removeBatchCmsLink} from '@/api/cms/cmsLink';
import type {CmsLink, CmsLinkParam} from '@/api/cms/cmsLink/model';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import {listCmsNavigation} from "@/api/cms/cmsNavigation";
import {getLang, getPageTitle} from "@/utils/common";
import LinkUpdate from './components/linkUpdate.vue';

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<CmsLink[]>([]);
// // 多语言
// const { locale } = useI18n();
// 当前编辑数据
const current = ref<CmsLink | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);
// 栏目数据
const navigationList = ref<CmsNavigation[]>();

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders,
                                          filters
                                        }) => {
  if (filters) {
    where.status = filters.status;
  }
  return pageCmsLink({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
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
    title: '链接名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '所属栏目',
    dataIndex: 'categoryName',
    align: 'center',
    width: 180,
  },
  {
    title: '图标',
    dataIndex: 'icon',
    key: 'icon',
    align: 'center',
    width: 120,
  },
  {
    title: '链接地址',
    dataIndex: 'url',
    key: 'url'
  },
  {
    title: '备注',
    dataIndex: 'comments'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 120,
    showSorterTooltip: false,
    customRender: ({text}) => ['显示', '隐藏'][text]
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center'
  }
]);

/* 搜索 */
const reload = (where?: CmsLinkParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsLink) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: CmsLink) => {
  const hide = message.loading('请求中..', 0);
  removeCmsLink(row.id)
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
      removeBatchCmsLink(selection.value.map((d) => d.id))
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
  // 加载栏目数据
  if (!navigationList.value) {
    listCmsNavigation({}).then((res) => {
      navigationList.value = toTreeData({
        data: res?.map((d) => {
          d.value = d.navigationId;
          d.label = d.title;
          return d;
        }),
        idField: 'navigationId',
        parentIdField: 'parentId'
      });
    });
  }
};

/* 自定义行属性 */
const customRow = (record: CmsLink) => {
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
  name: 'CmsLink'
};
</script>

<style lang="less" scoped></style>
