<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑支付方式' : '添加支付方式'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
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
      <a-form-item label="支付方式" name="name">
        <PayMethod
          dict-code="payMethod"
          v-model:value="form.name"
          :placeholder="`选择支付方式`"
          @change="onPayMethod"
        />
      </a-form-item>
      <!--微信支付-->
      <template v-if="form.code == '1'">
        <a-form-item label="微信商户号类型" name="wechatType">
          <a-radio-group v-model:value="form.wechatType">
            <a-radio :value="0">
              <text>普通商户</text>
            </a-radio>
            <a-radio :value="1">子商户 (服务商模式)</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item label="应用ID" name="appId" extra="微信小程序或者微信公众号的APPID，需要在哪个客户端支付就填写哪个，APP支付需要填写开放平台的应用APPID">
          <a-input
            allow-clear
            placeholder="请输入应用ID"
            v-model:value="form.appId"
          />
        </a-form-item>
        <a-form-item label="商户号" name="mchId">
          <a-input
            allow-clear
            placeholder="请输入商户号"
            v-model:value="form.mchId"
          />
        </a-form-item>
        <a-form-item label="设置APIv3密钥" name="apiKey">
          <a-input-password
            allow-clear
            placeholder="请输入设置APIv3密钥"
            v-model:value="form.apiKey"
          />
        </a-form-item>
        <a-form-item label="证书文件 (KEY)" name="apiclientKey" extra="请上传 apiclient_key.pem 文件">
          <Upload accept=".crt,.pem" v-model:value="form.apiclientKey" />
          {{ form.apiclientKey }}
        </a-form-item>
        <a-form-item label="证书文件 (CERT)" name="apiclientCert" extra="请上传 apiclient_cert.pem 文件">
          <Upload accept=".crt,.pem" v-model:value="form.apiclientCert" />
          {{ form.apiclientCert }}
        </a-form-item>
        <a-form-item label="商户证书序列号" name="merchantSerialNumber" extra="填写API证书里的证书序列号">
          <a-input
            allow-clear
            placeholder="请输入商户证书序列号"
            v-model:value="form.merchantSerialNumber"
          />
        </a-form-item>
        <a-form-item label="公钥文件 (CERT)" name="apiclientCert" extra="请上传 公钥文件">
          <Upload accept=".crt,.pem" v-model:value="form.pubKey" />
          {{ form.pubKey }}
        </a-form-item>
        <a-form-item label="公钥ID" name="pubKeyId">
          <a-input
            allow-clear
            placeholder="请输公钥ID"
            v-model:value="form.pubKeyId"
          />
        </a-form-item>
      </template>
      <a-form-item label="支付通知" name="notifyUrl" extra="推送支付结果(携带租户ID的POST请求)">
        <a-input
          allow-clear
          placeholder="请输入支付结果通知地址"
          v-model:value="form.notifyUrl"
        />
      </a-form-item>
      <a-form-item label="图标" name="image">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="排序" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
      <a-form-item label="是否启用" name="status">
        <a-switch v-model:checked="form.status" />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addPayment, updatePayment } from '@/api/system/payment';
  import { Payment } from '@/api/system/payment/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';
  import Upload from "@/components/UploadCert/index.vue";
  import { uploadFile } from "@/api/system/file";

  // 是否是修改
  const isUpdate = ref(false);
  const useForm = Form.useForm;
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: Payment | null;
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

  // 用户信息
  const form = reactive<Payment>({
    id: 0,
    name: undefined,
    type: 1,
    code: '',
    image: '',
    wechatType: 0,
    appId: '',
    mchId: '',
    apiKey: '',
    pubKey: '',
    pubKeyId: '',
    apiclientCert: '',
    apiclientKey: '',
    merchantSerialNumber: '',
    notifyUrl: 'https://modules.gxwebsoft.com/api/shop/wx-pay/notify',
    comments: '',
    sortNumber: 0,
    status: undefined,
    tenantId: undefined,
    createTime: ''
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    name: [
      {
        required: true,
        type: 'string',
        message: '请填写支付方式名称',
        trigger: 'blur'
      }
    ],
    appId: [
      {
        required: true,
        type: 'string',
        message: '请填写应用ID',
        trigger: 'blur'
      }
    ],
    mchId: [
      {
        required: true,
        type: 'string',
        message: '请填写商户号',
        trigger: 'blur'
      }
    ],
    wechatType: [
      {
        required: true,
        type: 'number',
        message: '请选择商户类型',
        trigger: 'blur'
      }
    ],
    apiKey: [
      {
        required: true,
        type: 'string',
        message: '请填写APIv3密钥',
        trigger: 'blur'
      }
    ],
    // apiclientCert: [
    //   {
    //     required: true,
    //     type: 'string',
    //     message: '请上传证书文件(CERT)',
    //     trigger: 'blur'
    //   }
    // ],
    // pubKeyId: [
    //   {
    //     required: true,
    //     type: 'string',
    //     message: '请填写公钥ID',
    //     trigger: 'blur'
    //   }
    // ],
    apiclientKey: [
      {
        required: true,
        type: 'string',
        message: '请上传证书文件(KEY)',
        trigger: 'blur'
      }
    ],
    notifyUrl: [
      {
        required: true,
        type: 'string',
        message: '请填写支付通知地址',
        trigger: 'blur'
      }
    ],
    merchantSerialNumber: [
      {
        required: true,
        type: 'string',
        message: '请填写商户证书序列号',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.thumbnail,
      status: 'done'
    });
    form.image = data.thumbnail;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.image = '';
  };

  const onPayMethod = (value: string, item: any) => {
    form.name = item.label
    form.code = item.value
    form.type = item.value
  }

  const onUpload = (d: ItemType) => {
    uploadFile(<File>d.file)
      .then((result) => {
        form.image = result.path;
        message.success("上传成功");
      })
      .catch((e) => {
        message.error(e.message);
      });
  };


  const { resetFields } = useForm(form, rules);

  /* 保存编辑 */
  const save = () => {
    if (!formRef.value) {
      return;
    }
    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const formData = {
          ...form
        };
        console.log(form);
        const saveOrUpdate = isUpdate.value ? updatePayment : addPayment;
        saveOrUpdate(formData)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            emit('done');
          })
          .catch((e) => {
            loading.value = false;
            message.error(e.message);
          });
      })
      .catch(() => {});
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          if(props.data.image){
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
            })
          }
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }
    },
    { immediate: true }
  );
</script>
