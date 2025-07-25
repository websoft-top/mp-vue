<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
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
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'realName'">
            <a-tooltip :title="`点击查询明细`"><a :href="`/website/car?installerId=${record.userId}`" class="cursor-pointer">{{ record.realName }}</a></a-tooltip>
          </template>
          <template v-if="column.key === 'followers'">
            <a-tooltip :title="`点击更新`" class="cursor-pointer" @click="updateRowsByFollowers(record)">
              <a-tag color="green">{{ record.followers }}</a-tag>
            </a-tooltip>
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <HjmFenceEdit v-model:visible="showEdit" :data="current" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {ref} from 'vue';
import type {EleProTable} from 'ele-admin-pro';
import {message} from 'ant-design-vue';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import HjmFenceEdit from './components/hjmFenceEdit.vue';
import {getPageTitle} from "@/utils/common";
import {pageUsers, updateUser} from "@/api/system/user";
import {User, UserParam} from "@/api/system/user/model";
import {pageHjmCar} from "@/api/hjm/hjmCar";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<User[]>([]);
// 当前编辑数据
const current = ref<User | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 加载状态
const loading = ref(true);

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders
                                        }) => {
  where.organizationId = 440;
  return pageUsers({
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
    width: 90
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
    width: 180
  },
  {
    title: '安装数量',
    dataIndex: 'followers',
    key: 'followers',
    width: 180
  }
]);

/* 搜索 */
const reload = (where?: UserParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: User) => {
  current.value = row ?? null;
  showEdit.value = true;
};

const updateRowsByFollowers = (item: User) => {
  pageHjmCar({
    installerId: item.userId
  }).then(res => {
    updateUser({
      ...item,
      followers: res?.count
    }).then(() => {
      reload();
      message.success('更新成功');
    })
  }).catch(() => {
    message.error('更新失败');
  })
}

/* 查询 */
const query = () => {
  loading.value = true;
};

/* 自定义行属性 */
const customRow = (record: User) => {
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
  name: 'HjmCarCount'
};
</script>

<style lang="less" scoped></style>
