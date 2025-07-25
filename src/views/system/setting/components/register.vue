<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="默认登录/注册方式" name="type">
        <a-radio-group v-model:value="form.type">
          <a-radio :value="1">手机号+短信验证码</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="请选择默认角色" name="roleId">
        <role-select v-model:value="form.roleId" />
      </a-form-item>
      <div style="margin-bottom: 22px; width: 750px;">
        <a-divider>微信小程序授权登录</a-divider>
      </div>
      <a-form-item label="一键授权登录/注册" name="openWxAuth">
        <a-radio-group v-model:value="form.openWxAuth">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="注册时绑定手机号" name="openWxBindPhone">
        <a-radio-group v-model:value="form.openWxBindPhone">
          <a-radio :value="1">强制绑定</a-radio>
          <a-radio :value="0">不绑定</a-radio>
        </a-radio-group>
      </a-form-item>
      <div style="margin-bottom: 22px; width: 750px;">
        <a-divider>微信公众号授权登录</a-divider>
      </div>
      <a-form-item label="一键授权登录/注册" name="openWxofficialAuth">
        <a-radio-group v-model:value="form.openWxofficialAuth">
          <a-radio :value="1">开启</a-radio>
          <a-radio :value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="注册时绑定手机号" name="openBindPhone">
        <a-space direction="vertical">
          <a-radio-group v-model:value="form.openWxofficialBindPhone"
                         style="margin-top: 5px">
            <a-radio :value="1">强制绑定</a-radio>
            <a-radio :value="0">不绑定</a-radio>
          </a-radio-group>
        </a-space>
      </a-form-item>
      <a-form-item label="登录超时时间" name="tokenExpireTime">
        <a-space direction="vertical">
          <a-input
            allow-clear
            :maxlength="30"
            placeholder="请输入登录超时时间"
            v-model:value="form.tokenExpireTime"
          />
          <a-button
            type="primary"
            class="ele-btn-icon"
            style="margin-top: 10px"
            @click="save"
          >
            <span>保存</span>
          </a-button>
        </a-space>
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
import { addSetting, updateSetting } from "@/api/system/setting";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import RoleSelect from './role-select.vue';
import { FILE_SERVER } from "@/config/setting";
import { Role } from "@/api/system/role/model";

const props = defineProps<{
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref(undefined);
const settingKey = ref('register');

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
  roleId: undefined,
  openWxAuth: 1,
  openWxBindPhone: 1,
  openWxofficialAuth: 1,
  openWxofficialBindPhone: 1,
  tokenExpireTime: 86400,
  comments: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  type: [
    {
      required: true,
      message: '请选择默认注册方式',
      type: 'number',
      trigger: 'blur'
    }
  ],
  roleId: [
    {
      required: true,
      message: '请选择默认角色',
      type: 'number',
      trigger: 'blur'
    }
  ],
  openWxAuth: [
    {
      required: true,
      message: '请输入系统名称',
      type: 'number',
      trigger: 'blur'
    }
  ],
  openWxBindPhone: [
    {
      required: true,
      message: '请输入系统名称',
      type: 'number',
      trigger: 'blur'
    }
  ],
  openWxofficialAuth: [
    {
      required: true,
      message: '请输入系统名称',
      type: 'number',
      trigger: 'blur'
    }
  ],
  openWxofficialBindPhone: [
    {
      required: true,
      message: '请输入系统名称',
      type: 'number',
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
      form.settingKey = settingKey.value
    }
  }
);
</script>
