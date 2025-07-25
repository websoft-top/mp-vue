<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsDesignId"
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
      <CmsDesignEdit v-model:visible="showEdit" :data="current" @done="reload" />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { message, Modal } from 'ant-design-vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import CmsDesignEdit from './components/cmsDesignEdit.vue';
  import { pageCmsDesign, removeCmsDesign, removeBatchCmsDesign } from '@/api/cms/cmsDesign';
  import type { CmsDesign, CmsDesignParam } from '@/api/cms/cmsDesign/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsDesign[]>([]);
  // 当前编辑数据
  const current = ref<CmsDesign | null>(null);
  // 多语言
  const { locale } = useI18n();
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
    where.lang = locale.value || undefined;
    return pageCmsDesign({
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
      dataIndex: 'pageId',
      key: 'pageId',
      align: 'center',
      width: 90,
    },
    {
      title: '页面标题',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    },
    {
      title: '所属栏目ID',
      dataIndex: 'categoryId',
      key: 'categoryId',
      align: 'center',
    },
    {
      title: '页面关键词',
      dataIndex: 'keywords',
      key: 'keywords',
      align: 'center',
    },
    {
      title: '页面描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '缩列图',
      dataIndex: 'photo',
      key: 'photo',
      align: 'center',
    },
    {
      title: '购买链接',
      dataIndex: 'buyUrl',
      key: 'buyUrl',
      align: 'center',
    },
    {
      title: '页面样式',
      dataIndex: 'style',
      key: 'style',
      align: 'center',
    },
    {
      title: '页面内容',
      dataIndex: 'content',
      key: 'content',
      align: 'center',
    },
    {
      title: '是否开启布局',
      dataIndex: 'showLayout',
      key: 'showLayout',
      align: 'center',
    },
    {
      title: '页面布局',
      dataIndex: 'layout',
      key: 'layout',
      align: 'center',
    },
    {
      title: '上级id, 0是顶级',
      dataIndex: 'parentId',
      key: 'parentId',
      align: 'center',
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
    },
    {
      title: '设为首页',
      dataIndex: 'home',
      key: 'home',
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
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: CmsDesignParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsDesign) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsDesign) => {
    const hide = message.loading('请求中..', 0);
    removeCmsDesign(row.cmsDesignId)
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
        removeBatchCmsDesign(selection.value.map((d) => d.cmsDesignId))
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
  const customRow = (record: CmsDesign) => {
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
    name: 'CmsDesign'
  };
</script>

<style lang="less" scoped></style>
