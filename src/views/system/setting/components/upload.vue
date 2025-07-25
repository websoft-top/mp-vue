<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="默认上传方式" name="uploadMethod">
        <a-radio-group v-model:value="form.uploadMethod" @click="onMethod">
          <a-radio-button disabled value="file">本地</a-radio-button>
          <a-radio-button value="oss">阿里云</a-radio-button>
          <a-radio-button disabled value="cos">腾讯云</a-radio-button>
          <a-radio-button disabled value="kodo">七牛云</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <template v-if="form.uploadMethod !== 'file'">
        <a-form-item
          label="存储空间名称"
          name="bucketName"
        >
          <a-input
            v-model:value="form.bucketName"
            placeholder="存储空间名称"
          />
        </a-form-item>
        <a-form-item
          label="Region域名"
          name="endpoint"
        >
          <a-input
            v-model:value="form.bucketEndpoint"
            placeholder="https://oss-cn-shenzhen.aliyuncs.com"
          />
        </a-form-item>
        <a-form-item
          label="accessKeyId"
          name="accessKeyId"
        >
          <a-input
            v-model:value="form.accessKeyId"
            placeholder="accessKeyId"
          />
        </a-form-item>
        <a-form-item
          label="accessKeySecret"
          name="accessKeySecret"
        >
          <a-input
            v-model:value="form.accessKeySecret"
            placeholder="accessKeySecret"
          />
        </a-form-item>
        <a-form-item
          label="空间域名"
          name="bucketDomain"
        >
          <a-input
            v-model:value="form.bucketDomain"
            placeholder="https://oss-gxwebsoft.oss-cn-shenzhen.aliyuncs.com"
          />
        </a-form-item>
      </template>
      <!-- 私有云 -->
      <template v-if="form.uploadMethod === 'file'">
        <a-form-item
          label="域名"
          name="fileUrl"
        >
          <a-input-group compact>
            <a-input
              v-model:value="form.fileUrl"
              placeholder="请输入文件服务器域名"
              style="width: calc(100% - 50px)"
            />
            <a-tooltip title="复制">
              <a-button @click="onCopyText(`https://file.wsdns.cn`)">
                <template #icon><CopyOutlined /></template>
              </a-button>
            </a-tooltip>
          </a-input-group>
        </a-form-item>
      </template>
      <!-- 阿里云 -->
      <template v-if="form.uploadMethod === 'oss'">
        <a-form-item label="去申请">
          <a href="https://oss.console.aliyun.com" target="_blank">https://oss.console.aliyun.com</a>
        </a-form-item>
      </template>
      <!-- 腾讯云 -->
      <template v-if="form.uploadMethod === 'cos'">
        <a-form-item label="去申请">
          <a href="https://cloud.tencent.com/product/cos" target="_blank">https://cloud.tencent.com/product/cos</a>
        </a-form-item>
      </template>
      <!-- 七牛云 -->
      <template v-if="form.uploadMethod === 'kodo'">
        <a-form-item label="去申请">
          <a href="https://www.qiniu.com/products/kodo" target="_blank">https://www.qiniu.com/products/kodo</a>
        </a-form-item>
      </template>
      <a-form-item label="使用临时存储" v-if="form.uploadMethod === 'oss'">
        <div style="margin-top: 6px">
          <a class="" @click="onDemoOss">立即填入</a>
          <div class="ele-text-secondary">仅供体验及测试使用，空间大小和有流量有一定限制不推荐使用，正式使用请单独申请独立的云存储</div>
        </div>
      </a-form-item>
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
import { reactive, ref, watch } from "vue";
import { copyText } from "@/utils/common";
import { message } from "ant-design-vue";
import { CopyOutlined } from '@ant-design/icons-vue';
import { Setting } from "@/api/system/setting/model";
import { useThemeStore } from "@/store/modules/theme";
import { storeToRefs } from "pinia";
import { UploadOutlined } from '@ant-design/icons-vue';
import { FormInstance } from "ant-design-vue/es/form";
import useFormData from "@/utils/use-form-data";
import { addSetting, updateSetting } from "@/api/system/setting";
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import Upload from "@/components/UploadCert/index.vue";
import { FILE_SERVER, TOKEN_STORE_NAME } from "@/config/setting";

const props = defineProps<{
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref(undefined);
const settingKey = ref("upload");
// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
// 编辑器内容，双向绑定
const logo = ref<any>([]);
// 提交状态
const loading = ref(false);
// 是否是修改
const isUpdate = ref(false);
// token
const token = localStorage.getItem(TOKEN_STORE_NAME);
//
const formRef = ref<FormInstance | null>(null);
// 表单数据
const { form, resetFields, assignFields } = useFormData<Setting>({
  uploadMethod: 'oss',
  fileUrl: 'https://file.wsdns.cn',
  bucketName: '',
  bucketEndpoint: '',
  accessKeyId: '',
  accessKeySecret: '',
  bucketDomain: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  uploadMethod: [
    {
      required: true,
      type: "string",
      message: "请设置上传方式",
      trigger: "blur"
    }
  ],
  bucketName: [
    {
      required: true,
      type: "string",
      message: "请填写存储空间名称",
      trigger: "blur"
    }
  ],
  accessKeyId: [
    {
      required: true,
      type: "string",
      message: "请填写accessKeyId",
      trigger: "blur"
    }
  ],
  accessKeySecret: [
    {
      required: true,
      type: "string",
      message: "请填写accessKeySecret",
      trigger: "blur"
    }
  ],
  bucketDomain: [
    {
      required: true,
      type: "string",
      message: "请填写存储空间域名",
      trigger: "blur"
    }
  ]
});

const onCopyText = (text) => {
  copyText(text);
};

const onMethod = (e) => {
  resetFields();
}

const onDemoOss = () => {
    form.uploadMethod == 'oss'
    form.bucketName = 'oss-gxwebsoft'
    form.bucketEndpoint = 'https://oss-cn-shenzhen.aliyuncs.com'
    form.accessKeyId = 'YOUR_ACCESS_KEY_ID'
    form.accessKeySecret = 'YOUR_ACCESS_KEY_SECRET'
    form.bucketDomain = 'https://oss.wsdns.cn'
    form.settingKey = 'upload';
}

const onApiclientKey = (e) => {
  const response = e.file.response
  const parse = JSON.parse(response);
  console.log(parse);
  form.apiclientKey = e.file.response
}

const onUpload = (d: ItemType) => {
  uploadFile(<File>d.file)
    .then((result) => {
      form.logo = result.path;
      message.success("上传成功");
    })
    .catch((e) => {
      message.error(e.message);
    });
};

const onClose = () => {
  form.logo = undefined;
};

/* 保存编辑 */
const save = () => {
  console.log(form);
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
          message.success("保存成功");
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
      isUpdate.value = true;
      // 表单赋值
      if (data.content) {
        const jsonData = JSON.parse(data.content);
        assignFields(jsonData);
      }
      // 其他必要参数
      form.settingId = data.settingId;
      form.settingKey = data.settingKey;
    } else {
      // 新增
      isUpdate.value = false;
      resetFields();
      form.settingKey = props.value;
    }
  }
);
</script>

<style lang="less">
.small {
  color: var(--text-color-secondary);
  font-size: 14px !important;
}
</style>
