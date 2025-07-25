<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <a-button
        type="text"
        @click="openUrl('/bsyx/grade')"
      >年级设置
      </a-button
      >
      <a-button
        type="text"
        @click="openUrl('/bsyx/class')"
      >班级设置
      </a-button
      >
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
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="50"/>
          </template>
          <template v-if="column.key === 'era'">
            <span>{{ record.era }}级</span>
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
    <BszxClassEdit v-model:visible="showEdit" :data="current" @done="reload"/>
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
import BszxClassEdit from './components/bszxClassEdit.vue';
import {pageBszxClass, removeBszxClass, removeBatchBszxClass} from '@/api/bszx/bszxClass';
import type {BszxClass, BszxClassParam} from '@/api/bszx/bszxClass/model';
import {getPageTitle, openUrl} from "@/utils/common";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<BszxClass[]>([]);
// 当前编辑数据
const current = ref<BszxClass | null>(null);
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
  if (filters) {
    where.status = filters.status;
  }
  return pageBszxClass({
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
  //   dataIndex: 'id',
  //   key: 'id',
  //   width: 120,
  // },
  {
    title: '年级',
    dataIndex: 'gradeName',
    key: 'gradeName',
    width: 120
  },
  // {
  //   title: '年级',
  //   dataIndex: 'gradeId',
  //   key: 'gradeId',
  //   width: 120
  // },
  {
    title: '班级',
    dataIndex: 'name',
    key: 'name'
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
const reload = (where?: BszxClassParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: BszxClass) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: BszxClass) => {
  const hide = message.loading('请求中..', 0);
  removeBszxClass(row.id)
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
      removeBatchBszxClass(selection.value.map((d) => d.id))
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
const customRow = (record: BszxClass) => {
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
  name: 'BszxClass'
};
</script>

<style lang="less" scoped></style>
