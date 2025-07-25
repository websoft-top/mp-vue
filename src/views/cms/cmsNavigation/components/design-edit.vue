<!-- 编辑弹窗 -->
<template>
  <a-drawer
      :width="1000"
      :visible="visible"
      :maskClosable="false"
      :maxable="true"
      title="页面内容"
      placement="right"
      :confirm-loading="loading"
      :body-style="{ paddingBottom: '28px' }"
      @update:visible="updateVisible"
      @ok="save"
    >
    <template #extra>
      <a-button type="primary" style="margin-right: 8px" @click="save">保存</a-button>
    </template>
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        :label-col="styleResponsive ? { md: 2, sm: 5, xs: 24 } : { flex: '90px' }"
        :wrapper-col="
        styleResponsive ? { md: 21, sm: 19, xs: 24 } : { flex: '1' }
      "
      >
        <a-form-item label="SEO">
          <a-space direction="vertical"
                   class="w-full">
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="Title"
              v-model:value="form.name"
            />
            <a-input
              allow-clear
              :maxlength="100"
              placeholder="Keywords"
              v-model:value="form.keywords"
            />
            <a-textarea
              :rows="4"
              :maxlength="200"
              placeholder="Description"
              v-model:value="form.description"
            />
          </a-space>
        </a-form-item>
        <a-form-item label="Banner">
          <a-space direction="vertical" class="w-full">
            <div class="p-1">
              <a-switch v-model:checked="form.showBanner"/>
            </div>
            <template v-if="form.showBanner">
              <SelectFile
                :placeholder="`请选择背景图`"
                :limit="1"
                :data="images"
                @done="chooseFile"
                @del="onDeleteItem"
              />
<!--              <div class="text-sm text-gray-400">页面Banner的读取优先级为：栏目 > 父栏目 > 模型</div>-->
              <a-textarea
                :rows="4"
                :maxlength="200"
                placeholder="CSS样式"
                v-model:value="form.style"
              />
              <a class="text-sm text-gray-400" href="https://www.tailwindcss.cn/docs/installation" target="_blank">Tailwind Css使用教程</a>
            </template>
          </a-space>
        </a-form-item>
        <a-form-item label="Button">
          <div class="p-1 mb-3">
            <a-switch v-model:checked="form.showButton"/>
          </div>
          <template v-if="form.showButton">
            <a-space direction="vertical" class="w-full">
              <template v-if="form.showButton">
                <a-input
                  allow-clear
                  :maxlength="100"
                  :placeholder="`立即购买`"
                  v-model:value="form.buyUrl"
                />
                <a-input
                  allow-clear
                  :maxlength="100"
                  :placeholder="`产品文档`"
                  v-model:value="form.docUrl"
                />
                <a-input
                  allow-clear
                  :maxlength="100"
                  :placeholder="`演示地址`"
                  v-model:value="form.demoUrl"
                />
                <a-input
                  allow-clear
                  :maxlength="100"
                  :placeholder="`账号密码`"
                  v-model:value="form.account"
                />
              </template>
            </a-space>
          </template>
        </a-form-item>
        <a-form-item label="页面内容" name="content">
          <!-- 编辑器 -->
          <div class="content">
            <tinymce-editor
              v-model:value="content"
              :disabled="disabled"
              :init="config"
              placeholder="图片直接粘贴自动上传"
              @paste="onPaste"
            />
          </div>
          <div class="py-3 flex text-gray-400" v-if="lang == 'zh_CN'">
            <a-switch checked-children="AI翻译" v-model:checked="form.translation"/>
            <div class="pl-3" v-if="form.translation">启用后，将自动翻译其他语言版本</div>
          </div>
        </a-form-item>
      </a-form>
  </a-drawer>
</template>

<script lang="ts" setup>
import { ref, reactive, watch } from 'vue';
import { message } from 'ant-design-vue';
import { uuid} from 'ele-admin-pro';
import { addCmsDesign, pageCmsDesign, updateCmsDesign } from "@/api/cms/cmsDesign";
import { CmsDesign } from '@/api/cms/cmsDesign/model';
import { useThemeStore } from '@/store/modules/theme';
import { storeToRefs } from 'pinia';
import { FormInstance, Rule } from 'ant-design-vue/es/form';
import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
import {uploadFile, uploadOss} from '@/api/system/file';
import TinymceEditor from "@/components/TinymceEditor/index.vue";
import useFormData from "@/utils/use-form-data";
import {removeSiteInfoCache} from "@/api/cms/cmsWebsite";
import {FileRecord} from "@/api/system/file/model";
import {getLang, openSpmUrl} from "@/utils/common";

// 是否是修改
const isUpdate = ref(false);
// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
const disabled = ref(false);
// 编辑器内容，双向绑定
const content = ref<any>('');
// 组件列表
const components = ref<any[]>();

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsDesign | null;
  //
  categoryId?: number;
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 已上传数据
const images = ref<ItemType[]>([]);
const lang = localStorage.getItem('i18n-lang');
// 表格选中数据
const formRef = ref<FormInstance | null>(null);

