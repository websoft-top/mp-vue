<template>
  <ele-modal
    width="75%"
    :visible="visible"
    :maskClosable="false"
    :title="title"
    :footer="null"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
  >
    <ele-pro-table
      ref="tableRef"
      row-key="id"
      :datasource="datasource"
      :columns="columns"
      :customRow="customRow"
      :pagination="false"
    >
      <template #toolbar>
        <div class="ele-cell">
          <div class="ele-cell-content">
            <a-space>
              <a-upload
                v-if="type == 'video'"
                :show-upload-list="false"
                :accept="'video/*'"
                :customRequest="onUpload"
              >
                <a-button type="primary" class="ele-btn-icon">
                  <template #icon>
                    <UploadOutlined />
                  </template>
                  <span>上传视频</span>
                </a-button>
              </a-upload>
              <a-upload
                v-else
                :show-upload-list="false"
                :accept="'image/*,application/*'"
                :customRequest="onUpload"
              >
                <a-button type="primary" class="ele-btn-icon">
                  <template #icon>
                    <UploadOutlined />
                  </template>
                  <span>上传图片</span>
                </a-button>
              </a-upload>
              <a-select
                show-search
                allow-clear
                v-model:value="dictDataId"
                optionFilterProp="label"
                :options="groupList"
                style="margin-left: 20px; width: 200px"
                placeholder="请选择分组"
                @select="onGroupId"
              />
              <a-input-search
                allow-clear
                v-model:value="searchText"
                placeholder="请输入搜索关键词"
                style="width: 240px"
                @search="reload"
                @pressEnter="reload"
              />
              <a-button
                type="text"
                @click="openUrl('/cms/photo/dict')"
              >管理分组</a-button
              >
              <a-alert
                message="双击行也可以选择"
                banner
                closable
              />
            </a-space>
          </div>

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
              :src="`${record.path}`"
              :preview="{
                src: `${record.downloadUrl}`
              }"
              :width="100"
            />
          </template>
          <!-- path -->
          <template v-else>
            <a-image
              :src="`https://oss.wsdns.cn/${record.path}`"
              :width="120"
            />
          </template>
        </template>
        <template v-if="column.dataIndex === 'name'">
          <a-space class="ele-cell" style="display: flex">
            <span>{{ record.name }}</span>
            <EditOutlined title="编辑" @click="openEdit(record)" />
          </a-space>
        </template>
        <template v-if="column.key === 'action'">
          <template v-if="pageId == record.pageId">
            <a-radio v-model:checked="checked" @click="onRadio(record)" />
          </template>
          <template v-else>
            <a-space>
<!--              <a-radio @click="onRadio(record)" />-->
              <a class="ele-text-success" @click="onRadio(record)">选择</a>
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
      </template>
    </ele-pro-table>
  </ele-modal>
  <!-- 编辑弹窗 -->
  <FileRecordEdit v-model:visible="showEdit" :data="current" @done="reload" />
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import {
    ColumnItem,
    DatasourceFunction
  } from 'ele-admin-pro/es/ele-pro-table/types';
  import {pageFiles, removeFile, uploadOss, uploadOssByGroupId} from '@/api/system/file';
  import { EleProTable, messageLoading } from 'ele-admin-pro';
  import { FileRecord, FileRecordParam } from '@/api/system/file/model';
  import { EditOutlined, UploadOutlined } from '@ant-design/icons-vue';
  import { DictData } from '@/api/system/dict-data/model';
  import { pageDictData } from '@/api/system/dict-data';
  import {isImage, isMobileDevice, openUrl} from '@/utils/common';
  import { message } from 'ant-design-vue/es';
  import FileRecordEdit from './file-record-edit.vue';

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 标题
    title?: string;
    // 文件类型
    type?: string;
    // 修改回显的数据
    data?: FileRecord | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', data: FileRecord): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 搜索内容
  const searchText = ref(null);
  const pageId = ref<number>(0);
  const checked = ref<boolean>(true);
  const groupList = ref<DictData[]>();
  const showEdit = ref<boolean>(false);
  const current = ref<FileRecord | null>();
  const dictDataId = ref<any>(undefined);

  // 表格实例
  const tableRef = ref<InstanceType<typeof EleProTable> | null>(null);

  // 表格配置
  const columns = ref<ColumnItem[]>([
    {
      title: 'ID',
      dataIndex: 'id'
    },
    {
      title: '文件',
      dataIndex: 'path',
      key: 'path'
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '大小',
      dataIndex: 'length',
      key: 'length',
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
      }
    },
    {
      title: '操作',
      key: 'action',
      align: 'center'
    }
  ]);

  // 表格数据源
  const datasource: DatasourceFunction = ({ page, limit, where, orders }) => {
    where = {};
    // 搜索条件
    if (searchText.value) {
      where.name = searchText.value;
    }
    if (dictDataId.value) {
      where.groupId = dictDataId.value;
    }
    if(props.type == 'video'){
      where.contentType = props.type;
    }
    if(props.type == 'image'){
      where.contentType = props.type;
    }
    return pageFiles({
      ...where,
      ...orders,
      page,
      limit
    });
  };

  /* 搜索 */
  const reload = (where?: FileRecordParam) => {
    tableRef?.value?.reload({ page: 1, where });
  };

  const onRadio = (record: FileRecord) => {
    pageId.value = Number(record.id);
    updateVisible(false);
    emit('done', record);
  };

  const getGroupList = () => {
    pageDictData({ dictCode: 'groupId' }).then((res) => {
      groupList.value = res?.list.map((d) => {
        return {
          label: d.dictDataName,
          value: d.dictDataId
        };
      });
    });
  };

  const onGroupId = (index: number) => {
    dictDataId.value = index;
    reload();
  };

  // 上传文件
  const onUpload = (item) => {
    const { file } = item;
    if (!file.type.startsWith('image') && props.type != 'video') {
      message.error('只能选择图片');
      return;
    }
    if (props.type == 'video') {
      if (file.size / 1024 / 1024 > 100) {
        message.error('大小不能超过 100MB');
        return;
      }
    } else {
      if (file.size / 1024 / 1024 > 10) {
        message.error('大小不能超过 10MB');
        return;
      }
    }
    const hide = messageLoading({
      content: '上传中..',
      duration: 0,
      mask: true
    });
    if (dictDataId.value > 0) {
      uploadOssByGroupId(file, dictDataId.value)
        .then(() => {
          hide();
          message.success('上传成功');
          reload();
        })
        .catch((e) => {
          message.error(e.message);
          hide();
        });
    } else {
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
    }
  };

  const openEdit = (row?: FileRecord) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  /* 删除单个 */
  const remove = (row: FileRecord) => {
    const hide = message.loading('请求中..', 0);
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


  /* 自定义行属性 */
  const customRow = (record: FileRecord) => {
    return {
      // 行点击事件
      // onClick: () => {
      //   updateVisible(false);
      //   emit('done', record);
      // },
      // 行双击事件
      onDblclick: () => {
        updateVisible(false);
        if(!isMobileDevice()){
          record.path = record.url || record.downloadUrl;
        }
        console.log(record,'rec......')
        emit('done', record);
      }
    };
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        getGroupList();
        reload();
      }
    },
    { immediate: true }
  );
</script>
