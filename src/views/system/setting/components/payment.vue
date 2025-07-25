<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="支付方式" name="payMethod">
        <PayMethod
          dict-code="payMethod"
          v-model:value="form.payMethod"
          :placeholder="`选择支付方式`"
        />
      </a-form-item>
      <!-- 余额支付 -->
      <a-form-item label="是否启用" name="balanceIsEnable" v-if="form.payMethod === '10'">
        <a-switch v-model:checked="form.balanceIsEnable" />
      </a-form-item>
      <!-- 微信支付开始 -->
      <template v-if="form.payMethod === '20'">
        <a-form-item label="是否启用" name="wechatIsEnable">
          <a-switch v-model:checked="form.wechatIsEnable" />
        </a-form-item>
        <a-form-item label="微信商户号类型" name="wechatType">
          <a-radio-group v-model:value="form.wechatType">
            <a-radio value="1">
              <text>普通商户</text>
            </a-radio>
            <a-radio value="2">子商户 (服务商模式)</a-radio>
          </a-radio-group>
        </a-form-item>
        <template v-if="form.wechatType === '1'">
          <a-form-item
            label="应用ID (AppID)"
            name="wechatAppId"
          >
            <a-input
              allow-clear
              placeholder="微信小程序或者微信公众号的APPID，APP支付需要填写开放平台的应用APPID"
              v-model:value="form.wechatAppId"
            />
          </a-form-item>
          <a-form-item label="微信商户号 (MchId)" name="mchId">
            <a-input
              allow-clear
              placeholder="微信支付的商户号"
              v-model:value="form.mchId"
            />
          </a-form-item>
          <a-form-item label="支付密钥 (APIv3密钥)" name="wechatApiKey">
            <a-input-password
              allow-clear
              placeholder="设置APIv3密钥"
              v-model:value="form.wechatApiKey"
            />
          </a-form-item>
          <a-form-item
            label="证书文件 (CERT)"
            name="apiclientCert"
            extra='请上传 "apiclient_cert.pem" 文件'
          >
            <Upload accept=".crt" v-model:value="form.apiclientCert" />
            {{ form.apiclientCert }}
          </a-form-item>
          <a-form-item
            label="证书文件 (KEY)"
            name="apiclientKey"
            extra='请上传 "apiclient_key.pem" 文件'
          >
            <Upload accept=".crt" v-model:value="form.apiclientKey" />
            {{ form.apiclientKey }}
          </a-form-item>
          <a-form-item label="商户证书序列号" name="merchantSerialNumber">
            <a-input
              allow-clear
              placeholder="商户证书序列号"
              v-model:value="form.merchantSerialNumber"
            />
          </a-form-item>
        </template>
        <template v-if="form.wechatType === '2'">
          <a-form-item
            label="服务商应用ID (AppID)"
            name="spAppId"
          >
            <a-input
              allow-clear
              placeholder="请填写微信支付服务商的AppID"
              v-model:value="form.spAppId"
            />
          </a-form-item>
          <a-form-item label="服务商户号 (MchId)" name="spMchId">
            <a-input
              allow-clear
              placeholder="微信支付服务商的商户号"
              v-model:value="form.spMchId"
            />
          </a-form-item>
          <a-form-item label="服务商密钥 (APIKEY)" name="spApiKey">
            <a-input
              allow-clear
              placeholder="微信支付服务商的商户号"
              v-model:value="form.spApiKey"
            />
          </a-form-item>
          <a-form-item label="子商户应用ID (AppID)" name="spSubAppId">
            <a-input
              allow-clear
              placeholder="微信小程序或者微信公众号的APPID，APP支付需要填写开放平台的应用APPID"
              v-model:value="form.spSubAppId"
            />
          </a-form-item>
          <a-form-item label="子商户号 (MchId)" name="spSubMchId">
            <a-input
              allow-clear
              placeholder="微信支付的商户号"
              v-model:value="form.spSubMchId"
            />
          </a-form-item>
          <a-form-item
            label="服务商证书文件 (CERT)"
            name="spApiclientCert"
            extra='请上传 "apiclient_cert.pem" 文件'
          >
            <Upload accept=".crt" v-model:value="form.spApiclientCert" />
            {{ form.spApiclientCert }}
          </a-form-item>
          <a-form-item
            label="服务商证书文件 (KEY)"
            name="spApiclientKey"
            extra='请上传 "apiclient_key.pem" 文件'
          >
            <Upload accept=".crt" v-model:value="form.spApiclientKey" />
            {{ form.spApiclientKey }}
          </a-form-item>
        </template>
      </template>
      <!-- 支付宝支付开始 -->
      <template v-if="form.payMethod === '30'">
        <a-form-item label="是否启用" name="alipayIsEnable">
          <a-switch v-model:checked="form.alipayIsEnable" />
        </a-form-item>
        <a-form-item
          label="支付宝应用"
          name="alipayAppId"
        >
          <a-input
            allow-clear
            placeholder="支付宝分配给开发者的应用ID"
            v-model:value="form.alipayAppId"
          />
        </a-form-item>
        <a-form-item
          label="签名算法 (signType)"
          name="signType"
        >
          <a-radio-group v-model:value="form.signType">
            <a-radio value="RSA2">RSA2</a-radio>
            <a-radio value="RSA">RSA</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="加签模式"
          name="signMode"
          extra="如需使用资金支出类的接口，则必须使用公钥证书模式，配置指南 https://opendocs.alipay.com/open/200/105310"
        >
          <a-radio-group v-model:value="form.signMode">
            <a-radio value="公钥证书">
              <text>公钥证书</text>
              <a-tag class="ml-5" color="green">推荐</a-tag>
            </a-radio>
            <a-radio value="公钥">公钥</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item
          label="应用公钥证书"
          name="appCertPublicKey"
          v-if="form.signMode === '公钥证书'"
          extra='请上传 "appCertPublicKey.crt" 文件'
        >
          <Upload accept=".crt" v-model:value="form.appCertPublicKey" />
          {{ form.appCertPublicKey }}
        </a-form-item>
        <a-form-item
          label="支付宝公钥证书"
          name="alipayCertPublicKey"
          v-if="form.signMode === '公钥证书'"
          extra='请上传 "alipayCertPublicKey_RSA2.crt" 文件'
        >
          <Upload accept=".crt" v-model:value="form.alipayCertPublicKey" />
          {{ form.alipayCertPublicKey }}
        </a-form-item>
        <a-form-item
          label="支付宝根证书"
          name="alipayRootCert"
          v-if="form.signMode === '公钥证书'"
          extra='请上传 "alipayRootCert.crt" 文件'
        >
          <Upload accept=".crt" v-model:value="form.alipayRootCert" />
          {{ form.alipayRootCert }}
        </a-form-item>
        <a-form-item
          label="支付宝公钥"
          name="alipayPublicKey"
          v-if="form.signMode === '公钥'"
        >
          <a-textarea
            :rows="6"
            placeholder="请输入alipayPublicKey"
            v-model:value="form.alipayPublicKey"
          />
        </a-form-item>
        <a-form-item
          label="应用私钥"
          name="privateKey"
          extra='查看 "应用私钥_RSA2_PKCS8.txt" 文件，将全部内容复制到此处'
        >
          <a-textarea
            :rows="6"
            placeholder="请输入privateKey"
            v-model:value="form.privateKey"
          />
        </a-form-item>
        <a-form-item
          label="接口内容加密方式"
          name="decryptKey"
        >
          <a-input
            allow-clear
            placeholder="请输入decryptKey"
            v-model:value="form.decryptKey"
          />
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
import { reactive, ref, watch } from "vue";
import { copyText } from "@/utils/common";
import { message } from "ant-design-vue";
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
const settingKey = ref("payment");
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
  payMethod: 10,
  signMode: "公钥证书",
  appId: "",
  signType: "RSA2",
  alipayAppId: "",
  appCertPublicKey: "",
  alipayCertPublicKey: "",
  alipayRootCert: "",
  alipayPublicKey: "",
  privateKey: "",
  decryptKey: "",
  balanceIsEnable: true,
  wechatIsEnable: false,
  alipayIsEnable: false,
  wechatType: '1',
  wechatAppId: '',
  wechatApiKey: '',
  apiclientCert: '',
  apiclientKey: '',
  mchId: undefined,
  spAppId: '',
  spMchId: '',
  spApiKey: '',
  spSubAppId: '',
  spSubMchId: '',
  spApiclientCert: '',
  spApiclientKey: '',
  merchantSerialNumber: '',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  payMethod: [
    {
      required: true,
      message: "请选择支付方式",
      type: "string",
      trigger: "blur"
    }
  ],
  signType: [
    {
      required: true,
      type: "string",
      message: "请填写签名算法",
      trigger: "blur"
    }
  ],
  appCertPublicKey: [
    {
      required: true,
      type: "string",
      message: "请上传应用公钥证书",
      trigger: "blur"
    }
  ],
  alipayCertPublicKey: [
    {
      required: true,
      type: "string",
      message: "请上传支付宝公钥证书",
      trigger: "blur"
    }
  ],
  alipayRootCert: [
    {
      required: true,
      type: "string",
      message: "请上传支付宝根证书",
      trigger: "blur"
    }
  ],
  signMode: [
    {
      required: true,
      type: "string",
      message: "请选择加签模式",
      trigger: "blur"
    }
  ],
  balanceIsEnable: [
    {
      required: true,
      type: "boolean",
      message: "请设置是否启用余额支付",
      trigger: "blur"
    }
  ],
  wechatIsEnable: [
    {
      required: true,
      type: "boolean",
      message: "请设置是否启用微信支付",
      trigger: "blur"
    }
  ],
  alipayIsEnable: [
    {
      required: true,
      type: "boolean",
      message: "请设置是否启用支付宝支付",
      trigger: "blur"
    }
  ],
  comments: [
    {
      required: true,
      type: "string",
      message: "请填写支付方式简介",
      trigger: "blur"
    }
  ],
  status: [
    {
      required: true,
      type: "number",
      message: "请选择支付方式状态",
      trigger: "blur"
    }
  ],
  sortNumber: [
    {
      required: true,
      type: "number",
      message: "请输入排序号",
      trigger: "blur"
    }
  ],
  alipayAppId: [
    {
      required: true,
      type: "string",
      message: "请填写应用ID",
      trigger: "blur"
    }
  ],
  alipayPublicKey: [
    {
      required: true,
      type: "string",
      message: "请填写支付宝公钥",
      trigger: "blur"
    }
  ],
  privateKey: [
    {
      required: true,
      type: "string",
      message: "请填写应用私钥",
      trigger: "blur"
    }
  ]
});

const onCopyText = (text) => {
  copyText(text);
};

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
