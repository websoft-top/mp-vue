<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="550"
    :visible="visible"
    :maskClosable="false"
    :title="isUpdate ? '编辑白名单' : '添加白名单'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 5, sm: 7, xs: 24 } : { flex: '90px' }"
      :wrapper-col="
        styleResponsive ? { md: 18, sm: 19, xs: 24 } : { flex: '1' }
      "
    >
      <a-form-item label="https://" name="domain">
        <a-input
          allow-clear
          :maxlength="100"
          placeholder="example.com"
          v-model:value="form.domain"
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
  import { message } from 'ant-design-vue';
  import { addWhiteDomain, updateWhiteDomain } from '@/api/system/white-domain';
  import { WhiteDomain } from '@/api/system/white-domain/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { FormInstance, type Rule, RuleObject } from 'ant-design-vue/es/form';
  import useFormData from '@/utils/use-form-data';
  import { isUrl } from 'ele-admin-pro';

  // 是否是修改
  const isUpdate = ref(false);
  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: WhiteDomain | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 提交状态
  const loading = ref(false);
  // 表格选中数据
  const formRef = ref<FormInstance | null>(null);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<WhiteDomain>({
    id: undefined,
    domain: '',
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
    domain: [
      {
        required: true,
        type: 'string',
        message: '请输入合法域名',
        trigger: 'blur',
        validator: (_rule: Rule, value: string) => {
          return new Promise<void>((resolve, reject) => {
            if (!isUrl(`https://${value}`)) {
              return reject('请输入合法域名');
            }
            return resolve();
          });
        }
      }
    ]
  });

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
        const saveOrUpdate = isUpdate.value
          ? updateWhiteDomain
          : addWhiteDomain;
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
          assignFields(props.data);
          isUpdate.value = true;
        } else {
          isUpdate.value = false;
        }
      } else {
        resetFields();
        formRef.value?.clearValidate();
      }
    },
    { immediate: true }
  );
</script>
