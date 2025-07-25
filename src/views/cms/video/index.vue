<template>
  <a-page-header :title="getPageTitle()" @back="() => $router.go(-1)">
    <template #extra>
      <Extra />
    </template>
    <a-card :bordered="false">
      <!-- 表格 -->
      <ele-pro-table
        ref="tableRef"
        row-key="id"
        :columns="columns"
        :datasource="datasource"
        v-model:selection="selection"
        :scroll="{ x: 800 }"
        cache-key="proCmsVideoTable"
      >
        <template #toolbar>
          <a-space>
            <a-upload
              :show-upload-list="false"
              :accept="'video/*'"
              :customRequest="onUpload"
            >
              <a-button type="primary" class="ele-btn-icon">
                <template #icon>
                  <UploadOutlined/>
                </template>
                <span>上传视频</span>
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
                <delete-outlined/>
              </template>
              <span>删除</span>
            </a-button>
            <a-input-search
              allow-clear
              v-model:value="searchText"
              placeholder="请输入关键词"
              @search="reload"
              @pressEnter="reload"
            >
              <template #addonBefore>
                <a-select
                  v-model:value="type"
                  style="width: 100px; margin: -5px -12px"
                >
                  <a-select-option value="name">文件名称</a-select-option>
                  <a-select-option value="createNickname">
                    上传人
                  </a-select-option>
                </a-select>
              </template>
            </a-input-search>
          </a-space>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'path'">
            <a :href="record.downloadUrl" target="_blank">
              <div
                class="video"
                style="
                    background-color: #000000;
                    display: flex;
                    width: 160px;
                    height: 100px;
                    justify-content: center;
                  "
              >
                <video
                  :src="`${record.path}`"
                  :width="150"
                  :height="100"
                ></video>
              </div>
            </a>
          </template>
          <template v-if="column.key === 'name'">
            <div>{{ record.name }}<copy-outlined
              style="padding-left: 4px"
              @click="copyText(record.downloadUrl)"
            /></div>
          </template>
          <template v-if="column.key === 'action'">
            <div>
              <a :href="record.downloadUrl" target="_blank">下载</a>
              <a-divider type="vertical"/>
              <a @click="openEdit(record)">修改</a>
              <a-divider type="vertical"/>
              <a-popconfirm
                placement="topRight"
                title="确定要删除此评价吗？"
                @confirm="remove(record)"
              >
                <a class="ele-text-danger">删除</a>
              </a-popconfirm>
            </div>
          </template>
        </template>
      </ele-pro-table>
    </a-card>
    <!-- 编辑弹窗 -->
    <video-edit v-model:visible="showEdit" :data="current" @done="reload"/>

  </a-page-header>
</template>

<script lang="ts" setup>
import {createVNode, ref} from 'vue';
import {message, Modal} from 'ant-design-vue/es';
import {
  UploadOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined, CopyOutlined
} from '@ant-design/icons-vue';
import type {EleProTable} from 'ele-admin-pro/es';
import type {
  DatasourceFunction,
  ColumnItem
} from 'ele-admin-pro/es/ele-pro-table/types';
import {messageLoading, toDateString} from 'ele-admin-pro/es';
import VideoEdit from './components/video-edit.vue';
import {
  pageFiles,
  removeFile,
  removeFiles,
  uploadFile, uploadOss
} from '@/api/system/file/index';
import type {
  FileRecord,
  FileRecordParam
} from '@/api/system/file/model/index';
import {FILE_SERVER} from '@/config/setting';
import {copyText, getPageTitle} from "@/utils/common";
import Extra from "@/views/cms/photo/components/Extra.vue";

// 表格实例
const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);
// 表格选中数据
const selection = ref<FileRecord[]>([]);
// 当前编辑数据
const current = ref<FileRecord | null>(null);
// 是否显示编辑弹窗
const showEdit = ref(false);
const type = ref('name');
const searchText = ref('');
// 表格列配置
const columns = ref<ColumnItem[]>([
  {
    key: 'index',
    width: 48,
    align: 'center',
    fixed: 'left',
    hideInSetting: true,
    customRender: ({index}) => index + (tableRef.value?.tableIndex ?? 0)
  },
  {
    title: '封面图',
    dataIndex: 'path',
    width: 180,
    key: 'path'
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: '描述',
    dataIndex: 'comments',
    ellipsis: true
  },
  {
    title: '文件大小',
    dataIndex: 'length',
    sorter: true,
    showSorterTooltip: false,
    ellipsis: true,
    customRender: ({text}) => {
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
    title: '发布者',
    width: 120,
    dataIndex: 'createNickname'
  },
  {
    title: '发布时间',
    dataIndex: 'createTime',
    sorter: true,
    width: 180,
    showSorterTooltip: false,
    ellipsis: true,
    customRender: ({text}) => toDateString(text)
  },
  {
    title: '操作',
    key: 'action',
    width: 200,
    align: 'center'
  }
]);

// 表格数据源
const datasource: DatasourceFunction = ({page, limit, where, orders}) => {
  where = {};
  if (type.value == 'name') {
    where.name = searchText.value;
  }
  if (type.value == 'createNickname') {
    where.createNickname = searchText.value;
  }
  where.contentType = 'video';
  return pageFiles({...where, ...orders, page, limit});
};

/* 搜索 */
const reload = (where?: FileRecordParam) => {
  selection.value = [];
  tableRef?.value?.reload({page: 1, where});
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
    content: '确定要删除选中的评价吗?',
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

// 上传文件
const onUpload = (item) => {
  const {file} = item;
  if (!file.type.startsWith('video')) {
    message.error('只能选择视频文件');
    return;
  }
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
    .then((data) => {
      hide();
      message.success('上传成功');
      reload();
    })
    .catch((e) => {
      message.error(e.message);
      hide();
    });
};
</script>

<script lang="ts">
export default {
  name: 'VideoIndex'
};
</script>
