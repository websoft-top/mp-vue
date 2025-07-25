<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="小程序 AppID" name="appId" extra="登录小程序平台，开发 - 开发管理 - 开发设置，记录AppID(小程序ID)">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入小程序AppID"
          v-model:value="form.appId"
        />
      </a-form-item>
      <a-form-item label="小程序 AppSecret" name="appSecret" extra="登录小程序平台，开发 - 开发管理 - 开发设置，记录AppSecret(小程序密钥)">
        <a-input-password
          :maxlength="50"
          placeholder="请输入小程序AppSecret"
          v-model:value="form.appSecret"
        />
      </a-form-item>
      <div style="margin-bottom: 22px; width: 750px;">
        <a-divider>授权域名设置</a-divider>
      </div>
      <a-form-item label="request合法域名" name="request">
        <a-input-group compact>
          <a-input :value="`https://server.gxwebsoft.com;https://cms-api.websoft.top;`" placeholder="请输入小程序AppSecret" style="width: calc(100% - 50px)" />
          <a-tooltip title="复制">
            <a-button @click="onCopyText(`https://server.gxwebsoft.com;https://cms-api.websoft.top;`)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>
      </a-form-item>
      <a-form-item label="socket合法域名" name="socket">
        <a-input-group compact>
          <a-input :value="`wss://server.gxwebsoft.com`" placeholder="请输入小程序AppSecret" style="width: calc(100% - 50px)" />
          <a-tooltip title="复制">
            <a-button @click="onCopyText(`wss://server.gxwebsoft.com`)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>
      </a-form-item>
      <a-form-item label="uploadFile合法域名" name="uploadFile">
        <a-input-group compact>
          <a-input :value="`https://oss.wsdns.cn;`" style="width: calc(100% - 50px)" />
          <a-tooltip title="复制">
            <a-button @click="onCopyText(`https://oss.wsdns.cn;`)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>
      </a-form-item>
      <a-form-item label="downloadFile合法域名" name="downloadFile">
        <a-input-group compact>
          <a-input :value="`https://oss.wsdns.cn;`" style="width: calc(100% - 50px)" />
          <a-tooltip title="复制">
            <a-button @click="onCopyText(`https://oss.wsdns.cn;`)">
              <template #icon><CopyOutlined /></template>
            </a-button>
          </a-tooltip>
        </a-input-group>
        <a-button
          type="primary"
          class="ele-btn-icon"
          style="margin-top: 10px"
          @click="save"
        >
          <span>保存</span>
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { copyText } from '@/utils/common';
import { message } from 'ant-design-vue';
import { Setting } from '@/api/system/setting/model';
import { useThemeStore } from '@/store/modules/theme';
import { storeToRefs } from 'pinia';
import { FormInstance } from 'ant-design-vue/es/form';
import useFormData from '@/utils/use-form-data';
import { addSetting, updateSetting } from "@/api/system/setting";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { FILE_SERVER } from "@/config/setting";
import {
  CopyOutlined
} from '@ant-design/icons-vue';

const props = defineProps<{
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref(undefined);
const settingKey = ref('mp-weixin');
// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
// 编辑器内容，双向绑定
const logo = ref<any>([]);
// 提交状态
const loading = ref(false);
// 是否是修改
const isUpdate = ref(false);
//
const formRef = ref<FormInstance | null>(null);
// 表单数据
const { form, resetFields, assignFields } = useFormData<Setting>({
  appId: '',
  appSecret: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  appId: [
    {
      required: true,
      message: '请输入appId',
      type: 'string',
      trigger: 'blur'
    }
  ],
  appSecret: [
    {
      required: true,
      message: '请输入appSecret',
      type: 'string',
      trigger: 'blur'
    }
  ]
});

const onCopyText = (text) => {
  copyText(text);
}

const onUpload = (d: ItemType) => {
  uploadFile(<File>d.file)
    .then((result) => {
      form.logo = result.path;
      message.success('上传成功');
    })
    .catch((e) => {
      message.error(e.message);
    });
};

const onClose = () => {
  form.logo = undefined
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
      const appForm = {
        ...form,
        content: JSON.stringify(form)
      };
      const saveOrUpdate = isUpdate.value ? updateSetting : addSetting;
      saveOrUpdate(appForm)
        .then((msg) => {
          message.success('保存成功');
        })
        .catch((e) => {
          message.error(e.message);
        });
    })
    .catch(() => {});
};


watch(
  () => props.data,
  (data) => {
    if(data?.settingId){
      isUpdate.value = true
      // 表单赋值
      if(data.content){
        const jsonData = JSON.parse(data.content);
        assignFields(jsonData);
      }
      // 其他必要参数
      form.settingId = data.settingId
      form.settingKey = data.settingKey
    } else {
      // 新增
      isUpdate.value = false
      resetFields();
      form.settingKey = props.value
    }
  }
);
</script>

<style lang="less">
.small{
  color: var(--text-color-secondary);
  font-size: 14px;
}
</style>
