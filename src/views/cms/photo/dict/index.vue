<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="dictDataId"
        :columns="columns"
        :datasource="datasource"
        :customRow="customRow"
        :scroll="{ x: 800 }"
        cache-key="proSystemRoleTable"
      >
        <template #toolbar>
          <a-space>
            <a-button type="primary" class="ele-btn-icon" :disabled="!websiteId" @click="openEdit()">
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
                title="确定要删除此分类吗？"
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
    <dict-edit
      v-model:visible="showEdit"
      :dictId="dictId"
      :data="current"
      @done="reload"
    />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import {
    PlusOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { messageLoading } from 'ele-admin-pro/es';
  import DictEdit from './components/dict-edit.vue';
  import {
    pageDictData,
    removeDictData,
    removeDictDataBatch
  } from '@/api/system/dict-data';
  import { DictParam } from '@/api/system/dict/model';
  import { DictData } from '@/api/system/dict-data/model';
  import { addDict, listDictionaries } from '@/api/system/dict';
  import { Dictionary } from '@/api/system/dictionary/model';

  // 网站ID
  const websiteId = localStorage.getItem('WebsiteId')
  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  const dictId = ref(0);

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'dictDataId',
      width: 80
    },
    {
      title: '分类名称',
      dataIndex: 'dictDataName',
      showSorterTooltip: false
    },
    {
      title: '备注',
      dataIndex: 'comments',
      sorter: true,
      showSorterTooltip: false
    },
    {
      title: '排序号',
      width: 180,
      align: 'center',
      dataIndex: 'sortNumber'
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      align: 'center'
    }
  ]);

  // 表格选中数据
  const selection = ref<DictData[]>([]);

  // 当前编辑数据
  const current = ref<Dictionary | null>(null);

  // 是否显示编辑弹窗
  const showEdit = ref(false);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where.dictCode = 'groupId';
    return pageDictData({ ...where, ...orders, page, limit });
  };

  /* 搜索 */
  const reload = (where?: DictParam) => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: DictData) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: DictData) => {
    const hide = messageLoading('请求中..', 0);
    removeDictData(row.dictDataId)
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
      content: '确定要删除选中的分类吗?',
      icon: createVNode(ExclamationCircleOutlined),
      maskClosable: true,
      onOk: () => {
        const hide = messageLoading('请求中..', 0);
        removeDictDataBatch(selection.value.map((d) => d.dictDataId))
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

  // 初始化字典
  const loadDict = () => {
    listDictionaries({ dictCode: 'groupId' }).then(async (data) => {
      if (data?.length == 0) {
        await addDict({ dictCode: 'groupId', dictName: '工单分类' });
      }
      await listDictionaries({ dictCode: 'groupId' }).then((list) => {
        list?.map((d) => {
          dictId.value = Number(d.dictId);
        });
      });
    });
  };

  loadDict();

  /* 自定义行属性 */
  const customRow = (record: DictData) => {
    return {
      onDblclick: () => {
        openEdit(record);
      }
    };
  };
</script>

<script lang="ts">
  export default {
    name: 'GroupIdDict'
  };
</script>
