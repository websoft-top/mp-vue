<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="悬浮工具栏" name="floatTool" extra="显示网站悬浮客服工具栏">
        <a-switch v-model:checked="form.floatTool" checked-children="显示" un-checked-children="隐藏" @change="save" />
      </a-form-item>
      <a-form-item label="显示站内搜索" name="searchBtn">
        <a-switch v-model:checked="form.searchBtn" checked-children="显示" un-checked-children="隐藏" @change="save" />
      </a-form-item>
      <a-form-item label="启用登录注册" name="loginBtn">
        <a-switch v-model:checked="form.loginBtn" checked-children="启用" un-checked-children="不启用" @change="save" />
      </a-form-item>
      <a-form-item label="默认编辑器" name="editor" extra="设置默认编辑器">
        <a-select v-model:value="form.editor" placeholder="请选择编辑器" class="max-w-xs" @change="save">
          <a-select-option :value="1">富文本编辑器</a-select-option>
          <a-select-option :value="2">Markdown编辑器</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import {reactive, ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {Setting} from '@/api/system/setting/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance} from 'ant-design-vue/es/form';
import useFormData from '@/utils/use-form-data';
import {addSetting, updateSetting} from "@/api/system/setting";
import {ItemType} from "ele-admin-pro/es/ele-image-upload/types";
import {uploadFile} from "@/api/system/file";

const props = defineProps<{
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingKey = ref('website');

// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);
// 提交状态
const loading = ref(false);
// 是否是修改
const isUpdate = ref(false);
//
const formRef = ref<FormInstance | null>(null);
// 表单数据
const {form, resetFields, assignFields} = useFormData<Setting>({
  settingKey: 'website',
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
    .catch(() => {
    });
};

watch(
  () => props.data,
  (data) => {
    if (data?.settingId) {
      isUpdate.value = true
      // 表单赋值
      if (data.content) {
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
