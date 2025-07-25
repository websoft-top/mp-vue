<template>
  <div class="page">
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        v-model:selection="selection"
        :customRow="customRow"
        :scroll="{ x: 800 }"
        cache-key="proCmsVideoTable"
      >
        <template #toolbar>
          <div class="flex justify-between">
            <a-space>
              <a-upload
                :show-upload-list="false"
                :accept="'image/*,application/*'"
                :customRequest="onUpload"
              >
                <a-button type="primary" :disabled="!websiteId" class="ele-btn-icon">
                  <template #icon>
                    <UploadOutlined />
                  </template>
                  <span>上传图片</span>
                </a-button>
              </a-upload>
              <a-button
                danger
                type="primary"
                class="ele-btn-icon"
                v-if="selection.length > 0"
                @click="removeBatch"
              >
                <template #icon>
                  <delete-outlined />
                </template>
                <span>批量删除</span>
              </a-button>
              <DictSelect
                dict-code="groupId"
                :width="200"
                :show-search="true"
                placeholder="按分组筛选"
                v-model:value="where.groupId"
                @change="reload"
              />
              <a-input-search
                allow-clear
                placeholder="请输入关键词"
                style="width: 280px"
                v-model:value="where.keywords"
                @pressEnter="reload"
                @search="reload"
              />
              <a-button type="text" @click="reset">重置</a-button>
              <a-button
                type="text"
                @click="openUrl('/cms/photo/dict')"
              >管理分组</a-button
              >
            </a-space>
          </div>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'path'">
            <!-- 文件类型 -->
            <template v-if="!isImage(record.path)">
              <span class="ele-text-secondary">[文件]</span>
            </template>
            <!-- 含http -->
            <template v-else-if="record.path.indexOf('http') == 0">
              <a-image
                :src="`${record.thumbnail}`"
                :preview="{
                  src: `${record.downloadUrl}`
                }"
                :width="80"
              />
            </template>
            <!-- path -->
            <template v-else>
              <a-image
                :src="`${record.domain}${record.downloadUrl}`"
                :preview="{
                  src: `${record.domain}${record.downloadUrl}`
                }"
                :width="80"
              />
            </template>
          </template>
          <template v-if="column.dataIndex === 'name'">
            <div>{{ record.name }}<copy-outlined
              style="padding-left: 4px"
              @click="copyText(record.downloadUrl)"
            /></div>
            <div class="text-gray-400">{{ record.comments }}</div>

          </template>
          <template v-if="column.dataIndex === 'comments'">
            <span @click="openEdit(record)">{{ record.comments }}</span>
          </template>
          <template v-if="column.key === 'action'">
            <a-space>
              <a @click="openEdit(record)">编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm
                placement="topRight"
                title="确定要删除此文件吗？"
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
    <PhotoEdit v-model:visible="showEdit" :data="current" @done="reload" />
  </div>
</template>

<script lang="ts" setup>
  import { createVNode, ref } from 'vue';
  import { message, Modal } from 'ant-design-vue/es';
  import {
    UploadOutlined,
    DeleteOutlined,
    CopyOutlined,
    ExclamationCircleOutlined
  } from '@ant-design/icons-vue';
  import type { EleProTable } from 'ele-admin-pro/es';
  import type {
    DatasourceFunction,
    ColumnItem
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import { messageLoading, toDateString } from 'ele-admin-pro/es';
  import PhotoEdit from './components/photo-edit.vue';
  import {
    pageFiles,
    removeFile,
    removeFiles,
    uploadOss
  } from '@/api/system/file';
  import type {
    FileRecord,
    FileRecordParam
  } from '@/api/system/file/model';
  import {copyText, isImage, openUrl} from '@/utils/common';
  import DictSelect from '@/components/DictSelect/index.vue';
  import { getMerchantId } from '@/utils/merchant';
  import useSearch from "@/utils/use-search";

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
  // 表格选中数据
  const selection = ref<FileRecord[]>([]);
  // 当前编辑数据
  const current = ref<FileRecord | null>(null);
  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 网站ID
  const websiteId = localStorage.getItem('WebsiteId')
  // 表格列配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'id',
      width: 90,
      hideInTable: true
    },
    {
      title: '图片',
      dataIndex: 'path',
      width: 120,
      align: 'center',
      key: 'path'
    },
    {
      title: '文件名称',
      dataIndex: 'name'
    },
    {
      title: '分组ID',
      dataIndex: 'groupId',
      align: 'center',
      width: 120
    },
    {
      title: '文件大小',
      dataIndex: 'length',
      align: 'center',
      sorter: true,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => {
        if (text < 1024) {
          return text + 'B';
        } else if (text < 1024 * 1024) {
          return (text / 1024).toFixed(1) + 'KB';
        } else if (text < 1024 * 1024 * 1024) {
          return (text / 1024 / 1024).toFixed(1) + 'M';
        } else {
          return (text / 1024 / 1024 / 1024).toFixed(1) + 'G';
        }
      },
      width: 120
    },
    {
      title: '上传人',
      width: 120,
      align: 'center',
      dataIndex: 'createNickname'
    },
    {
      title: '上传时间',
      dataIndex: 'createTime',
      sorter: true,
      align: 'center',
      width: 180,
      showSorterTooltip: false,
      ellipsis: true,
      customRender: ({ text }) => toDateString(text)
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      align: 'center'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    if (where.reset) {
      where = {};
    }
    where.merchantId = getMerchantId();
    where.contentType = 'image';
    return pageFiles({ ...where, ...orders, page, limit });
  };

  // 表单数据
  const { where, resetFields } = useSearch<FileRecordParam>({
    groupId: undefined,
    keywords: ''
  });

  /* 搜索 */
  const reload = () => {
    selection.value = [];
    tableRef?.value?.reload({ page: 1, where });
  };

  /* 打开编辑弹窗 */
  const openEdit = (row?: FileRecord) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: FileRecord) => {
    const hide = messageLoading('请求中..', 0);
    removeFile(row.id)
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
        const hide = messageLoading('请求中..', 0);
        removeFiles(selection.value.map((d) => d.id))
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

  const reset = () => {
    resetFields();
    reload();
  };

  // 上传文件
  const onUpload = (item) => {
    const { file } = item;
    if (file.size / 1024 / 1024 > 100) {
      message.error('大小不能超过 100MB');
      return;
    }
    const hide = messageLoading({
      content: '上传中..',
      duration: 0,
      mask: true
    });
    uploadOss(file)
      .then(() => {
        hide();
        message.success('上传成功');
        reload();
      })
      .catch((e) => {
        message.error(e.message);
        hide();
      });
  };

  /* 自定义行属性 */
  const customRow = (record: FileRecord) => {
    return {
      // 行双击事件
      onDblclick: () => {
        openEdit(record);
      }
    };
  };
</script>

<script lang="ts">
  export default {
    name: 'VideoIndex'
  };
</script>
