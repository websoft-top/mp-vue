<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="短信平台" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio :value="1">阿里云</a-radio>
          <a-radio :value="2">腾讯云</a-radio>
          <a-radio :value="3">七牛元</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="AccessKeyId" name="accessKeyId">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入AccessKeyId"
          v-model:value="form.accessKeyId"
        />
      </a-form-item>
      <a-form-item label="AccessKeySecret" name="accessKeySecret">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入AccessKeySecret"
          v-model:value="form.accessKeySecret"
        />
      </a-form-item>
      <a-form-item label="短信签名" name="sign">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入短信签名"
          v-model:value="form.sign"
        />
      </a-form-item>
      <div style="margin-bottom: 22px; width: 750px;">
        <a-divider>短信验证码 (通知用户)</a-divider>
      </div>
      <a-form-item label="是否开启" name="isOpenNotice">
        <a-radio-group v-model:value="form.isNoticeUser">
          <a-radio value="1">开启</a-radio>
          <a-radio value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="模板内容" name="isContent">
        验证码${code}，您正在进行身份验证，打死不要告诉别人哦！
      </a-form-item>
      <a-form-item label="模板ID" name="userTemplateId">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入模板ID"
          v-model:value="form.userTemplateId"
        />
      </a-form-item>

      <div style="margin-bottom: 22px; width: 750px;">
        <a-divider>新付款订单 (通知商家)</a-divider>
      </div>

      <a-form-item label="是否开启" name="isNoticeMerchant">
        <a-radio-group v-model:value="form.isNoticeMerchant">
          <a-radio value="1">开启</a-radio>
          <a-radio value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="模板内容" name="isContent">
        验证码${code}，您正在进行身份验证，打死不要告诉别人哦！
      </a-form-item>
      <a-form-item label="模板ID" name="merchantTemplateId">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入模板ID"
          v-model:value="form.merchantTemplateId"
        />
      </a-form-item>
      <a-form-item label="接收手机号" name="mobile">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入接收手机号"
          v-model:value="form.merchantMobiles"
        />
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
import { message } from 'ant-design-vue';
import { Setting } from '@/api/system/setting/model';
import { useThemeStore } from '@/store/modules/theme';
import { storeToRefs } from 'pinia';
import { FormInstance } from 'ant-design-vue/es/form';
import useFormData from '@/utils/use-form-data';
import { addSetting, listSetting, updateSetting } from "@/api/system/setting";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { FILE_SERVER } from "@/config/setting";

const props = defineProps<{
  // 当前选项卡
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

const emit = defineEmits<{
  (e: 'done', value): void;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref<number>();
const settingKey = ref('');
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
  settingKey: '',
  type: 1,
  accessKeyId: '',
  accessKeySecret: '',
  sign: '',
  isNoticeUser: '1',
  userTemplateId: '',
  merchantTemplateId: '',
  isNoticeMerchant: '1',
  merchantMobiles: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  accessKeyId: [
    {
      required: true,
      message: '请输入accessKeyId',
      type: 'string',
      trigger: 'blur'
    }
  ],
  accessKeySecret: [
    {
      required: true,
      message: '请输入accessKeySecret',
      type: 'string',
      trigger: 'blur'
    }
  ],
  sign: [
    {
      required: true,
      message: '请输入短信签名',
      type: 'string',
      trigger: 'blur'
    }
  ]
});

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
