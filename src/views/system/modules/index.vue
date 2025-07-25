<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        :scroll="{ x: 800 }"
        cache-key="proSystemModulesTable"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" @click="openEdit()">
              <template #icon>
                <plus-outlined />
              </template>
              <span>新建</span>
            </a-button>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此模块吗？"
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
    <modules-edit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { messageLoading, toDateString } from 'ele-admin-pro/es';
  import ModulesEdit from './components/modules-edit.vue';
  import { pageModules, removeModules } from '@/api/system/modules';
  import type { Modules, ModulesParam } from '@/api/system/modules/model';
  import { Menu } from '@/api/system/menu/model';

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
      title: '名称',
      dataIndex: 'modules',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: 'URL',
      dataIndex: 'modulesUrl',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '备注',
      dataIndex: 'comments',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<Modules[]>([]);

  // 当前编辑数据
  const current = ref<Modules | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    return pageModules({ ...where, ...orders, limit, page });
  };

  /* 搜索 */
  const reload = (where?: ModulesParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: Modules) => {
    current.value = row ?? null;
    showEdit.value = true;
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

  /* 删除单个 */
  const remove = (row: Modules) => {
    const hide = messageLoading('请求中..', 0);
    removeModules(row.id)
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
</script>

<script lang="ts">
  export default {
    name: 'SystemModules'
  };
</script>
