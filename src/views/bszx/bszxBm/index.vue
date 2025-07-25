<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
<!--      <Extra/>-->
    </template>
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="id"
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
          <template v-if="column.key === 'name'">
            <a-space>
              <a-avatar :src="record.avatar"/>
              <span>{{ record.name }}</span>
            </a-space>
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
              <!--                <a @click="openEdit(record)">修改</a>-->
              <!--                <a-divider type="vertical" />-->
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
    <bszxBmEdit v-model:visible="showEdit" :data="current" @done="reload"/>
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
import BszxBmEdit from './components/bszxBmEdit.vue';
import {pageBszxBm, removeBszxBm, removeBatchBszxBm} from '@/api/bszx/bszxBm';
import type {BszxBm, BszxBmParam} from '@/api/bszx/bszxBm/model';
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/bszx/extra.vue";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<BszxBm[]>([]);
// 当前编辑数据
const current = ref<BszxBm | null>(null);
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
                                          orders,
                                          filters
                                        }) => {
  // if (filters) {
  //   where.status = filters.status;
  // }
  return pageBszxBm({
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
    width: 90,
    align: 'center',
    fixed: 'left',
    hideInSetting: true,
    customRender: ({index}) => index + (tableRef.value?.tableIndex ?? 0)
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: 120,
    align: 'center',
    customRender: ({text}) => ['校友', '单位', '爱心人士'][text]
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    width: 120
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 130,
    align: 'center',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    width: 90,
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
  {
    title: '是否能到场',
    dataIndex: 'present',
    key: 'present',
    align: 'center',
  },
  // {
  //   title: '状态',
  //   dataIndex: 'status',
  //   key: 'status',
  //   align: 'center',
  // },
  {
    title: '报名时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 180,
    align: 'center',
    sorter: true,
    ellipsis: true
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
const reload = (where?: BszxBmParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: BszxBm) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: BszxBm) => {
  const hide = message.loading('请求中..', 0);
  removeBszxBm(row.id)
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
      removeBatchBszxBm(selection.value.map((d) => d.id))
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
const customRow = (record: BszxBm) => {
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
  name: 'BszxBm'
};
</script>

<style lang="less" scoped></style>
