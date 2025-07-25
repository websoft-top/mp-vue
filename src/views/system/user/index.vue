<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra/>
    </template>
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="userId"
        :columns="columns"
        :datasource="datasource"
        v-model:selection="selection"
        :scroll="{ x: 1300 }"
        :where="defaultWhere"
        :customRow="customRow"
        cache-key="proSystemUserTable"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
              <template #icon>
                <plus-outlined/>
              </template>
              <span>新建</span>
            </a-button>
            <a-button
              type="primary"
              class="ele-btn-icon"
              @click="openEdit(selection[0])"
              :disabled="selection.length === 0"
            >
              <template #icon>
                <EditOutlined/>
              </template>
              <span>修改</span>
            </a-button>
            <a-button
              type="primary"
              danger
              @click="resetPsw(selection[0])"
              :disabled="selection.length === 0"
            >重置密码
            </a-button
            >
            <a-button
              danger
              type="primary"
              class="ele-btn-icon"
              @click="removeBatch"
            >
              <template #icon>
                <delete-outlined/>
              </template>
              <span>批量删除</span>
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="openImport">
              <template #icon>
                <upload-outlined/>
              </template>
              <span>导入</span>
            </a-button>
            <a-input-search
              allow-clear
              v-model:value="searchText"
              placeholder="请输入关键词"
              @search="reload"
              @pressEnter="reload"
            />
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'avatar'">
            <a-avatar
              :size="30"
              :src="`${record.avatar}`"
              style="margin-right: 4px"
            >
              <template #icon>
                <UserOutlined/>
              </template>
            </a-avatar>
          </template>
          <template v-if="column.key === 'nickname'">
            <span>{{ record.nickname }}</span>
          </template>
          <template v-if="column.key === 'mobile'">
            <span v-if="hasRole('superAdmin')">{{ record.phone }}</span>
            <span v-else>{{ record.mobile }}</span>
          </template>
          <template v-if="column.key === 'roles'">
            <a-tag v-for="item in record.roles" :key="item.roleId" color="blue">
              {{ item.roleName }}
            </a-tag>
          </template>
          <template v-if="column.key === 'platform'">
            <WechatOutlined v-if="record.platform === 'MP-WEIXIN'"/>
            <Html5Outlined v-if="record.platform === 'H5'"/>
            <ChromeOutlined v-if="record.platform === 'WEB'"/>
          </template>
          <template v-if="column.key === 'balance'">
            <span class="ele-text-success">
              ￥{{ formatNumber(record.balance) }}
            </span>
          </template>
          <template v-if="column.key === 'expendMoney'">
            <span class="ele-text-warning">
              ￥{{ formatNumber(record.expendMoney) }}
            </span>
          </template>
          <template v-if="column.key === 'isAdmin'">
            <a-tag v-if="record.isAdmin">是</a-tag>
            <a-tag v-else>否</a-tag>
            <!--            <a-switch-->
            <!--              :checked="record.isAdmin == 1"-->
            <!--              @change="updateIsAdmin(record)"-->
            <!--            />-->
          </template>
          <template v-if="column.key === 'action'">
            <div>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <!--              <a @click="resetPsw(record)">重置</a>-->
              <!--              <a-divider type="vertical" />-->
              <a-popconfirm
                placement="topRight"
                title="确定要删除此用户吗？"
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
    <user-edit
      v-model:visible="showEdit"
      :data="current"
      :organization-list="data"
      @done="reload"
    />
    <!-- 导入弹窗 -->
    <user-import v-model:visible="showImport" @done="reload"/>
    <!-- 用户详情 -->
    <user-info v-model:visible="showInfo" :data="current" @done="reload"/>
  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref, reactive} from 'vue';
import {message, Modal} from 'ant-design-vue/es';
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  EditOutlined,
  UserOutlined,
  Html5Outlined,
  ChromeOutlined,
  WechatOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro/es';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import {messageLoading, formatNumber} from 'ele-admin-pro/es';
import UserEdit from './components/user-edit.vue';
import UserImport from './components/user-import.vue';
import UserInfo from './components/user-info.vue';
import {toDateString} from 'ele-admin-pro';
import {
  pageUsers,
  removeUser,
  removeUsers,
  updateUserPassword,
  updateUser
} from '@/api/system/user';
import type {User, UserParam} from '@/api/system/user/model';
import {toTreeData, uuid} from 'ele-admin-pro';
import {listRoles} from '@/api/system/role';
import {listOrganizations} from '@/api/system/organization';
import {Organization} from '@/api/system/organization/model';
import {hasRole} from '@/utils/permission';
import {getPageTitle} from "@/utils/common";
import Extra from "./components/Extra.vue";

// 加载状态
const loading = ref(true);
// 树形数据
const data = ref<Organization[]>([]);
// 树展开的key
const expandedRowKeys = ref<number[]>([]);
// 树选中的key
const selectedRowKeys = ref<number[]>([]);
// 表格选中数据
const selection = ref<User[]>([]);
// 当前编辑数据
const current = ref<User | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
// 是否显示用户详情
const showInfo = ref(false);
// 是否显示用户导入弹窗
const showImport = ref(false);
const userType = ref<number>();
const searchText = ref('');

