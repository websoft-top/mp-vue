<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <CmsWebsiteSearch/>
    </template>
    <a-spin :spinning="loading" class="page">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="websiteId"
          :columns="columns"
          :datasource="datasource"
          :parse-data="parseData"
          :customRow="customRow"
          :need-page="false"
          :toolbar="false"
          tool-class="ele-toolbar-form"
          class="sys-org-table"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'websiteLogo'">
              <a-image :src="record.websiteLogo" :width="50"/>
            </template>
            <template v-if="column.key === 'websiteName'">
              <div class="font-medium">{{ record.websiteName }}</div>
            </template>
            <template v-if="column.key === 'websiteCode'">
              <div class="text-gray-400">
                {{ record.websiteCode }}
              </div>
            </template>
            <template v-if="column.key === 'domain'">
              <a-space direction="vertical">
                <a
                  v-if="record.domain"
                  :href="`${record.prefix}${record.domain}`"
                  class="text-gray-500 hover:text-blue-500"
                  target="_blank"
                >
                  {{ record.domain }}
                </a>
              </a-space>
            </template>
            <template v-if="column.key === 'type'">
              <a-tag v-if="record.type === 1" color="green">是</a-tag>
              <a-tag
                v-if="record.type === 0"
                @click="updateType(record)"
                class="cursor-pointer"
              >否
              </a-tag
              >
            </template>
            <template v-if="column.key === 'version'">
              <span v-if="record.version === 10">基础版</span>
              <span v-if="record.version === 20">专业版</span>
              <span v-if="record.version === 30">永久授权</span>
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.running === 0" color="red">未开通</a-tag>
              <a-tag v-if="record.running === 1" color="green">运行中</a-tag>
              <a-tag v-if="record.running === 2" color="orange">维护中</a-tag>
              <a-tag v-if="record.running === 3" color="red">已关闭</a-tag>
              <a-tag v-if="record.running === 4" color="red">已欠费停机</a-tag>
              <a-tag v-if="record.running === 5" color="red">违规关停</a-tag>
            </template>
            <template v-if="column.key === 'comments'">
              <div class="text-gray-400 line-clamp-3">{{ record.comments }}</div>
            </template>
            <template v-if="column.key === 'expirationTime'">
              <div class="text-gray-400">{{ toDateString(record.createTime, 'YYYY-MM-dd') }}</div>
              <div class="text-gray-400">{{ toDateString(record.expirationTime, 'YYYY-MM-dd') }}</div>
              <a-tag v-if="record.status < 0 && record.soon < 0" color="red">已过期</a-tag>
              <a-tag v-if="record.status > 0 && record.soon < 0" color="orange">即将过期</a-tag>
            </template>
            <template v-if="column.key === 'action'">
              <a @click="onShare(record)" class="text-green-600">
                <QrcodeOutlined />
                二维码
              </a>
              <a-divider type="vertical"/>
              <a @click="openEdit(record)">
                编辑
              </a>
            </template>
          </template>
          <template #emptyText>
            <a-empty
              :image-style="{
                height: '240px',
              }"
            >
              <template #description>
                <span>
                  欢迎使用本产品，请先创建站点并完成初始化。
                </span>
              </template>
              <div class="pb-10">
                <a-button type="primary" @click="openEdit">立即创建</a-button>
              </div>
            </a-empty>
          </template>
        </ele-pro-table>
      </a-card>

      <!-- 编辑弹窗 -->
      <WebsiteEdit v-model:visible="showEdit" :data="current" @done="reload"/>

      <!-- 二维码 -->
      <Qrcode v-model:visible="showQrcode" :data="`${qrcode}`" @done="hideShare" title="二维码"/>

    </a-spin>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue';
