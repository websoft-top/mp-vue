<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        :parse-data="parseData"
        :need-page="false"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
        cache-key="proCmsMpPagesTable"
        @done="onDone"
        @expand="onExpand"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
              展开
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
              折叠
            </a-button>
            <!-- 搜索表单 -->
            <a-input-search
              allow-clear
              v-model:value="searchText"
              placeholder="请输入搜索关键词"
              @search="reload"
              @pressEnter="reload"
            />
            <a-button
              type="text"
              @click="openUrl('/mp-package')"
            >分包管理
            </a-button
            >
            <a-button type="text" class="ele-btn-icon" @click="clearSiteInfoCache">
              清除缓存
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            {{ record.title }}
          </template>
          <template v-if="column.key === 'icon'">
            <template v-if="record.icon" v-for="(item,index) in JSON.parse(record.icon)">
              <a-image v-if="item.url" :id="index" :src="item.url" :width="50"/>
            </template>

          </template>
          <template v-if="column.key === 'path'">
            <span class="ele-text-placeholder">{{ record.path }}</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">显示</a-tag>
            <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
          </template>
          <template v-if="column.key === 'subpackage'">
            <a-tag v-if="record.subpackage === 'pages'" color="orange"
            >主包
            </a-tag
            >
            <a-tag v-else> {{ record.subpackage }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(null, record.id,record.subpackage)">添加</a>
<!--              <a-divider type="vertical"/>-->
<!--              <a @click="openUrl(`/mp-field/${record.id}`)">参数</a>-->
<!--              <a-divider type="vertical"/>-->
              <!--                <a @click="openUrl(`/mp-group/${record.id}`)">组件</a>-->
              <!--                <a-divider type="vertical" />-->
<!--              <a @click="openUrl(`/mp-design/${record.id}`)">设计</a>-->
              <a-divider type="vertical"/>
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
        <!--          <template #footer>-->
        <!--            <div class="ele-text-secondary"-->
        <!--              >页面设计：可以替换图标和文字。，仓库地址：http://git.gxwebsoft.com/websoft/nbg-uniapp.git</div-->
        <!--            >-->
        <!--          </template>-->
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <MpPagesEdit
      v-model:visible="showEdit"
      :parent-id="parentId"
      :packageName="packageName"
      :pages="pages"
      :data="current"
      @done="reload"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons-vue';
import type {EleProTable, toTreeData} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem, EleProTableDone
} from 'ele-admin-pro/es/ele-pro-table/types';
import MpPagesEdit from './components/mpPagesEdit.vue';
import {
  pageCmsMpPages,
  removeCmsMpPages,
  removeBatchCmsMpPages,
  listCmsMpPages
} from '@/api/cms/cmsMpPages';
import type {CmsMpPages, CmsMpPagesParam} from '@/api/cms/cmsMpPages/model';
import {copyText, getPageTitle, openUrl} from '@/utils/common';
import Extra from "@/views/cms/cmsNavigation/components/extra.vue";
import {eachTreeData} from "ele-admin-pro/es";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
// 页面列表
const pages = ref<CmsMpPages[]>([]);
// 表格选中数据
const selection = ref<CmsMpPages[]>([]);
// 上级分类id
const parentId = ref<number>();
// 当前编辑数据
const current = ref<CmsMpPages | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);
// 表格展开的行
const expandedRowKeys = ref<number[]>([]);
// 当前选中的包
const packageName = ref<any>();

// 表格数据源
const datasource: DatasourceFunction = ({where}) => {
  return listCmsMpPages({
    ...where
  });
};

/* 表格渲染完成回调 */
const onDone: EleProTableDone<CmsMpPages> = ({data}) => {
  pages.value = data;
};

/* 数据转为树形结构 */
const parseData = (data: CmsMpPages[]) => {
  return toTreeData({
    data: data.map((d) => {
      return {...d, key: d.id, value: d.id};
    }),
    idField: 'id',
    parentIdField: 'parentId'
  });
};


/* 展开全部 */
const expandAll = () => {
  let keys: number[] = [];
  eachTreeData(pages.value, (d) => {
    if (d.children && d.children.length && d.id) {
      keys.push(d.id);
    }
  });
  expandedRowKeys.value = keys;
};

/* 折叠全部 */
const foldAll = () => {
  expandedRowKeys.value = [];
};

/* 点击展开图标时触发 */
const onExpand = (expanded: boolean, record: CmsMpPages) => {
  if (expanded) {
    expandedRowKeys.value = [
      ...expandedRowKeys.value,
      record.id as number
    ];
  } else {
    expandedRowKeys.value = expandedRowKeys.value.filter(
      (d) => d !== record.id
    );
  }
};


// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: 'ID',
    dataIndex: 'id',
    width: 80
  },
  {
    title: '页面名称',
    dataIndex: 'title',
    key: 'title'
  },
  {
    title: '页面路径',
    dataIndex: 'path',
    key: 'path'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    sorter: true,
    hideInTable: true,
    ellipsis: true,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
  {
    title: '操作',
    key: 'action',
    width: 280,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: CmsMpPagesParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsMpPages | null, id?: number, mod?: string) => {
  current.value = row ?? null;
  packageName.value = mod ?? undefined;
  parentId.value = id;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: CmsMpPages) => {
  const hide = message.loading('请求中..', 0);
  removeCmsMpPages(row.id)
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
      removeBatchCmsMpPages(selection.value.map((d) => d.id))
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
const customRow = (record: CmsMpPages) => {
  return {
    // 行点击事件
    onClick: () => {
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
import * as MenuIcons from '@/layout/menu-icons';

export default {
  name: 'CmsMpPages',
  components: MenuIcons
};
</script>

<style lang="less" scoped></style>
