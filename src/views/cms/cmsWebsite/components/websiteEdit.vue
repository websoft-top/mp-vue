<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑小程序' : '创建小程序'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    :confirm-loading="loading"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 4, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="LOGO" name="avatar">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="小程序名称" name="websiteName">
        <a-input
          allow-clear
          placeholder="请输入小程序名称"
          v-model:value="form.websiteName"
        />
      </a-form-item>
      <a-form-item label="网站域名" name="domain" v-if="form.type  == 10">
        <a-input
          v-model:value="form.domain"
          placeholder="huawei.com"
        >
          <template #addonBefore>
            <a-select v-model:value="form.prefix" style="width: 90px">
              <a-select-option value="http://">http://</a-select-option>
              <a-select-option value="https://">https://</a-select-option>
            </a-select>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="AppId" name="websiteCode" v-if="form.type  == 20">
        <a-input
          allow-clear
          placeholder="请输入AppId"
          v-model:value="form.websiteCode"
        />
      </a-form-item>
      <a-form-item label="小程序描述" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入小程序描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="账号类型" name="type">
        {{ form.websiteType }}
      </a-form-item>
      <a-form-item label="小程序码" name="avatar">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="websiteQrcode"
          @done="chooseQrcode"
          @del="onDeleteQrcode"
        />
      </a-form-item>
      <!--      <a-form-item label="SEO关键词" name="keywords">-->
      <!--        <a-textarea-->
      <!--          :rows="4"-->
      <!--          :maxlength="200"-->
      <!--          placeholder="请输入SEO关键词"-->
      <!--          v-model:value="form.keywords"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="全局样式" name="style">-->
      <!--        <a-textarea-->
      <!--          :rows="4"-->
      <!--          :maxlength="200"-->
      <!--          placeholder="全局样式"-->
      <!--          v-model:value="form.style"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="小程序类型" name="websiteType">-->
      <!--        <a-select-->
      <!--          :options="websiteType"-->
      <!--          :value="form.websiteType"-->
      <!--          placeholder="请选择主体类型"-->
      <!--          @change="onCmsWebsiteType"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="当前版本" name="version">-->
      <!--        <a-tag color="red" v-if="form.version === 10">标准版</a-tag>-->
      <!--        <a-tag color="green" v-if="form.version === 20">专业版</a-tag>-->
      <!--        <a-tag color="cyan" v-if="form.version === 30">永久授权</a-tag>-->
      <!--      </a-form-item>-->
      <a-form-item label="状态" name="running">
        <a-radio-group
          v-model:value="form.running"
          :disabled="form.running == 4 || form.running == 5"
        >
          <a-radio :value="1">运行中</a-radio>
          <a-radio :value="2">维护中</a-radio>
          <a-radio :value="3">已关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="form.running == 2" label="维护说明" name="statusText">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="状态说明"
          v-model:value="form.statusText"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addCmsWebsite, updateCmsWebsite} from '@/api/cms/cmsWebsite';
import {CmsWebsite} from '@/api/cms/cmsWebsite/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance} from 'ant-design-vue/es/form';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FileRecord} from '@/api/system/file/model';
import {updateCmsDomain} from '@/api/cms/cmsDomain';
import {updateTenant} from "@/api/system/tenant";

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 修改回显的数据
  data?: CmsWebsite | null;
}>();

const emit = defineEmits<{
  (e: 'done'): void;
  (e: 'update:visible', visible: boolean): void;
}>();

// 提交状态
const loading = ref(false);
// 是否显示最大化切换按钮
const maxable = ref(true);
// 表格选中数据
const formRef = ref<FormInstance | null>(null);
const images = ref<ItemType[]>([]);
const websiteQrcode = ref<ItemType[]>([]);
const oldDomain = ref();
const files = ref<ItemType[]>([]);

// 用户信息
const form = reactive<CmsWebsite>({
  websiteId: undefined,
  websiteLogo: undefined,
  websiteName: undefined,
  websiteCode: undefined,
  type: 20,
  files: undefined,
  keywords: '',
  prefix: '',
  domain: '',
  adminUrl: '',
  style: '',
  icpNo: undefined,
  email: undefined,
  version: undefined,
  websiteType: '',
  running: 1,
  expirationTime: undefined,
  sortNumber: undefined,
  comments: undefined,
  status: undefined,
  statusText: undefined
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  comments: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序描述',
      trigger: 'blur'
    }
  ],
  keywords: [
    {
      required: true,
      type: 'string',
      message: '请填写SEO关键词',
      trigger: 'blur'
    }
  ],
  running: [
    {
      required: true,
      type: 'number',
      message: '请选择小程序状态',
      trigger: 'change'
    }
  ],
  domain: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序域名',
      trigger: 'blur'
    }
  ],
  websiteCode: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序码',
      trigger: 'blur'
    }
  ],
  adminUrl: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序后台管理地址',
      trigger: 'blur'
    }
  ],
  icpNo: [
    {
      required: true,
      type: 'string',
      message: '请填写ICP备案号',
      trigger: 'blur'
    }
  ],
  appSecret: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序秘钥',
      trigger: 'blur'
    }
  ],
  websiteName: [
    {
      required: true,
      type: 'string',
      message: '请填写小程序信息名称',
      trigger: 'blur'
    }
  ]
});

const chooseImage = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.websiteLogo = data.downloadUrl;
};

const chooseQrcode = (data: FileRecord) => {
  websiteQrcode.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.websiteDarkLogo = data.downloadUrl;
}


const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.websiteLogo = '';
};

const onDeleteQrcode = (index: number) => {
  websiteQrcode.value.splice(index, 1);
  form.websiteDarkLogo = '';
};

const {resetFields} = useForm(form, rules);

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateCmsWebsite : addCmsWebsite;
      if (!isUpdate.value) {
        updateVisible(false);
        message.loading('创建过程中请勿刷新页面！', 0)
      }
      const formData = {
        ...form,
        type: 20,
        adminUrl: `mp.websoft.top`,
        files: JSON.stringify(files.value),
      };
      saveOrUpdate(formData)
        .then((msg) => {
          loading.value = false;
          updateVisible(false);
          updateCmsDomain({
            websiteId: form.websiteId,
            domain: `${localStorage.getItem('TenantId')}.shoplnk.cn`
          });
          updateTenant({
            tenantName: `${form.websiteName}`
          }).then(() => {
          })
          localStorage.setItem('Domain', `${form.websiteCode}.shoplnk.cn`);
          localStorage.setItem('WebsiteId', `${form.websiteId}`);
          localStorage.setItem('WebsiteName', `${form.websiteName}`);
          message.destroy();
          message.success(msg);
          // window.location.reload();
          emit('done');
        })
        .catch((e) => {
          loading.value = false;
          message.destroy();
          message.error(e.message);
        });
    })
    .catch(() => {
    });
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      images.value = [];
      files.value = [];
      websiteQrcode.value = [];
      if (props.data?.websiteId) {
        assignObject(form, props.data);
        if (props.data.websiteLogo) {
          images.value.push({
            uid: uuid(),
            url: props.data.websiteLogo,
            status: 'done'
          });
        }
        if (props.data.websiteDarkLogo) {
          websiteQrcode.value.push({
            uid: uuid(),
            url: props.data.websiteDarkLogo,
            status: 'done'
          });
        }
        if (props.data.files) {
          files.value = JSON.parse(props.data.files);
        }
        if (props.data.websiteCode) {
          oldDomain.value = props.data.websiteCode;
        }
        isUpdate.value = true;
      } else {
        isUpdate.value = false;
      }
    } else {
      resetFields();
    }
  },
  {immediate: true}
);
</script>
