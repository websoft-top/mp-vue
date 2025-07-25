<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑链接' : '添加链接'"
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
      <a-form-item label="名称" name="type">
        <a-input
          allow-clear
          placeholder="演示地址"
          v-model:value="form.type"
        />
      </a-form-item>
      <a-form-item label="内容" name="domain">
        <a-input
          allow-clear
          placeholder="https://nbg-admin.websoft.top"
          v-model:value="form.domain"
        />
      </a-form-item>
      <a-form-item label="账号" name="account">
        <a-input
          allow-clear
          placeholder="请输入账号"
          v-model:value="form.account"
        />
      </a-form-item>
      <a-form-item label="密码" name="password">
        <a-input-password
          allow-clear
          placeholder="请输入密码"
          v-model:value="form.password"
        />
      </a-form-item>
      <a-form-item label="二维码">
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
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addCmsProductUrl, updateCmsProductUrl } from '@/api/cms/cmsProductUrl';
  import { CmsProductUrl } from '@/api/cms/cmsProductUrl/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import {FileRecord} from "@/api/system/file/model";

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
    data?: CmsProductUrl | null;
    // 产品ID
    productId?: number;
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
  const form = reactive<CmsProductUrl>({
    id: undefined,
    productId: undefined,
    type: undefined,
    domain: undefined,
    account: undefined,
    password: undefined,
    qrcode: undefined,
    merchantId: undefined,
    comments: undefined,
    status: undefined,
    createTime: undefined,
    tenantId: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    type: [
      {
        required: true,
        type: 'string',
        message: '请填写按钮名称',
        trigger: 'blur'
      }
    ],
    domain: [
      {
        required: true,
        type: 'string',
        message: '请填写链接地址或上传图片',
        trigger: 'blur'
      }
    ]
  });

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
          ...form,
          productId: props?.productId
        };
        const saveOrUpdate = isUpdate.value ? updateCmsProductUrl : addCmsProductUrl;
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

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.qrcode = data.downloadUrl;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        images.value = [];
        if (props.data) {
          assignObject(form, props.data);
          if(props.data.qrcode){
            images.value.push({
              uid: Number(props.data.id),
              url: props.data.qrcode,
              status: 'done'
            });
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
