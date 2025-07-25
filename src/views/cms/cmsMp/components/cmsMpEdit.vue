<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑小程序信息' : '添加小程序信息'"
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
      <a-form-item label="头像" name="avatar">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="小程序码" name="mpQrcode">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="mpQrcode"
          @done="chooseMpQrcode"
          @del="onDeleteMpQrcode"
        />
      </a-form-item>
      <a-form-item label="小程序名称" name="mpName">
        <a-input
          allow-clear
          placeholder="请输入小程序名称"
          v-model:value="form.mpName"
        />
      </a-form-item>
      <a-form-item label="小程序ID" name="appId">
        <a-input
          allow-clear
          placeholder="请输入小程序ID"
          v-model:value="form.appId"
        />
      </a-form-item>
      <a-form-item label="小程序密钥" name="appSecret">
        <a-input
          allow-clear
          placeholder="请输入小程序密钥"
          type="password"
          v-model:value="form.appSecret"
        />
      </a-form-item>
      <a-form-item label="主体信息" name="companyName">
        <a-input
          allow-clear
          placeholder="请输入主体信息"
          v-model:value="form.companyName"
        />
      </a-form-item>
      <a-form-item label="小程序备案" name="icpNo">
        <a-input
          allow-clear
          placeholder="请输入小程序备案"
          v-model:value="form.icpNo"
        />
      </a-form-item>
      <a-form-item label="登录邮箱" name="email">
        <a-input
          allow-clear
          placeholder="请输入登录邮箱"
          v-model:value="form.email"
        />
      </a-form-item>
      <a-form-item label="原始ID" name="ghId">
        <a-input
          allow-clear
          placeholder="请输入原始ID"
          v-model:value="form.ghId"
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
      <a-form-item label="介绍" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="微信认证" name="authentication">
        <a-radio-group v-model:value="form.authentication">
          <a-radio :value="0">已认证</a-radio>
          <a-radio :value="1">未认证</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsMp, updateCmsMp } from '@/api/cms/cmsMp';
  import { CmsMp } from '@/api/cms/cmsMp/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';

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
    data?: CmsMp | null;
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
  // 表格选中数据
  const mpQrcode = ref<ItemType[]>([]);

  // 用户信息
  const form = reactive<CmsMp>({
    mpId: undefined,
    type: undefined,
    appId: undefined,
    appSecret: undefined,
    mpName: undefined,
    shortName: undefined,
    avatar: undefined,
    mpQrcode: undefined,
    authentication: undefined,
    companyName: undefined,
    icpNo: undefined,
    email: undefined,
    password: undefined,
    ghId: undefined,
    mainPath: undefined,
    expirationTime: undefined,
    comments: undefined,
    userId: undefined,
    status: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsMpName: [
      {
        required: true,
        type: 'string',
        message: '请填写小程序信息名称',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.avatar = data.path;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.avatar = '';
  };

  const chooseMpQrcode = (data: FileRecord) => {
    mpQrcode.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.mpQrcode = data.downloadUrl;
  };

  const onDeleteMpQrcode = (index: number) => {
    mpQrcode.value.splice(index, 1);
    form.mpQrcode = '';
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
        const saveOrUpdate = isUpdate.value ? updateCmsMp : addCmsMp;
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
          if(props.data.avatar){
            images.value.push({
              uid: uuid(),
              url: props.data.avatar,
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
