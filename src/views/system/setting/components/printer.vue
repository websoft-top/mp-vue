<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 7, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="是否开启小票打印" name="isOpenPrinter">
        <a-radio-group v-model:value="form.isOpenPrinter">
          <a-radio value="1">开启</a-radio>
          <a-radio value="0">关闭</a-radio>
        </a-radio-group>
      </a-form-item>
      <template v-if="form.isOpenPrinter === '1'">
      <a-form-item label="打印机类型" name="printerType">
        <a-radio-group v-model:value="form.printerType">
          <a-radio value="1">飞鹅打印机</a-radio>
          <a-radio value="2">365云打印</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="USER" name="printerUser" v-if="form.printerType === '1'" extra="飞鹅云后台注册用户名">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入飞鹅云后台注册用户名"
          v-model:value="form.printerUser"
        />
      </a-form-item>
      <a-form-item label="UKEY" name="printerUserKey" v-if="form.printerType === '1'" extra="飞鹅云后台登录生成的UKEY">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入飞鹅云后台登录生成的UKEY"
          v-model:value="form.printerUserKey"
        />
      </a-form-item>
      <a-form-item label="打印机编号" name="printerCode" extra="打印机编号为9位数字">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入打印机编号"
          v-model:value="form.printerCode"
        />
      </a-form-item>
      <a-form-item label="打印机秘钥" name="printerKey" v-if="form.printerType === '2'">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入打印机编号"
          v-model:value="form.printerKey"
        />
        <small class="small" v-if="form.printerType === '1'">打印机编号为9位数字，查看飞鹅打印机底部贴纸上面的编号</small>
      </a-form-item>
      <a-form-item label="打印联数" name="printerTimes" extra="同一订单，打印的次数">
        <a-input-number
          :min="0"
          style="width: 180px"
          placeholder="请输入打印联数"
          v-model:value="form.printerTimes"
        />
      </a-form-item>
      <a-form-item label="订单打印方式" name="printerStatus">
        <a-checkbox-group v-model:value="form.printerStatus">
          <a-checkbox value="20">订单付款时</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
      </template>
      <a-form-item label="操作">
        <a-button
          type="primary"
          class="ele-btn-icon"
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
import { addSetting, updateSetting } from "@/api/system/setting";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { FILE_SERVER } from "@/config/setting";

const props = defineProps<{
  // 当前选项卡
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref(undefined);
const settingKey = ref('printer');
const comments = ref('打印设置');
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
  isOpenPrinter: '0',
  printerType: '1',
  printerStatus: '20',
  printerUser: '',
  printerUserKey: '',
  printerCode: '',
  printerKey: '',
  printerTimes: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  siteName: [
    {
      required: true,
      message: '请输入系统名称',
      type: 'string',
      trigger: 'blur'
    }
  ],
  comments: [
    {
      required: true,
      message: '请输入站点描述',
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
