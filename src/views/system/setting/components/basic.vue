<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="站点名称" name="siteName">
        <a-input
          allow-clear
          :maxlength="30"
          placeholder="请输入站点名称"
          v-model:value="form.siteName"
        />
      </a-form-item>
      <a-form-item label="站点描述" name="remarks">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入站点描述"
          v-model:value="form.remarks"
        />
      </a-form-item>
      <a-form-item label="SEO" name="keyword">
        <a-select
          v-model:value="keyword"
          mode="tags"
          style="width: 100%"
          :token-separators="[',']"
          placeholder="请输入网站关键字"
          :options="options"
          @change="handleKeyword"
        ></a-select>
      </a-form-item>
      <a-form-item label="ICP备案" name="icp">
        <a-input
          allow-clear
          :maxlength="18"
          placeholder="请输入ICP备案号"
          v-model:value="form.icp"
        />
      </a-form-item>
      <a-form-item label="版权信息" name="copyright">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入版权信息"
          v-model:value="form.copyright"
        />
      </a-form-item>
      <a-form-item label="公司名称" name="company">
        <a-input
          allow-clear
          :maxlength="30"
          placeholder="请输入公司名称"
          v-model:value="form.company"
        />
      </a-form-item>
      <a-form-item label="办公地址" name="address">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入公司办公地址"
          v-model:value="form.address"
        />
      </a-form-item>
      <a-form-item label="服务热线" name="phone">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入服务热线电话"
          v-model:value="form.phone"
        />
      </a-form-item>
      <a-form-item label="电子邮箱" name="email">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入电子邮箱"
          v-model:value="form.email"
        />
      </a-form-item>
      <a-form-item label="网站域名" name="domain">
        <a-input v-model:value="form.domain" placeholder="domain.com">
          <template #addonBefore>
            <a-select v-model:value="prefix" style="width: 90px">
              <a-select-option value="http://">http</a-select-option>
              <a-select-option value="https://">https</a-select-option>
            </a-select>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item label="技术支持" name="support">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="请输入技术支持"
          v-model:value="form.support"
        />
      </a-form-item>
      <a-form-item label="ico文件" name="logo">
        <ele-image-upload
          v-model:value="logo"
          :accept="'image/x-icon,image/svg'"
          :item-style="{ width: '40px', height: '40px' }"
          :limit="1"
          @upload="onUpload"
          @remove="onClose"
        />
        <a-space direction="vertical">
          <a-button
            type="primary"
            class="ele-btn-icon"
            style="margin-top: 10px;"
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
  const settingKey = ref('');
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);
  // 编辑器内容，双向绑定
  const logo = ref<any>([]);
  const prefix = ref('https://');
  const suffix = ref('.com');
  const keyword = ref([]);
  const tenantId = localStorage.getItem('TenantId');
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
    const file = d.file;
    console.log(file);
    if(file){
      if (file.size / 1024 / 1024 > 2) {
        message.error('大小不能超过 2MB');
        return;
      }
    }
    uploadFile(<File>d.file)
      .then((result) => {
        form.logo = result.url;
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
            logo.value.push({ uid:1, url: jsonData.logo, status: '' });
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
