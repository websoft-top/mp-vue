<!-- 用户导入弹窗 -->
<template>
  <ele-modal
    :width="520"
    :footer="null"
    title="文章批量导入"
    :visible="visible"
    @update:visible="updateVisible"
  >
    <a-spin :spinning="loading">
      <a-upload-dragger
        accept=".xls,.xlsx"
        :show-upload-list="false"
        :customRequest="doUpload"
        style="padding: 24px 0; margin-bottom: 16px"
      >
        <p class="ant-upload-drag-icon">
          <cloud-upload-outlined />
        </p>
        <p class="ant-upload-hint">将文件拖到此处，或点击上传</p>
      </a-upload-dragger>
    </a-spin>
    <div class="ele-text-center">
      <span>只能上传xls、xlsx文件，导入模板和导出模板格式一致</span>
    </div>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { CloudUploadOutlined } from '@ant-design/icons-vue';
  import {importArticles} from "@/api/cms/cmsArticle";

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  defineProps<{
    // 是否打开弹窗
    visible: boolean;
  }>();

  // 导入请求状态
  const loading = ref(false);

  /* 上传 */
  const doUpload = ({ file }) => {
    if (
      ![
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ].includes(file.type)
    ) {
      message.error('只能选择 excel 文件');
      return false;
    }
    if (file.size / 1024 / 1024 > 10) {
      message.error('大小不能超过 10MB');
      return false;
    }
    loading.value = true;
    importArticles(file)
      .then((msg) => {
        loading.value = false;
        message.success(msg);
        updateVisible(false);
        emit('done');
      })
      .catch((e) => {
        loading.value = false;
        message.error(e.message);
      });
    return false;
  };

  /* 更新 visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };
</script>
