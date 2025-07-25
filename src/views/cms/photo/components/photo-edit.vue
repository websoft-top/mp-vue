<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    :width="600"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑' : '上传文件'"
    :body-style="{ paddingBottom: '8px' }"
    okText="保存"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 5, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="上传文件" name="fileName" v-if="!isUpdate">
        <span
          class="ele-text-success"
          v-if="fileName"
          style="margin-right: 10px"
        >
          {{ fileName }}
        </span>
        <a-upload
          :show-upload-list="false"
          :accept="'video/*'"
          v-if="!fileName"
          :customRequest="onUpload"
        >
          <a-button type="primary" class="ele-btn-icon">
            <template #icon>
              <UploadOutlined />
            </template>
            <span>上传文件</span>
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="设置分组" name="name">
        <DictSelect
          dict-code="groupId"
          :width="200"
          :show-search="true"
          placeholder="按分组筛选"
          v-model:value="form.groupId"
          @done="chooseGroupId"
        />
      </a-form-item>
      <a-form-item label="文件名称" name="name">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入文件名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="描述" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="图片描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <div style="margin-bottom: 22px">
        <a-divider orientation="left">图片分享</a-divider>
      </div>
      <a-form-item label="图片URL链接">
        <a-input v-model:value="share.url" @click="copyText(share.url)" />
      </a-form-item>
      <a-form-item label="网页代码(HTML)">
        <a-input v-model:value="share.html" @click="copyText(share.html)" />
      </a-form-item>
      <a-form-item label="Markdown">
        <a-input
          v-model:value="share.Markdown"
          @click="copyText(share.Markdown)"
        />
      </a-form-item>
      <a-form-item label="论坛BBCode">
        <a-input v-model:value="share.bbCode" @click="copyText(share.bbCode)" />
      </a-form-item>

      <!--      <a-form-item label="封面图" name="images">-->
      <!--        <ele-image-upload-->
      <!--          v-model:value="images"-->
      <!--          :limit="1"-->
      <!--          :drag="true"-->
      <!--          :item-style="{ width: '60px', height: '60px' }"-->
      <!--          :accept="'image/*'"-->
      <!--          :upload-handler="uploadHandler"-->
      <!--          @upload="onUpload"-->
      <!--        />-->
      <!--      </a-form-item>-->
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { FileRecord } from '@/api/system/file/model';
  import { messageLoading } from 'ele-admin-pro';
  import { addFiles, updateFiles, uploadFile } from '@/api/system/file';
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { RuleObject } from 'ant-design-vue/es/form';
  import { copyText } from '@/utils/common';
  import { DictData } from '@/api/system/dict-data/model';
  import DictSelect from "@/components/DictSelect/index.vue";

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: FileRecord | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);
  const fileName = ref('');
  // 是否是修改
  const isUpdate = ref(false);
  // 提交状态
  const loading = ref(false);
  // 图片资源分享
  const share = ref({
    url: '',
    Markdown: '',
    html: '',
    bbCode: ''
  });

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<FileRecord>({
    id: 0,
    name: '',
    comments: '',
    groupId: undefined,
    groupName: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    fileName: [
      {
        required: true,
        message: '请上传文件',
        type: 'string',
        trigger: 'blur',
        validator: async (_rule: RuleObject) => {
          if (!isUpdate.value && fileName.value.length == 0) {
            return Promise.reject('请上传文件');
          }
          return Promise.resolve();
        }
      }
    ],
    name: [
      {
        required: true,
        message: '请输入文件名称',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  // 上传文件
  const onUpload = (item) => {
    const { file } = item;
    if (!file.type.startsWith('video')) {
      message.error('文件格式不正确！');
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
    uploadFile(file)
      .then((data) => {
        hide();
        fileName.value = String(data.name);
        // images.value.push({
        //   uid: data.id,
        //   url: FILE_THUMBNAIL + data.path,
        //   status: 'done'
        // });
        message.success('上传成功');
      })
      .catch((e) => {
        message.error(e.message);
        hide();
      });
  };

  const chooseGroupId = (item: DictData) => {
    form.groupId = item.dictDataId;
    form.groupName = item.dictDataName;
    console.log(form,'>>>>>>>last')
  };

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const saveOrUpdate = isUpdate.value ? updateFiles : addFiles;
        saveOrUpdate(form)
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
      })
      .catch(() => {});
  };

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          assignFields(props.data);
          // 图片分享代码
          share.value.url = `${props.data.path}`;
          share.value.html = `<a href="${props.data.path}"><img src="${props.data.path}" alt="${props.data.name}" border="0" /></a>`;
          share.value.Markdown = `[![${props.data.name}](${props.data.path})](${props.data.path})`;
          share.value.bbCode = `[url=${props.data.path}][img]${props.data.path}[/img][/url]`;
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
