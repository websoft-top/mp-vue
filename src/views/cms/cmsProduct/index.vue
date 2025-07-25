<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="productId"
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
              @add="openEdit"
              @remove="removeBatch"
              @batchMove="openMove"
            />
          </template>
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'image'">
              <a-image :src="record.image" :width="50"/>
            </template>
            <template v-if="column.key === 'title'">
              <span
                class="cursor-pointer"
                @click="openSpmUrl(`/item`, record, record.productId)"
              >{{ record.title }}</span
              >
            </template>
            <template v-if="column.key ==='categoryName'">
              <span class="cursor-pointer" @click="openSpmUrl(`/product`,record,record.categoryId, true)">{{ record.categoryName }}</span>
            </template>
            <template v-if="column.key === 'price'">
              <span class="text-orange-500">￥{{ record.price }}</span>
            </template>
            <template v-if="column.key === 'salePrice'">
              <span class="text-orange-500">￥{{ record.salePrice }}</span>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green" class="cursor-pointer" @click="updateStatus(record)">
                上架
              </a-tag>
              <a-tag v-if="record.status === 1" color="red" class="cursor-pointer" @click="updateStatus(record)">下架
              </a-tag>
            </template>
            <template v-if="column.key === 'recommend'">
              <a-space @click="onRecommend(record)">
              <span v-if="record.recommend === 1" class="ele-text-success"
              ><CheckOutlined
              /></span>
                <span v-else class="ele-text-placeholder"><CloseOutlined/></span>
              </a-space>
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
      <CmsProductEdit
        v-model:visible="showEdit"
        :data="current"
        :navigationList="navigationList"
        @done="reload"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {CheckOutlined, CloseOutlined, ExclamationCircleOutlined} from '@ant-design/icons-vue';
import type {EleProTable, toTreeData} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Search from './components/search.vue';
import CmsProductEdit from './components/cmsProductEdit.vue';
import {
  pageCmsProduct,
  removeCmsProduct,
  removeBatchCmsProduct, updateCmsProduct
} from '@/api/cms/cmsProduct';
import type {CmsProduct, CmsProductParam} from '@/api/cms/cmsProduct/model';
import {openSpmUrl} from '@/utils/common';
import {CmsNavigation} from "@/api/cms/cmsNavigation/model";
import {listCmsNavigation} from "@/api/cms/cmsNavigation";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<CmsProduct[]>([]);
// 当前编辑数据
const current = ref<CmsProduct | null>(null);
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
  return pageCmsProduct({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: '编号',
    dataIndex: 'productId',
    key: 'productId',
    align: 'center',
    width: 90
  },
  {
    title: '产品名称',
    dataIndex: 'title',
    key: 'title',
    width: 280
  },
  {
    title: '封面图',
    dataIndex: 'image',
    key: 'image',
    align: 'center'
  },
  {
    title: '所属栏目',
    dataIndex: 'categoryName',
    align: 'center',
    key: 'categoryName'
  },
  {
    title: '产品编码',
    dataIndex: 'code',
    key: 'code',
    hideInTable: true,
    align: 'center'
  },
  {
    title: '单位',
    dataIndex: 'unitName',
    key: 'unitName',
    align: 'center'
  },
  {
    title: '进货价格',
    dataIndex: 'price',
    key: 'price',
    align: 'center',
    hideInTable: true
  },
  {
    title: '销售价格',
    dataIndex: 'salePrice',
    key: 'salePrice',
    align: 'center'
  },
  {
    title: '销量',
    dataIndex: 'sales',
    key: 'sales',
    align: 'center'
  },
  {
    title: '推荐',
    dataIndex: 'recommend',
    key: 'recommend',
    align: 'center'
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center'
  },
  {
    title: '排序',
    dataIndex: 'sortNumber',
    key: 'sortNumber',
    align: 'center'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: true,
    ellipsis: true,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
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
const reload = (where?: CmsProductParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsProduct) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: CmsProduct) => {
  const hide = message.loading('请求中..', 0);
  removeCmsProduct(row.productId)
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
      removeBatchCmsProduct(selection.value.map((d) => d.productId))
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

const onRecommend = (row: CmsProduct) => {
  updateCmsProduct({
    ...row,
    recommend: row.recommend == 1 ? 0 : 1
  }).then((msg) => {
    message.success(msg);
    reload();
  });
};

const updateStatus = (item: CmsProduct) => {
  item.status = item.status === 1 ? 0 : 1
  updateCmsProduct(item).then(res => {
    message.success(res);
  })
}

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
const customRow = (record: CmsProduct) => {
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
  name: 'CmsProduct'
};
</script>

<style lang="less" scoped></style>
