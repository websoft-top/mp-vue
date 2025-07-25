<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑等级' : '添加等级'"
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
      <a-form-item label="等级名称" name="name">
        <a-input
          allow-clear
          placeholder="请输入等级名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="等级权重" name="weight">
        <a-input
          allow-clear
          placeholder="请输入等级权重"
          v-model:value="form.weight"
        />
      </a-form-item>
      <a-form-item label="升级条件" name="upgrade">
        <a-input
          allow-clear
          placeholder="请输入升级条件"
          v-model:value="form.upgrade"
        />
      </a-form-item>
      <a-form-item label="会员权益" name="equity">
        <a-input
          allow-clear
          placeholder="请输入会员权益"
          v-model:value="form.equity"
        />
      </a-form-item>
      <a-form-item label="备注" name="comments">
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
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addGrade, updateGrade } from '@/api/system/user-grade';
  import { Grade } from '@/api/user/grade/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { FormInstance } from 'ant-design-vue/es/form';

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
    data?: Grade | null;
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

  // 用户信息
  const form = reactive<Grade>({
    gradeId: undefined,
    name: '',
    weight: undefined,
    upgrade: undefined,
    equity: '',
    status: undefined,
    comments: undefined,
    sortNumber: undefined,
    userId: undefined,
    createTime: '',
    updateTime: ''
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
        message: '请输入等级名称',
        trigger: 'blur'
      }
    ],
    weight: [
      {
        required: true,
        type: 'string',
        message: '请输入等级权重',
        trigger: 'blur'
      }
    ],
    upgrade: [
      {
        required: true,
        type: 'string',
        message: '请输入升级条件',
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
        const saveOrUpdate = isUpdate.value ? updateGrade : addGrade;
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
        if (props.data) {
          assignObject(form, props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
      }
    }
  );
</script>
