<template>
  <div class="page">
    <div class="ele-body">
      <a-card :bordered="false" :body-style="{ padding: '16px' }">
        <ele-pro-table
          ref="tableRef"
          row-key="cmsWebsiteSettingId"
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
      <CmsWebsiteSettingEdit v-model:visible="showEdit" :data="current" @done="reload" />
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
  import CmsWebsiteSettingEdit from './components/cmsWebsiteSettingEdit.vue';
  import { pageCmsWebsiteSetting, removeCmsWebsiteSetting, removeBatchCmsWebsiteSetting } from '@/api/cms/cmsWebsiteSetting';
  import type { CmsWebsiteSetting, CmsWebsiteSettingParam } from '@/api/cms/cmsWebsiteSetting/model';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<CmsWebsiteSetting[]>([]);
  // 当前编辑数据
  const current = ref<CmsWebsiteSetting | null>(null);
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
    return pageCmsWebsiteSetting({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '自增ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 90,
    },
    {
      title: '关联网站ID',
      dataIndex: 'websiteId',
      key: 'websiteId',
      align: 'center',
    },
    {
      title: '是否官方插件',
      dataIndex: 'official',
      key: 'official',
      align: 'center',
    },
    {
      title: '是否展示在插件市场',
      dataIndex: 'market',
      key: 'market',
      align: 'center',
    },
    {
      title: '是否允许被搜索',
      dataIndex: 'search',
      key: 'search',
      align: 'center',
    },
    {
      title: '是否共享',
      dataIndex: 'share',
      key: 'share',
      align: 'center',
    },
    {
      title: '是否插件 0应用1 插件 ',
      dataIndex: 'plugin',
      key: 'plugin',
      align: 'center',
    },
    {
      title: '编辑器类型 1 md-editor-v3, 2 tinymce-editor',
      dataIndex: 'editor',
      key: 'editor',
      align: 'center',
    },
    {
      title: '显示站内搜索',
      dataIndex: 'searchBtn',
      key: 'searchBtn',
      align: 'center',
    },
    {
      title: '显示登录注册功能',
      dataIndex: 'loginBtn',
      key: 'loginBtn',
      align: 'center',
    },
    {
      title: '显示悬浮客服工具',
      dataIndex: 'kefuTool',
      key: 'kefuTool',
      align: 'center',
    },
    {
      title: '显示版权链接',
      dataIndex: 'copyrightLink',
      key: 'copyrightLink',
      align: 'center',
    },
    {
      title: '导航栏最多显示数量',
      dataIndex: 'maxMenuNum',
      key: 'maxMenuNum',
      align: 'center',
    },
    {
      title: '排序号',
      dataIndex: 'sortNumber',
      key: 'sortNumber',
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
  const reload = (where?: CmsWebsiteSettingParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: CmsWebsiteSetting) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: CmsWebsiteSetting) => {
    const hide = message.loading('请求中..', 0);
    removeCmsWebsiteSetting(row.id)
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
        removeBatchCmsWebsiteSetting(selection.value.map((d) => d.cmsWebsiteSettingId))
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
  const customRow = (record: CmsWebsiteSetting) => {
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
    name: 'CmsWebsiteSetting'
  };
</script>

<style lang="less" scoped></style>
