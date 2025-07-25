<!-- 订单编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改订单' : '添加订单'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 5, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 19, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="选择客户" name="companyId">
        <SelectCompany v-model:value="form.tenantName" @done="onCompany" />
      </a-form-item>
      <a-form-item label="支付金额" name="money">
        <a-input-number
          allow-clear
          max="1000000"
          style="width: 200px"
          placeholder="请输入订单金额"
          v-model:value="form.money"
        />
      </a-form-item>
      <a-form-item label="到期时间" name="days">
        <a-date-picker
          v-model:value="form.expirationTime"
          show-time
          placeholder="到期时间"
          value-format="YYYY-MM-DD HH:mm:ss"
        />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入备注"
          v-model:value="form.comments"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { message } from 'ant-design-vue/es';
  import type { FormInstance, Rule } from 'ant-design-vue/es/form';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import { urlReg } from 'ele-admin-pro';
  import { Order } from '@/api/system/order/model';
  import { addOrder, updateOrder } from '@/api/system/order';
  import { Company } from '@/api/system/company/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: Order | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Order>({
    orderId: undefined,
    money: undefined,
    companyName: '',
    companyId: 0,
    tenantId: undefined,
    tenantName: '',
    comments: undefined
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    companyId: [
      {
        required: true,
        message: '请选择客户',
        pattern: urlReg,
        type: 'number',
        trigger: 'blur'
      }
    ],
    money: [
      {
        required: true,
        message: '请输入订单金额',
        type: 'number',
        trigger: 'blur'
      }
    ]
  });

  const onCompany = (item: Company) => {
    console.log(item);
    form.companyId = item.companyId;
    form.tenantName = item.tenantName;
    form.tenantId = item.tenantId;
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
        const saveOrUpdate = isUpdate.value ? updateOrder : addOrder;
        saveOrUpdate(form)
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

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  watch(
    () => props.visible,
    (visible) => {
      if (visible) {
        if (props.data) {
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    }
  );
</script>
