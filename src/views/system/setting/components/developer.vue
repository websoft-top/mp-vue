<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="租户ID" name="tenantId">
        <span class="ele-text-heading">{{ tenantId }}</span>
      </a-form-item>
      <a-form-item label="应用编码" name="tenantCode">
        <span class="ele-text-heading">{{ tenantCode }}</span>
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
    value?: string;
    // 修改回显的数据
    data?: Setting | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', value): void;
  }>();

  // 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
  const settingId = ref(null);
  const settingKey = ref('developer');
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  // 编辑器内容，双向绑定
  const logo = ref<any>([]);
  const prefix = ref('https://');
  const suffix = ref('.com');
  const keyword = ref([]);
  const tenantId = localStorage.getItem('TenantId');
  const tenantCode = 'YKVBG4nwnHFXh9pe';
  // 提交状态
  const loading = ref(false);
  // 是否是修改
  const isUpdate = ref(false);
  //
  const formRef = ref<FormInstance | null>(null);
  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Setting>({
    siteName: '',
    icp: '',
    copyright: '',
    keyword: '',
    remarks: '',
    fullName: '',
    company: '',
    address: '',
    domain: '',
    email: '',
    phone: '',
    support: '',
    logo: '',
    tenantId: undefined
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
    keyword: [
      {
        required: true,
        message: '请输入网站关键词',
        type: 'string',
        trigger: 'blur'
      }
    ],
    remarks: [
      {
        required: true,
        message: '请输入站点描述',
        type: 'string',
        trigger: 'blur'
      }
    ],
    icp: [
      {
        required: true,
        message: '请输入ICP备案号',
        type: 'string',
        trigger: 'blur'
      }
    ],
    copyright: [
      {
        required: true,
        message: '请输入版权信息',
        type: 'string',
        trigger: 'blur'
      }
    ],


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

  const handleKeyword = (keyword) => {
    keyword.value = keyword;
    form.keyword = JSON.stringify(keyword);
  }

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
          content: JSON.stringify(form),
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
          // 头像赋值
          logo.value = [];
          if (jsonData.logo) {
            logo.value.push({ uid:1, url: FILE_SERVER + jsonData.logo, status: '' });
          }
          if(jsonData.keyword){
            keyword.value = JSON.parse(jsonData.keyword)
          }
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
