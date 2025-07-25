<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="cmsAdId"
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
            :navigationList="navigationList"
            @add="openEdit"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'type'">
            <a-tag v-if="record.type == 1" color="pink">轮播</a-tag>
            <a-tag v-if="record.type == 2" color="blue">图片</a-tag>
            <a-tag v-if="record.type == 3" color="cyan">视频</a-tag>
            <a-tag v-if="record.type == 4">文本</a-tag>
          </template>
          <template v-if="column.key === 'pageId'">
            <span class="text-gray-400">{{ record.pageName }}</span>
          </template>
          <template v-if="column.key === 'categoryId'">
            <span class="text-gray-400">{{ record.categoryName }}</span>
          </template>
          <template v-if="column.key === 'comments'">
            <span class="text-gray-400">{{ record.comments }}</span>
          </template>
          <template v-if="column.key === 'images'">
            <div :class="`item ${record.style}`">
              <template
                v-if="record.type != 4"
                v-for="item in record.imageList"
                :key="index"
              >
                <a-image :src="item.url" :width="80"/>
              </template>
              <template v-if="record.type == 4">
                {{ record.comments }}
              </template>
            </div>
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
    <CmsAdEdit v-model:visible="showEdit" :data="current" :navigationList="navigationList" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import {toTreeData} from 'ele-admin-pro';
import {useI18n} from 'vue-i18n';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import CmsAdEdit from './components/cmsAdEdit.vue';
import {pageCmsAd, removeCmsAd, removeBatchCmsAd} from '@/api/cms/cmsAd';
import type {CmsAd, CmsAdParam} from '@/api/cms/cmsAd/model';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import {listCmsNavigation} from "@/api/cms/cmsNavigation";
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/cms/cmsNavigation/components/extra.vue";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
// 国际化
const {locale} = useI18n();
// 表格选中数据
const selection = ref<CmsAd[]>([]);
// 当前编辑数据
const current = ref<CmsAd | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 栏目数据
const navigationList = ref<CmsNavigation[]>();
// 加载状态
const loading = ref(true);

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
  where.lang = locale.value || undefined;
  return pageCmsAd({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: 'ID',
    width: 90,
    dataIndex: 'adId'
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    ellipsis: true,
    width: 180
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    width: 120
  },
  {
    title: '广告图片',
    dataIndex: 'images',
    key: 'images'
  },
  {
    title: '栏目名称',
    dataIndex: 'categoryId',
    key: 'categoryId',
    align: 'center',
    width: 180
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 120
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: CmsAdParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsAd) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: CmsAd) => {
  const hide = message.loading('请求中..', 0);
  removeCmsAd(row.adId)
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
      removeBatchCmsAd(selection.value.map((d) => d.adId))
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
          if (!d.component) {
            d.disabled = true;
          }
          return d;
        }),
        idField: 'navigationId',
        parentIdField: 'parentId'
      });
    });
  }
};

/* 自定义行属性 */
const customRow = (record: CmsAd) => {
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
  name: 'CmsAd'
};
</script>

<style lang="less" scoped></style>
