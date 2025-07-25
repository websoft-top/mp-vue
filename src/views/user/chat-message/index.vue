<template>
  <a-page-header :title="title" @back="() => $router.go(-1)">
    <a-card :bordered="false" :body-style="{ padding: '16px' }">
      <ele-pro-table
        ref="tableRef"
        row-key="chatMessageId"
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
          <template v-if="column.key === 'content'">
            <span v-if="record.type === 'card'" class="ele-text-placeholder"
              >[卡片]</span
            >
            <span
              v-else-if="record.type === 'text'"
              v-html="record.content"
              @click="openEdit(record)"
            ></span>
            <span v-else class="ele-text-placeholder">[其他]</span>
          </template>
          <template v-if="column.key === 'status'">
            <a-badge dot v-if="record.status === 0" status="error" />
            <a-badge dot v-else status="default" />
          </template>
          <template v-if="column.key === 'action'">
            <a-popconfirm
              title="确定要删除此记录吗？"
              @confirm="remove(record)"
            >
              <a class="ele-text-danger">删除</a>
            </a-popconfirm>
          </template>
        </template>
      </ele-pro-table>
    </a-card>

    <!-- 编辑弹窗 -->
    <ChatMessageEdit
      v-model:visible="showEdit"
      :data="current"
      @done="reload"
    />
  </a-page-header>
</template>

<script lang="ts" setup>
  import { createVNode, ref, watch } from 'vue';
  import { message, Modal } from 'ant-design-vue';
  import {
    ExclamationCircleOutlined,
    NotificationOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro';
  import { toDateString } from 'ele-admin-pro';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import Search from './components/search.vue';
  import ChatMessageEdit from './components/chatMessageEdit.vue';
  import {
    pageChatMessage,
    removeChatMessage,
    removeBatchChatMessage
  } from '@/api/system/chatMessage';
  import type {
    ChatMessage,
    ChatMessageParam
  } from '@/api/system/chatMessage/model';
  import { useRouter } from 'vue-router';
  const { currentRoute } = useRouter();
  import { getPageTitle, getUserId } from '@/utils/common';

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格选中数据
  const selection = ref<ChatMessage[]>([]);
  // 当前编辑数据
  const current = ref<ChatMessage | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 是否显示批量移动弹窗
  const showMove = ref(false);
  // 页面标题
  const title = getPageTitle();
  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where.toUserId = getUserId();
    return pageChatMessage({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: '未/已读',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 90
    },
    {
      title: '消息内容',
      dataIndex: 'content',
      key: 'content'
    },
    {
      title: '发送人',
      dataIndex: 'formUserName',
      key: 'formUserName',
      width: 180,
      align: 'center'
    },
    {
      title: '发送时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
      width: 180,
      sorter: true,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text, 'yyyy-MM-dd HH:mm:ss')
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      align: 'center',
      hideInSetting: true
    }
  ]);

  /* 搜索 */
  const reload = (where?: ChatMessageParam) => {
    selection.value = [];
    tableRef?.value?.reload({ where: where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: ChatMessage) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 打开批量移动弹窗 */
  const openMove = () => {
    showMove.value = true;
  };

  /* 删除单个 */
  const remove = (row: ChatMessage) => {
    const hide = message.loading('请求中..', 0);
    removeChatMessage(row.id)
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
        removeBatchChatMessage(selection.value.map((d) => d.id))
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

  /* 自定义行属性 */
  const customRow = (record: ChatMessage) => {
    return {
      // 行点击事件
      onClick: () => {
        // openEdit(record);
      },
      // 行双击事件
      onDblclick: () => {
        openEdit(record);
      }
    };
  };

  watch(
    currentRoute,
    () => {
      reload();
    },
    { immediate: true }
  );
</script>

<script lang="ts">
  export default {
    name: 'ChatMessage'
  };
</script>

<style lang="less" scoped></style>
