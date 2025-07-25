<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑捐款记录' : '添加捐款记录'"
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
      <a-form-item label="年龄" name="age">
        <a-input
          allow-clear
          placeholder="请输入年龄"
          v-model:value="form.age"
        />
      </a-form-item>
      <a-form-item label="姓名" name="name">
        <a-input
          allow-clear
          placeholder="请输入姓名"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="性别 1男 2女" name="sex">
        <a-input
          allow-clear
          placeholder="请输入性别 1男 2女"
          v-model:value="form.sex"
        />
      </a-form-item>
      <a-form-item label="手机号码" name="phone">
        <a-input
          allow-clear
          placeholder="请输入手机号码"
          v-model:value="form.phone"
        />
      </a-form-item>
      <a-form-item label="班级" name="className">
        <a-input
          allow-clear
          placeholder="请输入班级"
          v-model:value="form.className"
        />
      </a-form-item>
      <a-form-item label="年级" name="gradeName">
        <a-input
          allow-clear
          placeholder="请输入年级"
          v-model:value="form.gradeName"
        />
      </a-form-item>
      <a-form-item label="居住地址" name="address">
        <a-input
          allow-clear
          placeholder="请输入居住地址"
          v-model:value="form.address"
        />
      </a-form-item>
      <a-form-item label="工作单位" name="workUnit">
        <a-input
          allow-clear
          placeholder="请输入工作单位"
          v-model:value="form.workUnit"
        />
      </a-form-item>
      <a-form-item label="职务" name="position">
        <a-input
          allow-clear
          placeholder="请输入职务"
          v-model:value="form.position"
        />
      </a-form-item>
      <a-form-item label="捐赠证书" name="certificate">
        <a-input
          allow-clear
          placeholder="请输入捐赠证书"
          v-model:value="form.certificate"
        />
      </a-form-item>
      <a-form-item label="排序(数字越小越靠前)" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
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
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addBszxPay, updateBszxPay } from '@/api/bszx/bszxPay';
  import { BszxPay } from '@/api/bszx/bszxPay/model';
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
    data?: BszxPay | null;
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
  const form = reactive<BszxPay>({
    id: undefined,
    age: undefined,
    name: undefined,
    sex: undefined,
    phone: undefined,
    className: undefined,
    gradeName: undefined,
    address: undefined,
    workUnit: undefined,
    position: undefined,
    number: undefined,
    extra: undefined,
    dateTime: undefined,
    certificate: undefined,
    formData: undefined,
    formId: undefined,
    userId: undefined,
    comments: undefined,
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
    appBszxPayName: [
      {
        required: true,
        type: 'string',
        message: '请填写应用-百色中学-捐款记录名称',
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
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateBszxPay : addBszxPay;
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
