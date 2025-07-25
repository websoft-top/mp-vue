<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '绑定域名' : '绑定域名'"
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
      <a-form-item label="绑定域名" name="domain">
        <a-input
          allow-clear
          placeholder="请输入已备案的域名"
          v-model:value="form.domain"
        />
      </a-form-item>
      <a-form-item label="主机记录" name="hostName" v-if="isUpdate">
        <a-input
          allow-clear
          placeholder="请输入主机记录"
          disabled
          v-model:value="form.hostName"
        />
      </a-form-item>
      <a-form-item label="记录值" name="hostValue" v-if="isUpdate">
        <a-input
          allow-clear
          placeholder="请输入记录值"
          disabled
          v-model:value="form.hostValue"
        />
      </a-form-item>
<!--      <a-form-item label="状态" name="status">-->
<!--        <a-radio-group v-model:value="form.status">-->
<!--          <a-radio :value="0">显示</a-radio>-->
<!--          <a-radio :value="1">隐藏</a-radio>-->
<!--        </a-radio-group>-->
<!--      </a-form-item>-->
      <a-form-item label="排序号" v-if="isUpdate" name="sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsDomain, updateCmsDomain } from '@/api/cms/cmsDomain';
  import { CmsDomain } from '@/api/cms/cmsDomain/model';
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
    data?: CmsDomain | null;
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
  const form = reactive<CmsDomain>({
    id: undefined,
    type: undefined,
    domain: undefined,
    hostName: undefined,
    hostValue: undefined,
    status: undefined,
    sortNumber: 100,
    websiteId: undefined,
    appId: undefined,
    userId: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    cmsDomainName: [
      {
        required: true,
        type: 'string',
        message: '请填写网站域名记录表名称',
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
          websiteId: Number(localStorage.getItem('WebsiteId'))
        };
        const saveOrUpdate = isUpdate.value ? updateCmsDomain : addCmsDomain;
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
