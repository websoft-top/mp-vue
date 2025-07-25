<template>
  <div class="ele-body">
    <a-card title="我的插件" :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="plugId"
        :columns="columns"
        :datasource="datasource"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        cache-key="proSystemPlugTable"
        @done="onDone"
        @expand="onExpand"
      >
        <template #toolbar>
          <PlugSearch
            @search="reload"
            :selection="selection"
            @add="openEdit"
            @remove="removeBatch"
          />
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'title'">
            <div class="app-box">
              <a-image
                :height="50"
                :width="50"
                :preview="false"
                :src="record.icon"
                fallback="https://file.wsdns.cn/20230218/550e610d43334dd2a7f66d5b20bd58eb.svg"
              />
              <!--              <component v-if="record.icon" :is="record.icon" />-->
              <div class="app-info">
                <a class="ele-text-heading" @click="openEdit(record)">
                  {{ record.title }}
                </a>
                <div class="ele-text-placeholder comments">
                  {{ record.comments }}
                </div>
                <a-space size="large" class="ele-text-placeholder">
                  <a
                    class="ele-text-placeholder"
                    :href="`${record.domain}`"
                    target="_blank"
                  >
                    {{ record.companyName }}
                  </a>
                  <span>下载: {{ record.clicks ? record.clicks : 0 }}</span>
                  <span>收藏: {{ record.installs ? record.installs : 0 }}</span>
                </a-space>
              </div>
            </div>
          </template>
          <template v-else-if="column.key === 'comments'">
            <span class="ele-text-secondary">
              {{ record.comments }}
            </span>
          </template>
          <template v-if="column.key === 'appType'">
            <span class="ele-text-placeholder" v-if="record.appType === 'web'">
              网站应用
            </span>
            <span
              class="ele-text-placeholder"
              v-if="record.appType === 'mp-weixin'"
            >
              小程序
            </span>
            <span
              class="ele-text-placeholder"
              v-if="record.appType === 'h5-weixin'"
            >
              公众号
            </span>
            <span
              class="ele-text-placeholder"
              v-if="record.appType === 'app-plus'"
            >
              移动应用
            </span>
            <span class="ele-text-placeholder" v-if="record.appType === 'plug'">
              插件
            </span>
          </template>
          <template v-if="column.key === 'price'">
            <a class="ele-text-warning">￥{{ record.price }}</a>
          </template>
          <template v-if="column.key === 'shortName'">
            <span class="ele-text-success">
              {{ record.sortName }}
            </span>
          </template>
          <template v-if="column.key === 'score'">
            <a>{{ record.score.toFixed(1) }}</a>
          </template>
          <template v-if="column.key === 'status'">
            <a-tag v-if="record.status === 0" color="green">正常</a-tag>
            <a-tag v-if="record.status === 10" color="orange">待审核</a-tag>
            <a-tag v-if="record.status === 20" color="green">已通过</a-tag>
            <a-tag v-if="record.status === 30" color="red">已驳回</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">管理</a>
            </a-space>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <PlugEdit
      v-model:visible="showEdit"
      :data="current"
      :parent-id="parentId"
      :menu-list="menuData"
      @done="reload"
    />
    <clone v-model:visible="showClone" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  const { push } = useRouter();
  import type {
    DatasourceFunction,
    ColumnItem
    // EleProTableDone
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import PlugSearch from './components/plug-search.vue';
  import { toTreeData, toDateString } from 'ele-admin-pro/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import PlugEdit from './components/plug-edit.vue';
  import Clone from './components/clone.vue';
  import { pagePlug } from '@/api/system/plug';
  import type { Plug, PlugParam } from '@/api/system/plug/model';
  import { Menu } from '@/api/system/menu/model';
  import { listMenus } from '@/api/system/menu';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '插件ID',
      dataIndex: 'menuId',
      align: 'center'
    },
    {
      title: '插件名称',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      customRender: ({ text }) => '￥' + text
    },
    {
      title: '评分',
      dataIndex: 'score',
      align: 'center',
      key: 'score'
    },
    {
      title: '审核状态',
      dataIndex: 'status',
      align: 'center',
      key: 'status'
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center'
    }
  ]);

  // 当前编辑数据
  const current = ref<Plug | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  const showClone = ref(false);
  // 上级菜单id
  const parentId = ref<number>();
  // 菜单数据
  const menuData = ref<Menu[]>([]);
  const userStore = useUserStore();
  const loginUser = computed(() => userStore.info ?? {});

  // 表格展开的行
  const expandedRowKeys = ref<number[]>([]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ where }) => {
    where.userId = loginUser.value.userId;
    return pagePlug({ ...where });
  };

  /* 表格渲染完成回调 */
  // const onDone: EleProTableDone<Plug> = ({ data }) => {
  //   menuData.value = data;
  // };

  /* 刷新表格 */
  const reload = (where?: PlugParam) => {
    tableRef?.value?.reload({ where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Plug | null, id?: number) => {
    console.log(row);
    current.value = row ?? null;
    parentId.value = row?.menuId;
    showEdit.value = true;
  };

  /* 一键克隆 */
  const clonePlug = (row?: Plug | null, id?: number) => {
    current.value = row ?? null;
    parentId.value = id;
    showClone.value = true;
  };

  const query = () => {
    listMenus({}).then((res) => {
      if (res) {
        menuData.value = parseData(res);
      }
    });
  };
  /* 数据转为树形结构 */
  const parseData = (data: Menu[]) => {
    return toTreeData({
      data: data
        .filter((d) => d.menuType == 0)
        .map((d) => {
          if (d.parentId != 0) {
            // d.disabled = true;
          }
          return { ...d, key: d.menuId, value: d.menuId };
        }),
      idField: 'menuId',
      parentIdField: 'parentId'
    });
  };
  query();
</script>

<script lang="ts">
  import * as PlugIcons from '@/layout/menu-icons';

  export default {
    name: 'SystemPlug',
    components: PlugIcons
  };
</script>

<style lang="less" scoped>
  .app-box {
    display: flex;
    .app-info {
      display: flex;
      margin-left: 6px;
      margin-right: 6px;
      flex-direction: column;
      justify-content: space-between;
    }
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .sys-org-table :deep(.ant-table-body) {
    overflow: auto !important;
    overflow: overlay !important;
  }

  .sys-org-table :deep(.ant-table-pagination.ant-pagination) {
    padding: 0 4px;
    margin-bottom: 0;
  }
  .ele-text-heading {
  }
  .comments {
    width: 420px;
    padding: 5px 0;
    margin-bottom: 10px;
  }
</style>
