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
        v-model:selection="selection"
        tool-class="ele-toolbar-form"
        class="sys-org-table"
      >
        <template #toolbar>
          <search
            @search="reload"
            :selection="selection"
            @add="openEdit"
            :organization-list="data"
            @remove="removeBatch"
            @batchMove="openMove"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'image'">
            <a-image :src="record.image" :width="50"/>
          </template>
          <template v-if="column.key === 'driver'">
            <div>{{ record.driverName }}</div>
            <div>{{ record.driverPhone }}</div>
          </template>
          <template v-if="column.key === 'insuranceStatus'">
            <a-tag v-if="record.insuranceStatus === '在保'">在保</a-tag>
            <a-tag v-if="record.insuranceStatus === '过保'">过保</a-tag>
          </template>
          <template v-if="column.key === 'inFence'">
            <a-tag v-if="record.inFence">围栏内</a-tag>
            <a-tag v-else color="red">围栏外</a-tag>
          </template>

          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0 && record.claim == 0" color="red">未安装</a-tag>
            <a-tag v-if="record.claim === 0 && record.status == 1" color="orange">已安装</a-tag>
            <a-tag v-if="record.claim === 1 && record.status == 1" color="green" @click="updateStatus(record)">已认领
            </a-tag>
          </template>
          <template v-if="column.key === 'createTime'">
            <a-space direction="vertical">
              <a-tooltip title="创建时间">{{ record.createTime }}</a-tooltip>
              <a-tooltip title="安装时间" class="text-orange-500">{{ record.installTime }}</a-tooltip>
              <a-tooltip title="认领时间" class="text-green-500">{{ record.claimTime }}</a-tooltip>
            </a-space>
          </template>
          <template v-if="column.key === 'action'">
            <div>
              <a @click="onShare(record)">二维码</a>
              <a-divider type="vertical"/>
              <a @click="onGpsLog(record)">GPS</a>
              <a-divider type="vertical"/>
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
    <HjmCarEdit v-model:visible="showEdit" :data="current" @done="reload"/>

    <!-- 二维码 -->
    <Qrcode v-model:visible="showQrcode" :data="`${qrcode}`" @done="hideShare"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref, watch} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import Extra from './components/Extra.vue';
import {toTreeData} from 'ele-admin-pro';
import Search from './components/search.vue';
import HjmCarEdit from './components/hjmCarEdit.vue';
import {pageHjmCar, removeHjmCar, removeBatchHjmCar, updateHjmCar} from '@/api/hjm/hjmCar';
import type {HjmCar, HjmCarParam} from '@/api/hjm/hjmCar/model';
import {getPageTitle} from "@/utils/common";
import Qrcode from "./components/qrcode.vue";
import router from "@/router";
import {listOrganizations} from "@/api/system/organization";
import {Organization} from "@/api/system/organization/model";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<HjmCar[]>([]);
// 当前编辑数据
const current = ref<HjmCar | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 加载状态
const loading = ref(true);
// 二维码内容
const qrcode = ref<string>('');
// 是否显示二维码
const showQrcode = ref(false);
// 安装人员ID
const installerId = ref()

// 树形数据
const data = ref<Organization[]>([]);
// 树展开的key
const expandedRowKeys = ref<number[]>([]);
// 树选中的key
const selectedRowKeys = ref<number[]>([]);

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
  if (installerId.value) {
    where.installerId = installerId.value;
  }
  return pageHjmCar({
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
  //   align: 'center',
  //   width: 90,
  // },
  {
    title: '车辆编号',
    dataIndex: 'code',
    key: 'code',
    align: 'center',
  },
  {
    title: '所属快递公司',
    dataIndex: 'parentOrganization',
    key: 'parentOrganization',
    align: 'center',
  },
  {
    title: '所属站点',
    dataIndex: 'organization',
    key: 'organization',
    align: 'center',
  },
  {
    title: '操作员',
    dataIndex: 'driver',
    key: 'driver',
    align: 'center',
  },
  {
    title: '保险状态',
    dataIndex: 'insuranceStatus',
    key: 'insuranceStatus',
    align: 'center',
  },
  {
    title: 'GPS设备编号',
    dataIndex: 'gpsNo',
    key: 'gpsNo',
    align: 'center',
  },
  {
    title: '围栏名称',
    dataIndex: 'fenceName',
    key: 'fenceName',
    align: 'center',
  },
  {
    title: '是否围栏内',
    dataIndex: 'inFence',
    key: 'inFence',
    align: 'center'
  },
  // {
  //   title: '排序',
  //   dataIndex: 'sortNumber',
  //   key: 'sortNumber',
  //   align: 'center',
  // },
  // {
  //   title: '备注',
  //   dataIndex: 'comments',
  //   key: 'comments',
  //   align: 'center',
  // },
  {
    title: '是否安装',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    align: 'center',
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 220,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

/* 搜索 */
const reload = (where?: HjmCarParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: HjmCar) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

const onShare = (row?: HjmCar) => {
  qrcode.value = row?.code + '';
  showQrcode.value = true;
}

const onGpsLog = (row: HjmCar) => {
  window.location.href = `/hjm/gps-log?no=${row?.gpsNo}`
}

const hideShare = () => {
  showQrcode.value = false;
}

const updateStatus = (row?: HjmCar) => {
  Modal.confirm({
    title: '提示',
    content: '确定要解绑吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      updateHjmCar({
        ...row,
        status: 1,
        claim: 0,
        driverId: 0,
        driverName: ''
      }).then(res => {
        message.success(res);
        reload()
      })
    }
  });

}

/* 删除单个 */
const remove = (row: HjmCar) => {
  const hide = message.loading('请求中..', 0);
  removeHjmCar(row.id)
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
      removeBatchHjmCar(selection.value.map((d) => d.id))
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

// 加载机构
  listOrganizations()
    .then((list) => {
      loading.value = false;
      const eks: number[] = [];
      list.forEach((d) => {
        d.key = d.organizationId;
        d.value = d.organizationId;
        d.title = d.organizationName;
        if (typeof d.key === 'number') {
          eks.push(d.key);
        }
      });
      expandedRowKeys.value = eks;
      data.value = toTreeData({
        data: list,
        idField: 'organizationId',
        parentIdField: 'parentId'
      });
      if (list.length) {
        if (typeof list[0].key === 'number') {
          selectedRowKeys.value = [list[0].key];
        }
        // current.value = list[0];
      } else {
        selectedRowKeys.value = [];
        // current.value = null;
      }
    })
    .catch((e) => {
      loading.value = false;
      message.error(e.message);
    });
};

/* 自定义行属性 */
const customRow = (record: HjmCar) => {
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

watch(
  () => router.currentRoute.value.query,
  (param) => {
    query();
    if (param.installerId) {
      installerId.value = param.installerId;
    }
  },
  {immediate: true}
);
</script>

<script lang="ts">
export default {
  name: 'HjmCar'
};
</script>
