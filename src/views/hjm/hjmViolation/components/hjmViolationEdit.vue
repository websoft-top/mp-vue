<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑违章' : '添加违章'"
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
      <a-form-item label="车辆编号" name="code">
        <a-input
          allow-clear
          placeholder="请输入车辆编号"
          v-model:value="form.code"
        />
      </a-form-item>
      <a-form-item label="标题" name="title">
        <a-input
          allow-clear
          placeholder="请输入标题"
          v-model:value="form.title"
        />
      </a-form-item>
      <a-form-item label="违章内容" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入违章描述"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="处罚金额" name="money">
        <a-input-number
          allow-clear
          max="300"
          style="width: 200px"
          placeholder="请输入处罚金额"
          v-model:value="form.money"
        />
      </a-form-item>
      <a-form-item label="扣分" name="score">
        <a-input-number
          allow-clear
          max="12"
          style="width: 200px"
          placeholder="请输入扣分"
          v-model:value="form.score"
        />
      </a-form-item>
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">未处理</a-radio>
          <a-radio :value="1">已处理</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addHjmViolation, updateHjmViolation } from '@/api/hjm/hjmViolation';
  import { HjmViolation } from '@/api/hjm/hjmViolation/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import {getHjmCarByCode} from "@/api/hjm/hjmCar";

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
    data?: HjmViolation | null;
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
  const form = reactive<HjmViolation>({
    id: undefined,
    code: undefined,
    title: undefined,
    categoryId: undefined,
    money: undefined,
    score: undefined,
    adminId: undefined,
    userId: undefined,
    tenantId: undefined,
    createTime: undefined,
    updateTime: undefined,
    status: 0,
    comments: '',
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    code: [
      {
        required: true,
        type: 'string',
        message: '请填写车辆编号',
        trigger: 'blur'
      }
    ],
    title: [
      {
        required: true,
        type: 'string',
        message: '请填写标题',
        trigger: 'blur'
      }
    ],
    comments: [
      {
        required: true,
        type: 'string',
        message: '请填写违章描述',
        trigger: 'blur'
      }
    ]
  });

  const { resetFields } = useForm(form, rules);

  /* 保存编辑 */
  const save = async () => {
    if (!formRef.value) {
      return;
    }
    getHjmCarByCode(`${form.code}`).then(res => {
      console.log(res,'909090')
      // const car = res.data;
    });

    formRef.value
      .validate()
      .then(() => {
        loading.value = true;
        const formData = {
          ...form
        };
        const saveOrUpdate = isUpdate.value ? updateHjmViolation : addHjmViolation;
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
