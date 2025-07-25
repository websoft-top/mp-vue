<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsMpMenuId"
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
      <CmsMpMenuEdit v-model:visible="showEdit" :data="current" @done="reload" />
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
  import CmsMpMenuEdit from './components/cmsMpMenuEdit.vue';
  import { pageCmsMpMenu, removeCmsMpMenu, removeBatchCmsMpMenu } from '@/api/cms/cmsMpMenu';
  import type { CmsMpMenu, CmsMpMenuParam } from '@/api/cms/cmsMpMenu/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsMpMenu[]>([]);
  // 当前编辑数据
  const current = ref<CmsMpMenu | null>(null);
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
    return pageCmsMpMenu({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'menuId',
      key: 'menuId',
      align: 'center',
      width: 90,
    },
    {
      title: '上级id, 0是顶级',
      dataIndex: 'parentId',
      key: 'parentId',
      align: 'center',
    },
    {
      title: '菜单名称',
      dataIndex: 'title',
      key: 'title',
      align: 'center',
    },
    {
      title: '类型 0功能图标 1订单状态图标 2首页导航图标 3 商城导航图标 4管理人员功能图标',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
    },
    {
      title: '是否微信小程序菜单',
      dataIndex: 'isMpWeixin',
      key: 'isMpWeixin',
      align: 'center',
    },
    {
      title: '菜单路由地址',
      dataIndex: 'path',
      key: 'path',
      align: 'center',
    },
    {
      title: '菜单组件地址, 目录可为空',
      dataIndex: 'component',
      key: 'component',
      align: 'center',
    },
    {
      title: '打开位置',
      dataIndex: 'target',
      key: 'target',
      align: 'center',
    },
    {
      title: '菜单图标',
      dataIndex: 'avatar',
      key: 'avatar',
      align: 'center',
    },
    {
      title: '图标颜色',
      dataIndex: 'color',
      key: 'color',
      align: 'center',
    },
    {
      title: '上传图标',
      dataIndex: 'icon',
      key: 'icon',
      align: 'center',
    },
    {
      title: '是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)',
      dataIndex: 'hide',
      key: 'hide',
      align: 'center',
    },
    {
      title: '位置 0不限 1顶部 2底部',
      dataIndex: 'position',
      key: 'position',
      align: 'center',
    },
    {
      title: '0 第一行 1第二行',
      dataIndex: 'rows',
      key: 'rows',
      align: 'center',
    },
    {
      title: '菜单侧栏选中的path',
      dataIndex: 'active',
      key: 'active',
      align: 'center',
    },
    {
      title: '其它路由元信息',
      dataIndex: 'meta',
      key: 'meta',
      align: 'center',
    },
    {
      title: '绑定的页面',
      dataIndex: 'pageId',
      key: 'pageId',
      align: 'center',
    },
    {
      title: '绑定的文章分类ID',
      dataIndex: 'articleCategoryId',
      key: 'articleCategoryId',
      align: 'center',
    },
    {
      title: '绑定的文章ID',
      dataIndex: 'articleId',
      key: 'articleId',
      align: 'center',
    },
    {
      title: '绑定的表单ID',
      dataIndex: 'formId',
      key: 'formId',
      align: 'center',
    },
    {
      title: '绑定的书籍标识',
      dataIndex: 'bookCode',
      key: 'bookCode',
      align: 'center',
    },
    {
      title: '绑定的商品分类ID',
      dataIndex: 'goodsCategoryId',
      key: 'goodsCategoryId',
      align: 'center',
    },
    {
      title: '绑定的商品ID',
      dataIndex: 'goodsId',
      key: 'goodsId',
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
    },
    {
      title: '是否管理人员可见',
      dataIndex: 'adminShow',
      key: 'adminShow',
      align: 'center',
    },
    {
      title: '设为首页',
      dataIndex: 'home',
      key: 'home',
      align: 'center',
    },
    {
      title: '分组名称',
      dataIndex: 'groupName',
      key: 'groupName',
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
      title: '状态, 0正常, 1冻结',
      dataIndex: 'status',
      key: 'status',
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
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: CmsMpMenuParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsMpMenu) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsMpMenu) => {
    const hide = message.loading('请求中..', 0);
    removeCmsMpMenu(row.cmsMpMenuId)
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
        removeBatchCmsMpMenu(selection.value.map((d) => d.cmsMpMenuId))
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
  const customRow = (record: CmsMpMenu) => {
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
    name: 'CmsMpMenu'
  };
</script>

<style lang="less" scoped></style>
