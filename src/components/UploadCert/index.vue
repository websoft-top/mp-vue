<!-- 文件上传组件 -->
<template>
  <a-upload
    :accept="accept"
    :maxCount="maxCount"
    :showUploadList="showUploadList"
    :customRequest="onUpload"
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
  import { message } from 'ant-design-vue';
  import { uploadCert } from '@/api/system/file';
  import { messageLoading } from 'ele-admin-pro';

  const emit = defineEmits<{
    (e: 'update:value', value: string): void;
    (e: 'blur'): void;
  }>();

  withDefaults(
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
    uploadCert(file)
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
  };

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
