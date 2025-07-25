<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 搜索表单 -->
      <menu-search @search="reload" />
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="menuId"
        :columns="columns"
        :datasource="datasource"
        :parse-data="parseData"
        :need-page="false"
        :expand-icon-column-index="1"
        :expanded-row-keys="expandedRowKeys"
        :scroll="{ x: 1200 }"
        cache-key="proSystemMenuTable"
        :customRow="customRow"
        @done="onDone"
        @expand="onExpand"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
              <template #icon>
                <plus-outlined />
              </template>
              <span>新建</span>
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="expandAll">
              展开全部
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="foldAll">
              折叠全部
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="removeBatch">
              批量删除
            </a-button>
            <a-button type="dashed" class="ele-btn-icon" @click="cloneMenu">
              一键克隆
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'menuType'">
            <a-tag v-if="isExternalLink(record.path)" color="red">外链</a-tag>
            <a-tag v-else-if="isExternalLink(record.component)" color="orange">
              内链
            </a-tag>
            <a-tag v-else-if="isDirectory(record)" color="blue">目录</a-tag>
            <a-tag v-else-if="record.menuType === 0" color="green">菜单</a-tag>
            <a-tag v-else-if="record.menuType === 1">按钮</a-tag>
          </template>
          <template v-else-if="column.key === 'title'">
            <component v-if="record.icon" :is="record.icon" />
            <a-tooltip title="点击复制">
              <span style="padding-left: 8px" @click="copyText(record.title)">
                {{ record.title }}
              </span>
            </a-tooltip>
          </template>
          <template v-else-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(null, record.menuId)">添加</a>
              <a-divider type="vertical" />
              <a @click="openEdit(record)">修改</a>
              <!--              <a-divider type="vertical" />-->
              <!--              <a @click="addPlug(record)">插件</a>-->
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此菜单吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </a-space>
          </template>
          <template v-if="column.key === 'path'">
            <div v-if="record.modulesUrl">
              <a-tooltip
                :title="`${
                  record.modulesUrl
                    ? record.modulesUrl + record.path + '?token=' + token
                    : ''
                }`"
              >
                <a
                  class="ele-text-primary"
                  @click="
                    openUrl(`${record.modulesUrl}${record.path}?token=${token}`)
                  "
                  >{{ record.path }}</a
                >
              </a-tooltip>
            </div>
            <span v-else>{{ record.path }}</span>
          </template>
          <template v-if="column.key === 'component'">
            <div v-if="record.modulesUrl">
              <a-tooltip
                :title="`${
                  record.modulesUrl ? record.modulesUrl + record.path : ''
                }`"
              >
                <span class="ele-text-primary">{{ record.component }}</span>
              </a-tooltip>
            </div>
            <div v-else>{{ record.component }}</div>
          </template>
          <template v-if="column.key === 'authority'">
            {{ record.authority }}
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <menu-edit
      v-model:visible="showEdit"
      :data="current"
      :parent-id="parentId"
      :menu-list="menuData"
      @done="reload"
    />
    <!-- 制作插件 -->
    <menu-plug
      v-model:visible="showPlug"
      :data="current"
      :parent-id="parentId"
      :menu-list="menuData"
      @done="reload"
    />
    <Delete v-model:visible="showRemoveBatch" @done="reload" />
    <Clone v-model:visible="showClone" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type {
    DatasourceFunction,
    ColumnItem,
    EleProTableDone
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import MenuSearch from './components/menu-search.vue';
  import {
    messageLoading,
    toDateString,
    isExternalLink,
    toTreeData,
    eachTreeData
  } from 'ele-admin-pro/es';
  import type { EleProTable } from 'ele-admin-pro/es';
  import MenuEdit from './components/menu-edit.vue';
  import MenuPlug from './components/menu-plug.vue';
  import Delete from './components/delete.vue';
  import Clone from './components/clone.vue';
  import { listMenus, removeMenu } from '@/api/system/menu';
  import type { Menu, MenuParam } from '@/api/system/menu/model';
  import { copyText, openUrl } from '@/utils/common';
  import { TOKEN_STORE_NAME } from '@/config/setting';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      key: 'index',
      width: 48,
      align: 'center',
      fixed: 'left',
      hideInSetting: true,
      customRender: ({ index }) => index + (tableRef.value?.tableIndex ?? 0)
    },
    {
      title: '菜单名称',
      key: 'title',
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '路由地址',
      dataIndex: 'path',
      key: 'path',
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: '权限标识',
      dataIndex: 'authority',
      key: 'authority',
      showSorterTooltip: false,
      ellipsis: true
    },
    {
      title: 'API节点',
      dataIndex: 'modules'
    },
    {
      title: '菜单编号',
      dataIndex: 'menuId',
      hideInTable: true
    },
    {
      title: '排序',
      dataIndex: 'sortNumber',
      showSorterTooltip: false,
      width: 90
    },
    {
      title: '可见',
      dataIndex: 'hide',
      showSorterTooltip: false,
      customRender: ({ text }) => ['是', '否'][text],
      width: 90
    },
    {
      title: '类型',
      key: 'menuType',
      showSorterTooltip: false,
      width: 90
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      showSorterTooltip: false,
      ellipsis: true,
      hideInTable: true,
      customRender: ({ text }) => toDateString(text)
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      align: 'center'
    }
  ]);

  // 当前编辑数据
  const current = ref<Menu | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  const showPlug = ref(false);
  const showClone = ref(false);
  const showRemoveBatch = ref(false);
  const token = ref(localStorage.getItem(TOKEN_STORE_NAME));

  // 上级菜单id
  const parentId = ref<number>();

  // 菜单数据
  const menuData = ref<Menu[]>([]);

  // 表格展开的行
  const expandedRowKeys = ref<number[]>([]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ where }) => {
    return listMenus({ ...where });
  };

  /* 数据转为树形结构 */
  const parseData = (data: Menu[]) => {
    return toTreeData({
      data: data.map((d) => {
        return { ...d, key: d.menuId, value: d.menuId };
      }),
      idField: 'menuId',
      parentIdField: 'parentId'
    });
  };

  /* 表格渲染完成回调 */
  const onDone: EleProTableDone<Menu> = ({ data }) => {
    menuData.value = data;
  };

  /* 刷新表格 */
  const reload = (where?: MenuParam) => {
    tableRef?.value?.reload({ where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Menu | null, id?: number) => {
    current.value = row ?? null;
    parentId.value = id;
    showEdit.value = true;
  };

  const addPlug = (row?: Menu) => {
    current.value = row ?? null;
    showPlug.value = true;
  };

  const removeBatch = () => {
    showRemoveBatch.value = true;
  };

  /* 一键克隆 */
  const cloneMenu = (row?: Menu | null, id?: number) => {
    current.value = row ?? null;
    parentId.value = id;
    showClone.value = true;
  };

  /* 删除单个 */
  const remove = (row: Menu) => {
    if (row.children?.length) {
      message.error('请先删除子节点');
      return;
    }
    const hide = messageLoading('请求中..', 0);
    removeMenu(row.menuId)
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

  /* 展开全部 */
  const expandAll = () => {
    let keys: number[] = [];
    eachTreeData(menuData.value, (d) => {
      if (d.children && d.children.length && d.menuId) {
        keys.push(d.menuId);
      }
    });
    expandedRowKeys.value = keys;
  };

  /* 折叠全部 */
  const foldAll = () => {
    expandedRowKeys.value = [];
  };

  /* 自定义行属性 */
  const customRow = (record: Menu) => {
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

  /* 点击展开图标时触发 */
  const onExpand = (expanded: boolean, record: Menu) => {
    if (expanded) {
      expandedRowKeys.value = [
        ...expandedRowKeys.value,
        record.menuId as number
      ];
    } else {
      expandedRowKeys.value = expandedRowKeys.value.filter(
        (d) => d !== record.menuId
      );
    }
  };

  /* 判断是否是目录 */
  const isDirectory = (d: Menu) => {
    return !!d.children?.length && !d.component;
  };
</script>

<script lang="ts">
  import * as MenuIcons from '@/layout/menu-icons';

  export default {
    name: 'SystemMenu',
    components: MenuIcons
  };
</script>
