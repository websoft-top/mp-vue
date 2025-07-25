<!-- 文件上传组件 -->
<template>
  <a-upload
    :accept="accept"
    :maxCount="maxCount"
    :showUploadList="showUploadList"
    :customRequest="onUpload"
    :before-upload="beforeUpload"
    @remove="handleRemove"
    :file-list="fileList"
  >
    <a-button class="ele-btn-icon">
      <template #icon>
        <UploadOutlined />
      </template>
      <span>{{ buttonText }}</span>
    </a-button>
  </a-upload>
</template>

<script lang="ts" setup>
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { message, UploadProps } from 'ant-design-vue';
  import { uploadFile, uploadOss } from '@/api/system/file';
  import { messageLoading } from 'ele-admin-pro';
  import { ref, watch } from 'vue';
  import { uploadAliOss } from '@/utils/oss';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  const props = withDefaults(
    defineProps<{
      value?: string;
      limit?: number;
      maxCount?: number | 1;
      accept?: string;
      placeholder?: string;
      buttonText?: string;
      showUploadList?: boolean;
    }>(),
    {
      placeholder: '请选择上传文件',
      buttonText: '上传文件',
      showUploadList: false
    }
  );

  // 已上传数据
  // const images = ref<ItemType[]>([]);
  //
  // const onChange = (type) => {
  //   console.log(type, '>>>>>');
  // };

  const fileList = ref<UploadProps['fileList']>([]);
  const uploading = ref<boolean>(false);
  const beforeUpload: UploadProps['beforeUpload'] = (file) => {
    // fileList.value = [...fileList.value, file];
    if (file.size / 1024 / 1024 > 1000) {
      message.error('大小不能超过 1000MB');
      return;
    }

    if (fileList.value.length >= 1) {
      message.error('不支持多文件');
      return;
    }
    const hide = messageLoading({
      content: '上传中..',
      duration: 0,
      mask: true
    });

    if (Number(localStorage.getItem('TenantId')) == 10058) {
      uploadAliOss(file)
        .then((res) => {
          hide();
          emit('update:value', String(res.url));
          message.success('上传成功');
        })
        .catch((e) => {
          hide();
          message.error(e.message);
        });
    } else {
      uploadOss(file)
        .then((data) => {
          hide();
          console.log(data, '上传文件成功！');

          emit('update:value', String(data.path));
          message.success('上传成功');
        })
        .catch((e) => {
          message.error(e.message);
          hide();
        });
    }

    return false;
  };

  const handleRemove: UploadProps['onRemove'] = (file) => {
    const index = fileList.value.indexOf(file);
    const newFileList = fileList.value.slice();
    newFileList.splice(index, 1);
    fileList.value = newFileList;
    emit('update:value', null);
  };
  // 上传文件
  const onUpload = (item) => {
    const { file } = item;
  };

  watch(
    () => props.value,
    (newVal, oldValue) => {
      if (newVal) {
        fileList.value.push({
          uid: newVal,
          url: newVal,
          name: newVal,
          status: 'done'
        });
      }
    },
    { immediate: true }
  );

  // /* 更新选中数据 */
  // const updateValue = (value: string) => {
  //   console.log(value, '更新选中数据');
  //   emit('update:value', value + '更新选中数据');
  // };
  /* 失去焦点 */
  // const onBlur = () => {
  //   emit('blur');
  // };
</script>
