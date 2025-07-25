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
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="orange">待审核</a-tag>
            <a-tag v-if="record.status === 1" color="green">审核通过</a-tag>
            <a-tag v-if="record.status === 2" color="red">已驳回</a-tag>
            <div class="text-orange-500 py-1" v-if="record.status == 2">原因：{{ record.comments }}</div>
          </template>
          <template v-if="column.key === 'action'">
            <div>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                title="确定要删除此记录吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <UserVerifyEdit v-model:visible="showEdit" :data="current" @done="reload"/>
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
import UserVerifyEdit from './components/userVerifyEdit.vue';
import {pageUserVerify, removeUserVerify, removeBatchUserVerify} from '@/api/system/userVerify';
import type {UserVerify, UserVerifyParam} from '@/api/system/userVerify/model';
import {getPageTitle} from "@/utils/common";
import Extra from "@/views/system/user/components/Extra.vue";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<UserVerify[]>([]);
// 当前编辑数据
const current = ref<UserVerify | null>(null);
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
  where.type = 0;
  return pageUserVerify({
    ...where,
    ...orders,
    page,
    limit
  });
};

// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: '用户ID',
    dataIndex: 'userId',
    key: 'userId',
    align: 'center',
    width: 90
  },
  {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    align: 'center',
    customRender: ({text}) => ['个人', '企业'][text]
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    key: 'realName',
    align: 'center',
  },
  {
    title: '证件号码',
    dataIndex: 'idCard',
    key: 'idCard',
    align: 'center',
  },
  {
    title: '手机号码',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
  // {
  //   title: '身份证',
  //   dataIndex: 'sfz1',
  //   key: 'sfz1',
  //   align: 'center',
  // },
  // {
  //   title: '营业执照',
  //   dataIndex: 'yyzz',
  //   key: 'yyzz',
  //   align: 'center',
  // },
  // {
  //   title: '其他',
  //   dataIndex: 'files',
  //   key: 'files',
  //   align: 'center',
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  // {
  //   title: '驳回',
  //   dataIndex: 'comments',
  //   key: 'comments',
  //   align: 'center',
  // },
  {
    title: '添加时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 130,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: UserVerifyParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: UserVerify) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

/* 删除单个 */
const remove = (row: UserVerify) => {
  const hide = message.loading('请求中..', 0);
  removeUserVerify(row.id)
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
      removeBatchUserVerify(selection.value.map((d) => d.id))
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
const customRow = (record: UserVerify) => {
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
  name: 'UserVerify'
};
</script>

<style lang="less" scoped></style>
