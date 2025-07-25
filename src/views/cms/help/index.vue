<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="articleId"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        :scroll="{ x: 1200 }"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
      >
        <template #toolbar>
          <search
            @search="reload"
            :selection="selection"
            :navigationList="navigationList"
            :merchantId="merchantId"
            :categoryId="categoryId"
            @add="openEdit"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <span class="text-black">{{ record.title }}</span>
          </template>
          <template v-if="column.key === 'image'">
            <a-image
              :src="record.image"
              :width="50"
              fallback="https://file.wsdns.cn/20230218/550e610d43334dd2a7f66d5b20bd58eb.svg"
            />
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <ArticleEdit
      v-model:visible="showEdit"
      :navigationList="navigationList"
      :categoryList="categoryList"
      :categoryId="categoryId"
      :data="current"
      @done="reload"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref, watch} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import ArticleEdit from './components/articleEdit.vue';
import {
  pageCmsArticle,
  removeCmsArticle,
  removeBatchCmsArticle,
  updateCmsArticle
} from '@/api/cms/cmsArticle';
import type {CmsArticle, CmsArticleParam} from '@/api/cms/cmsArticle/model';
import {formatNumber} from 'ele-admin-pro/es';
import router from '@/router';
import {toTreeData} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import {
  detail,
  getPageTitle
} from '@/utils/common';
import {listCmsNavigation} from '@/api/cms/cmsNavigation';
import {CmsNavigation} from '@/api/cms/cmsNavigation/model';
import {CmsArticleCategory} from '@/api/cms/cmsArticleCategory/model';
import {listCmsArticleCategory} from '@/api/cms/cmsArticleCategory';
import {getCmsWebsiteSetting} from '@/api/cms/cmsWebsiteSetting';
import {useWebsiteSettingStore} from '@/store/modules/setting';

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
// 表格选中数据
const selection = ref<CmsArticle[]>([]);
// 当前编辑数据
const current = ref<CmsArticle | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 店铺ID
const merchantId = ref<number>();
// 栏目ID
const categoryId = ref<number>();
// 栏目数据
const navigationList = ref<CmsNavigation[]>();
// 文章分类
const categoryList = ref<CmsArticleCategory[]>();
// 是否显示二维码
const showQrcode = ref(false);
// 网站设置信息
const setting = useWebsiteSettingStore();

// 表格数据源
const datasource: DatasourceFunction = ({page, limit, where, orders}) => {
  if (categoryId.value) {
    where.categoryId = categoryId.value;
  }
  where.model = 'help';
  return pageCmsArticle({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  // {
  //   title: 'ID',
  //   dataIndex: 'articleId',
  //   key: 'articleId',
  //   align: 'center',
  //   width: 90
  // },
  {
    title: '封面图',
    dataIndex: 'image',
    key: 'image',
    width: 120,
    align: 'center'
  },
  {
    title: '文章标题',
    dataIndex: 'title',
    key: 'title'
  },
  // {
  //   title: '栏目名称',
  //   dataIndex: 'categoryName',
  //   key: 'categoryName',
  //   width: 120,
  //   align: 'center'
  // },
  // {
  //   title: '所属栏目',
  //   dataIndex: 'categoryId',
  //   key: 'categoryId',
  //   align: 'center',
  //   hideInTable: true
  // },
  // {
  //   title: '实际阅读量',
  //   dataIndex: 'actualViews',
  //   key: 'actualViews',
  //   sorter: true,
  //   width: 120,
  //   align: 'center'
  // },
  // {
  //   title: '虚拟阅读量',
  //   dataIndex: 'virtualViews',
  //   key: 'virtualViews',
  //   width: 120,
  //   align: 'center',
  //   hideInTable: true
  // },
  // {
  //   title: '推荐',
  //   dataIndex: 'recommend',
  //   key: 'recommend',
  //   sorter: true,
  //   width: 120,
  //   align: 'center'
  // },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   sorter: true,
  //   width: 120,
  //   align: 'center'
  // },
  // {
  //   title: '排序号',
  //   dataIndex: 'sortNumber',
  //   key: 'sortNumber',
  //   sorter: true,
  //   width: 120,
  //   align: 'center'
  // },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 180,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd'),
    sorter: true
  },
  // {
  //   title: '操作',
  //   key: 'action',
  //   width: 180,
  //   fixed: 'right',
  //   align: 'center',
  //   hideInSetting: true
  // }
]);

/* 搜索 */
const reload = (where?: CmsArticleParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsArticle) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

// 分享二维码
const onShare = (row?: CmsArticle) => {
  const data = {
    isMobile: true,
    ...row
  };
  data.qrcode = `${detail(data)}`;
  data.url = `${detail(row)}`;
  current.value = data ?? null;
  showQrcode.value = true;
};

const onUpdate = (row?: CmsArticle) => {
  const status = row?.status == 0 ? 1 : 0;
  updateCmsArticle({...row, status}).then((msg) => {
    message.success(msg);
    reload();
  });
};

const onRecommend = (row: CmsArticle) => {
  updateCmsArticle({
    ...row,
    recommend: row.recommend == 1 ? 0 : 1
  }).then((msg) => {
    message.success(msg);
    reload();
  });
};

/* 删除单个 */
const remove = (row: CmsArticle) => {
  const hide = message.loading('请求中..', 0);
  removeCmsArticle(row.articleId)
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
      removeBatchCmsArticle(selection.value.map((d) => d.articleId))
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

/* 自定义行属性 */
const customRow = (record: CmsArticle) => {
  return {
    // 行点击事件
    onClick: () => {
      openEdit(record);
    },
    // 行双击事件
    onDblclick: () => {
      openEdit(record);
    }
  };
};

// 加载栏目数据
if (!navigationList.value) {
  listCmsNavigation({}).then((res) => {
    navigationList.value = toTreeData({
      data: res?.map((d) => {
        d.value = d.navigationId;
        d.label = d.title;
        if (!d.component) {
          d.disabled = true;
        }
        if (
          d.model == 'index' ||
          d.model == 'page' ||
          d.model == 'order' ||
          d.model == 'links'
        ) {
          d.disabled = true;
        }
        return d;
      }),
      idField: 'navigationId',
      parentIdField: 'parentId'
    });
  });
}

// 加载文章分类
if (!categoryList.value) {
  listCmsArticleCategory({}).then((res) => {
    categoryList.value = toTreeData({
      data: res?.map((d) => {
        d.value = d.categoryId;
        d.label = d.title;
        return d;
      }),
      idField: 'categoryId',
      parentIdField: 'parentId'
    });
  });
}

watch(
  () => router.currentRoute.value.query,
  (query) => {
    if (query) {
      categoryId.value = Number(query.id);
      reload();
    }
  },
  {immediate: true}
);
</script>

<script lang="ts">
export default {
  name: 'CmsArticleV2'
};
</script>
