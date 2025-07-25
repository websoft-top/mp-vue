<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsArticleCategoryId"
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
              <a-image :src="record.image" :width="50" />
            </template>
            <template v-if="column.key === 'status'">
              <a-tag v-if="record.status === 0" color="green">显示</a-tag>
              <a-tag v-if="record.status === 1" color="red">隐藏</a-tag>
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
      </a-card>

      <!-- 编辑弹窗 -->
      <CmsArticleCategoryEdit v-model:visible="showEdit" :data="current" @done="reload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsArticleCategoryEdit from './components/cmsArticleCategoryEdit.vue';
  import { pageCmsArticleCategory, removeCmsArticleCategory, removeBatchCmsArticleCategory } from '@/api/cms/cmsArticleCategory';
  import type { CmsArticleCategory, CmsArticleCategoryParam } from '@/api/cms/cmsArticleCategory/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsArticleCategory[]>([]);
  // 当前编辑数据
  const current = ref<CmsArticleCategory | null>(null);
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
    return pageCmsArticleCategory({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '文章分类ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      align: 'center',
      width: 90,
    },
    {
      title: '分类标识',
      dataIndex: 'categoryCode',
      key: 'categoryCode',
      align: 'center',
    },
    {
      title: '分类名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: '类型 0列表 1单页 2外链',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '分类图片',
      dataIndex: 'image',
      key: 'image',
      align: 'center',
    },
    {
      title: '上级分类ID',
      dataIndex: 'parentId',
      key: 'parentId',
      align: 'center',
    },
    {
      title: '路由/链接地址',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      title: '组件路径',
      dataIndex: 'component',
      key: 'component',
      align: 'center',
    },
    {
      title: '绑定的页面',
      dataIndex: 'pageId',
      key: 'pageId',
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
    },
    {
      title: '文章数量',
      dataIndex: 'count',
      key: 'count',
      align: 'center',
    },
    {
      title: '排序(数字越小越靠前)',
      dataIndex: 'sortNumber',
      key: 'sortNumber',
      align: 'center',
    },
    {
      title: '备注',
      dataIndex: 'comments',
      key: 'comments',
      align: 'center',
    },
    {
      title: '是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)',
      dataIndex: 'hide',
      key: 'hide',
      align: 'center',
    },
    {
      title: '是否推荐',
      dataIndex: 'recommend',
      key: 'recommend',
      align: 'center',
    },
    {
      title: '是否显示在首页',
      dataIndex: 'showIndex',
      key: 'showIndex',
      align: 'center',
    },
    {
      title: '状态, 0正常, 1禁用',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '是否删除, 0否, 1是',
      dataIndex: 'deleted',
      key: 'deleted',
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      sorter: true,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text, 'yyyy-MM-dd')
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      align: 'center',
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
  const reload = (where?: CmsArticleCategoryParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsArticleCategory) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsArticleCategory) => {
    const hide = message.loading('请求中..', 0);
    removeCmsArticleCategory(row.cmsArticleCategoryId)
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
        removeBatchCmsArticleCategory(selection.value.map((d) => d.cmsArticleCategoryId))
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
  const customRow = (record: CmsArticleCategory) => {
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
    name: 'CmsArticleCategory'
  };
</script>

<style lang="less" scoped></style>
