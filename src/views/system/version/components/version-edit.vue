<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改版本' : '更新版本'"
    :body-style="{ paddingBottom: '8px' }"
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
      <a-form-item label="安装包" name="iosDownloadUrl">
        <a-upload :show-upload-list="false" :customRequest="onUpload">
          <a-button type="primary" class="ele-btn-icon">
            <template #icon>
              <upload-outlined />
            </template>
            <span>上传</span>
          </a-button>
        </a-upload>
      </a-form-item>
      <a-form-item label="版本名" name="versionName">
        <a-input placeholder="1.0.0" v-model:value="form.versionName" />
      </a-form-item>
      <a-form-item label="版本号" name="versionCode">
        <a-input placeholder="100" v-model:value="form.versionCode" />
      </a-form-item>
      <a-form-item label="更新日志" name="updateInfo">
        <!-- 编辑器 -->
        <byte-md-editor
          v-model:value="content"
          placeholder="请描述您的问题，支持图片粘贴"
          :locale="zh_Hans"
          :plugins="plugins"
          mode="tab"
          height="300px"
          maxLength="500"
          :editorConfig="{ lineNumbers: true }"
          @paste="onPaste"
        />
<!--        <a-textarea-->
<!--          :rows="4"-->
<!--          :maxlength="200"-->
<!--          placeholder="请输入更新日志"-->
<!--          v-model:value="form.updateInfo"-->
<!--        />-->
      </a-form-item>
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
  import { UploadOutlined } from '@ant-design/icons-vue';
  import { messageLoading } from 'ele-admin-pro';
  import { Version } from '@/api/system/version/model';
  import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
  import { addVersion, updateVersion } from '@/api/system/version';
  // 中文语言文件
  import zh_Hans from 'bytemd/locales/zh_Hans.json';
  import zh_HansGfm from "@bytemd/plugin-gfm/locales/zh_Hans.json";
  import highlight from "@bytemd/plugin-highlight";
  import gfm from "@bytemd/plugin-gfm";
  import { uploadOss } from "@/api/system/file";

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
    data?: Version | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  const content = ref('');

  const files = ref<ItemType[]>([]);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Version>({
    id: undefined,
    versionName: '',
    versionCode: '',
    updateInfo: '',
    iosDownloadUrl: '',
    androidDownloadUrl: '',
    vueDownloadUrl: '',
    comments: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    iosDownloadUrl: [
      {
        required: true,
        message: '请上传安装包',
        type: 'string',
        trigger: 'blur'
      }
    ],
    versionName: [
      {
        required: true,
        message: '请输入版本名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    versionCode: [
      {
        required: true,
        message: '请输入版本名',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  // 插件
  const plugins = ref([
    gfm({
      locale: zh_HansGfm
    }),
    highlight()
  ]);

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const saveOrUpdate = isUpdate.value ? updateVersion : addVersion;
        console.log(form);
        const data = {
          ...form,
          updateInfo: content.value
        };
        saveOrUpdate(data)
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

  /* 上传 */
  const onUpload = ({ file }) => {
    if (file.size / 1024 / 1024 > 100) {
      message.error('大小不能超过 100MB');
      return false;
    }
    const hide = messageLoading({
      content: '上传中..',
      duration: 0,
      mask: true
    });
    uploadOss(file)
      .then((res) => {
        console.log(res);
        hide();
        form.androidDownloadUrl = res.downloadUrl;
        form.iosDownloadUrl = res.downloadUrl;
        form.vueDownloadUrl = res.downloadUrl;
        message.success('上传成功');
      })
      .catch((e) => {
        hide();
        message.error(e.message);
      });
    return false;
  };

  /* 粘贴图片上传服务器并插入编辑器 */
  const onPaste = (e) => {
    const items = (e.clipboardData || e.originalEvent.clipboardData).items;
    let hasFile = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        let file = items[i].getAsFile();
        const item: ItemType = {
          file,
          uid: (file as any).lastModified,
          name: file.name
        };
        uploadOss(<File>item.file)
          .then((result) => {
            const addPath = '!['+result.name+']('+ result.url+')\n\r';
            content.value = content.value + addPath
          })
          .catch((e) => {
            message.error(e.message);
          });
        hasFile = true;
      }
    }
    if (hasFile) {
      e.preventDefault();
    }
  }

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          assignFields(props.data);
          if(props.data.updateInfo){
            content.value = props.data.updateInfo;
          }
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
