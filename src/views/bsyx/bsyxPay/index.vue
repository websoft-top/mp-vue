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
          <template v-if="column.key === 'name'">
            <div @click="onSearch(record)" class="cursor-pointer">{{ record.name || '匿名' }}</div>
          </template>
          <template v-if="column.key === 'phone'">
            <div v-if="record.mobile" class="text-gray-400">{{ record.mobile }}</div>
            <div v-else class="text-gray-600">{{ record.phone }}</div>
          </template>
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="50"/>
          </template>
          <template v-if="column.key === 'sex'">
            <a-tag v-if="record.sex === 1">男</a-tag>
            <a-tag v-if="record.sex === 2">女</a-tag>
          </template>
          <template v-if="column.key === 'present'">
            <a-tag v-if="record.present">能</a-tag>
            <a-tag v-else>不能</a-tag>
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
        <template #footer>
          <span v-if="totalPriceAmount" class="text-red-500 font-bold">小计：￥{{ totalPriceAmount.toFixed(2) }}</span>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <BszxPayEdit v-model:visible="showEdit" :data="current" @done="reload"/>
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
import BszxPayEdit from './components/bszxPayEdit.vue';
import {pageBszxPay, removeBszxPay, removeBatchBszxPay} from '@/api/bszx/bszxPay';
import type {BszxPay, BszxPayParam} from '@/api/bszx/bszxPay/model';
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/bsyx/extra.vue";
import {PageResult} from "@/api";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<BszxPay[]>([]);
// 当前编辑数据
const current = ref<BszxPay | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);
const totalPriceAmount = ref<number>(0);

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
  return pageBszxPay({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 整理数据
const parseData = (data: PageResult<BszxPay>) => {
  totalPriceAmount.value = 0;
  data.list?.map((item) => {
    if(item.price){
      totalPriceAmount.value += Number(item.price)
    }
  })
  return data;
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: '订单编号',
    dataIndex: 'orderNo',
    key: 'orderNo',
    align: 'center',
    width: 200,
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
    width: 120
  },
  {
    title: '捐款金额',
    dataIndex: 'price',
    key: 'price',
    width: 120,
    align: 'center',
    sorter: true,
    customRender: ({text}) => '￥' + text
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    align: 'center',
    customRender: ({text}) => ['', '男', '女'][text]
  },
  {
    title: '分部',
    dataIndex: 'branchName',
    key: 'branchName',
    align: 'center',
  },
  {
    title: '年级',
    dataIndex: 'gradeName',
    key: 'gradeName',
    align: 'center',
  },
  {
    title: '班级',
    dataIndex: 'className',
    key: 'className',
    align: 'center',
  },
  {
    title: '居住地址',
    dataIndex: 'address',
    key: 'address',
    align: 'center',
  },
  {
    title: '工作单位',
    dataIndex: 'workUnit',
    key: 'workUnit',
    align: 'center',
  },
  {
    title: '职务',
    dataIndex: 'position',
    key: 'position',
    align: 'center',
  },
  // {
  //   title: '捐赠证书',
  //   dataIndex: 'certificate',
  //   key: 'certificate',
  //   align: 'center',
  // },
  {
    title: '心愿',
    dataIndex: 'comments',
    key: 'comments',
    align: 'center',
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   align: 'center',
  // },
  {
    title: '捐款时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    width: 180,
    sorter: true,
    ellipsis: true
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
const reload = (where?: BszxPayParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

const onSearch = (item: BszxPay) => {
  reload({userId: item.userId})
}

/* 打开编辑弹窗 */
const openEdit = (row?: BszxPay) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: BszxPay) => {
  const hide = message.loading('请求中..', 0);
  removeBszxPay(row.id)
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
      removeBatchBszxPay(selection.value.map((d) => d.id))
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
const customRow = (record: BszxPay) => {
  return {
    // 行点击事件
    onClick: () => {
      // console.log(record);
    },
    // 行双击事件
    onDblclick: () => {
      // openEdit(record);
    }
  };
};
query();
</script>

<script lang="ts">
export default {
  name: 'BszxPay'
};
</script>

<style lang="less" scoped></style>