// 表单数据
const { form, resetFields, assignFields } = useFormData<CmsDesign>({
  pageId: undefined,
  name: '',
  images: '',
  path: '',
  component: '/pages/[page]/index',
  description: '',
  keywords: '',
  content: '',
  type: '',
  categoryId: undefined,
  style: '',
  status: 0,
  comments: '',
  sortNumber: 100,
  navigationId: undefined,
  showLayout: false,
  translation: true,
  layout: '',
  btn: [],
  showBanner: true,
  showButton: false,
  buyUrl: '',
  demoUrl: '',
  account: '',
  docUrl: ''
});

const editorRef = ref<InstanceType<typeof TinymceEditor> | null>(null);
const config = ref({
  height: 500,
  images_upload_handler: (blobInfo, success, error) => {
    const file = blobInfo.blob();
    const formData = new FormData();
    formData.append('file', file, file.name);
    uploadOss(file).then(res => {
      success(res.url)
    }).catch((msg) => {
      error(msg);
    })
    return false;
  },
  // 自定义文件上传(这里使用把选择的文件转成 blob 演示)
  file_picker_callback: (callback: any, _value: any, meta: any) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    // 设定文件可选类型
    if (meta.filetype === 'image') {
      input.setAttribute('accept', 'image/*');
    } else if (meta.filetype === 'media') {
      input.setAttribute('accept', 'video/*,.pdf');
    }
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) {
        return;
      }
      if (meta.filetype === 'media') {
        if (file.size / 1024 / 1024 > 200) {
          editorRef.value?.alert({ content: '大小不能超过 200MB' });
          return;
        }
        if (!file.type.startsWith('video/')) {
          editorRef.value?.alert({ content: '只能选择视频文件' });
          return;
        }
        uploadOss(file).then(res => {
          callback(res.downloadUrl);
        })
      }
    };
    input.click();
  }
});

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
      uploadFile(<File>item.file)
        .then((result) => {
          const addPath = `<p><img class="content-img" src="${result.url}"></p>`;
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

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      type: 'string',
      message: '请填写页面名称',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      type: 'string',
      message: '请填写路由地址',
      trigger: 'blur'
    }
  ],
  component: [
    {
      required: true,
      type: 'string',
      message: '请填写组件路径',
      trigger: 'blur'
    }
  ]
});

/* 上传事件 */
const uploadHandler = (file: File) => {
  const item: ItemType = {
    file,
    uid: (file as any).uid,
    name: file.name
  };
  if (file.type.startsWith('video')) {
    if (file.size / 1024 / 1024 > 200) {
      message.error('大小不能超过 200MB');
      return;
    }
  }
  if (file.type.startsWith('image')) {
    if (file.size / 1024 / 1024 > 5) {
      message.error('大小不能超过 5MB');
      return;
    }
  }

  onUpload(item);
};

// 上传文件
const onUpload = (item: any) => {
  const { file } = item;
  uploadFile(file)
    .then((data) => {
      form.photo = data.path;
      images.value.push({
        uid: data.id,
        url:
          file.type == 'video/mp4'
            ? 'https://oss.wsdns.cn/20240301/6e4e32cb808245d4be336b9486961145.png'
            : data.path,
        status: 'done'
      });
    })
    .catch((e) => {
      message.error(e.message);
    });
};

const chooseFile = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.downloadUrl,
    status: 'done'
  });
  form.photo = data.downloadUrl;
}

const onDeleteItem = (index: number) => {
  images.value.splice(index,1)
  form.photo = '';
}

const addComponents = () => {
  if(!components.value){
    components.value = [];
  }
  components.value?.push({
    type: 'card',
    name: '组件名称',
    css: '',
    data: []
  })
}

const options = [{
  value: 'primary',
  label: 'primary',
},{
  value: 'success',
  label: 'success',
},{
  value: 'warning',
  label: 'warning',
},{
  value: 'danger',
  label: 'danger',
},{
  value: 'info',
  label: 'info',
},{
  value: 'text',
  label: 'text',
}];

const delBtn = (index: number) => {
  form.btn?.splice(index,1)
}

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      console.log(form);
      const formData = {
        ...form,
        categoryId: props.categoryId,
        content: content.value,
      };
      console.log(formData,'formDDDD');
      const saveOrUpdate = isUpdate.value ? updateCmsDesign : addCmsDesign;
      saveOrUpdate(formData)
        .then((msg) => {
          loading.value = false;
          message.success(msg);
          updateVisible(false);
          // 清除缓存
          removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          message.error(e.message);
        });
    })
    .catch(() => {});
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      // 查询页面设计元素
      if(props.categoryId){
        content.value = '';
        images.value = []
        pageCmsDesign({categoryId: props.categoryId,limit: 1}).then(res => {
          const design = res?.list[0];
          if(design){
            assignFields(design);
            if(design?.content){
              content.value = design.content
            }
            if(design.photo){
              form.photo = design.photo;
              images.value.push({
                uid: uuid(),
                url: design.photo,
                status: 'done'
              })
            }
            isUpdate.value = true;
          }else {
            isUpdate.value = false;
            content.value = '';
            resetFields();
          }
        })
      }
    } else {
      resetFields();
      formRef.value?.clearValidate();
    }

  },
  { immediate: true }
);
</script>