import {ExclamationCircleOutlined, QrcodeOutlined} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro';
import {toDateString} from 'ele-admin-pro';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import WebsiteEdit from './components/websiteEdit.vue';
import Qrcode from '@/components/QrCode/index.vue';
import {
  pageCmsWebsite,
  removeCmsWebsite,
  removeBatchCmsWebsite,
  updateCmsWebsite
} from '@/api/cms/cmsWebsite';
import type {CmsWebsite, CmsWebsiteParam} from '@/api/cms/cmsWebsite/model';
import {getPageTitle} from '@/utils/common';
import {PageResult} from '@/api';
import {pageOrderGoods} from "@/api/system/orderGoods";
import {OrderGoods} from "@/api/system/orderGoods/model";
import CmsWebsiteSearch from "@/views/cms/cmsWebsite/components/search.vue";
import {getAuthorizedDomain} from "@/api/cms/cmsDomain";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

// 表格选中数据
const selection = ref<CmsWebsite[]>([]);
// 当前编辑数据
const current = ref<CmsWebsite | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示批量移动弹窗
const showMove = ref(false);
// 是否显示二维码
const showQrcode = ref(false);
// 二维码内容
const qrcode = ref();
// 加载状态
const loading = ref(true);
// 当前小程序项目
const website = ref<CmsWebsite>();
// 已购买且未安装的小程序
const orderGoods = ref<OrderGoods>();
// 默认域名
const domain = ref<string>();

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders
                                        }) => {
  return pageCmsWebsite({
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
  //   dataIndex: 'websiteId',
  //   key: 'websiteId',
  //   width: 90
  // },
  {
    title: '头像',
    dataIndex: 'websiteLogo',
    key: 'websiteLogo',
    align: 'center',
    width: 120
  },
  {
    title: '小程序名称',
    dataIndex: 'websiteName',
    key: 'websiteName',
    align: 'center'
  },
  {
    title: '小程序信息',
    dataIndex: 'websiteCode',
    key: 'websiteCode',
    align: 'center'
  },
  {
    title: '小程序描述',
    dataIndex: 'comments',
    key: 'comments',
    align: 'center'
  },
  // {
  //   title: '当前版本',
  //   dataIndex: 'version',
  //   key: 'version',
  //   align: 'center'
  // },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    align: 'center',
    width: 170
  },
  {
    title: '创建时间',
    dataIndex: 'expirationTime',
    key: 'expirationTime',
    align: 'center',
    width: 170,
    sorter: true,
    ellipsis: true,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
  {
    title: '操作',
    key: 'action',
    width: 170,
    fixed: 'right',
    align: 'center',
    hideInSetting: true
  }
]);

// 整理数据
const parseData = (data: PageResult<CmsWebsite>) => {
  if (data?.count > 0) {
    website.value = data.list[0];
    localStorage.setItem('WebsiteId', `${website.value?.websiteId}`);
  }
  return data;
};

/* 搜索 */
const reload = (where?: CmsWebsiteParam) => {
  selection.value = [];
  tableRef?.value?.reload({where: where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: CmsWebsite) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开批量移动弹窗 */
const openMove = () => {
  showMove.value = true;
};

const updateType = (row: CmsWebsite) => {
  updateCmsWebsite(row).then((msg) => {
    message.success(msg);
    reload();
  });
};

const onShare = (row?: CmsWebsite) => {
  qrcode.value = `${row?.prefix}${row?.domain}`
  showQrcode.value = true;
}

const hideShare = () => {
  showQrcode.value = false;
}

/* 删除单个 */
const remove = (row: CmsWebsite) => {
  const hide = message.loading('请求中..', 0);
  removeCmsWebsite(row.websiteId)
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
      removeBatchCmsWebsite(selection.value.map((d) => d.websiteId))
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
  // 查询订单
  pageOrderGoods({itemId: 10297, payStatus: true, orderStatus: 0}).then(res => {
    loading.value = false;
    if (res?.count && res?.count > 0) {
      orderGoods.value = res?.list[0];
    }
  })
  // 查询授权域名
  if (localStorage.getItem('Domain')) {
    getAuthorizedDomain().then((data) => {
      if (data) {
        domain.value = data.domain;
      }
    })
  }
};

/* 自定义行属性 */
const customRow = (record: CmsWebsite) => {
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
  name: 'CmsWebsite'
};
</script>

<style lang="less" scoped></style>
