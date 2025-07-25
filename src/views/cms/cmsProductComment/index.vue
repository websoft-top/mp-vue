<template>
  <ele-pro-table
    ref="tableRef"
    row-key="id"
    :columns="columns"
    :datasource="datasource"
    v-model:selection="selection"
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
      <template v-if="column.key === 'nickname'">
        <a-space class="flex ">
          <span>{{ record.nickname }}</span>
        </a-space>
      </template>
      <template v-if="column.key === 'status'">
        <a-tag v-if="record.status === 1" color="green">精选</a-tag>
        <a-tag v-if="record.status === 0">隐藏</a-tag>
      </template>
      <template v-if="column.key === 'action'">
        <a-space>
          <a @click="openEdit(record)">修改</a>
          <a-divider type="vertical" />
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
  <!-- 编辑弹窗 -->
  <CmsProductCommentEdit v-model:visible="showEdit" :data="current" @done="reload" />
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type {EleProTable, toTreeData} from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsProductCommentEdit from './components/cmsProductCommentEdit.vue';
  import {
    removeCmsProductComment,
    removeBatchCmsProductComment,
    listCmsProductComment, pageCmsProductComment
  } from '@/api/cms/cmsProductComment';
  import type { CmsProductComment, CmsProductCommentParam } from '@/api/cms/cmsProductComment/model';

  const props = withDefaults(
    defineProps<{
      productId?: number;
    }>(),
    {}
  );

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsProductComment[]>([]);
  // 当前编辑数据
  const current = ref<CmsProductComment | null>(null);
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
    if(props.productId){
      where.productId = props.productId;
    }
    return pageCmsProductComment({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 数据转为树形结构 */
  const parseData = (data: CmsProductComment[]) => {
    return toTreeData({
      data: data?.map((d) => {
        return { ...d, key: d.userId, value: d.userId };
      }),
      idField: 'userId',
      parentIdField: 'parentId'
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '昵称',
      dataIndex: 'nickname',
      key: 'nickname',
      align: 'center',
    },
    {
      title: '评论内容',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
    },
    {
      title: '精选',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '评论时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      sorter: true,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text, 'yyyy-MM-dd HH:mm')
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
  const reload = (where?: CmsProductCommentParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsProductComment) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsProductComment) => {
    const hide = message.loading('请求中..', 0);
    removeCmsProductComment(row.id)
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
        removeBatchCmsProductComment(selection.value.map((d) => d.id))
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
  const customRow = (record: CmsProductComment) => {
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
    name: 'CmsProductComment'
  };
</script>

<style lang="less" scoped></style>