// 加载角色
const roles = ref<any[]>([]);
const filters = () => {
  listRoles().then((result) => {
    result.map((d) => {
      roles.value.push({
        text: d.roleName,
        value: d.roleId
      });
    });
  });
};
filters();
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

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    title: 'ID',
    dataIndex: 'userId',
    width: 90,
    showSorterTooltip: false
  },
  {
    title: '头像',
    key: 'avatar',
    dataIndex: 'avatar',
    align: 'center',
    width: 90
  },
  {
    title: '手机号码',
    dataIndex: 'mobile',
    align: 'center',
    key: 'mobile',
    showSorterTooltip: false
  },
  {
    title: '真实姓名',
    dataIndex: 'realName',
    align: 'center',
    showSorterTooltip: false
  },
  {
    title: '昵称',
    key: 'nickname',
    align: 'center',
    dataIndex: 'nickname'
  },
  {
    title: '性别',
    dataIndex: 'sex',
    align: 'center',
    showSorterTooltip: false,
    customRender: ({text}) => ['', '男', '女'][text]
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    align: 'center',
    hideInTable: true,
    showSorterTooltip: false
  },
  {
    title: '可用余额',
    dataIndex: 'balance',
    align: 'center'
  },
  {
    title: '可用积分',
    dataIndex: 'points',
    align: 'center',
    sorter: true
  },
  {
    title: '实际消费金额',
    dataIndex: 'expendMoney',
    key: 'expendMoney',
    sorter: true,
    align: 'center',
    hideInTable: true,
    showSorterTooltip: false
  },
  {
    title: '注册来源',
    key: 'platform',
    align: 'center',
    dataIndex: 'platform',
    width: 120
  },
  {
    title: '证件号码',
    dataIndex: 'idCard',
    align: 'center',
    hideInTable: true
  },
  {
    title: '出生日期',
    dataIndex: 'birthday',
    key: 'birthday',
    hideInTable: true
  },
  {
    title: '省份',
    dataIndex: 'province',
    key: 'province',
    hideInTable: true
  },
  {
    title: '城市',
    dataIndex: 'city',
    key: 'city',
    hideInTable: true,
    showSorterTooltip: false
  },
  {
    title: '地区',
    dataIndex: 'region',
    key: 'region',
    hideInTable: true,
    showSorterTooltip: false
  },
  {
    title: '邮箱认证',
    dataIndex: 'emailVerified',
    hideInTable: true,
    showSorterTooltip: false,
    customRender: ({text}) => ['未认证', '已认证'][text]
  },
  {
    title: '实名认证',
    dataIndex: 'certification',
    sorter: true,
    hideInTable: true,
    customRender: ({text}) => ['未认证', '已认证'][text]
  },
  {
    title: '角色',
    dataIndex: 'roles',
    key: 'roles',
    align: 'center'
  },
  {
    title: '管理员',
    key: 'isAdmin',
    dataIndex: 'isAdmin',
    sorter: true,
    hideInTable: true,
    showSorterTooltip: false,
    align: 'center'
  },
  {
    title: '注册时间',
    dataIndex: 'createTime',
    sorter: true,
    showSorterTooltip: false,
    ellipsis: true,
    customRender: ({text}) => toDateString(text, 'yyyy-MM-dd')
  },
  {
    title: '操作',
    key: 'action',
    width: 120,
    fixed: 'right',
    align: 'center'
  }
]);

// 默认搜索条件
const defaultWhere = reactive({
  username: '',
  nickname: ''
});

// 表格数据源
const datasource: DatasourceFunction = ({
                                          page,
                                          limit,
                                          where,
                                          orders,
                                          filters
                                        }) => {
  where = {};
  where.roleId = filters.roles;
  where.keywords = searchText.value;
  return pageUsers({page, limit, ...where, ...orders});
};

/* 搜索 */
const reload = (where?: UserParam) => {
  selection.value = [];
  tableRef?.value?.reload({where});
};

/* 打开编辑弹窗 */
const openEdit = (row?: User) => {
  current.value = row ?? null;
  showEdit.value = true;
};

/* 打开用户详情弹窗 */
const openInfo = (row?: User) => {
  current.value = row ?? null;
  showInfo.value = true;
};

/* 打开编辑弹窗 */
const openImport = () => {
  showImport.value = true;
};

const handleTabs = (e) => {
  userType.value = Number(e.target.value);
  reload();
};

/* 删除单个 */
const remove = (row: User) => {
  const hide = messageLoading('请求中..', 0);
  removeUser(row.userId)
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
    content: '确定要删除选中的用户吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = messageLoading('请求中..', 0);
      removeUsers(selection.value.map((d) => d.userId))
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

/* 重置用户密码 */
const resetPsw = (row: User) => {
  Modal.confirm({
    title: '提示',
    content: '确定要重置此用户的密码吗?',
    icon: createVNode(ExclamationCircleOutlined),
    maskClosable: true,
    onOk: () => {
      const hide = message.loading('请求中..', 0);
      const password = uuid(8);
      updateUserPassword(row.userId, password)
        .then((msg) => {
          hide();
          message.success(msg + '，新密码：' + password);
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    }
  });
};

/* 修改用户状态 */
const updateIsAdmin = (row: User) => {
  row.isAdmin = !row.isAdmin;
  updateUser(row)
    .then((msg) => {
      message.success(msg);
    })
    .catch((e) => {
      message.error(e.message);
    });
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
</script>

<script lang="ts">
export default {
  name: 'SystemUser'
};
</script>

<style lang="less" scoped>
.user-box {
  display: flex;
  align-items: center;

  .user-info {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
}
</style>
