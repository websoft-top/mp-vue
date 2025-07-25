<!-- 节点编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改节点' : '添加节点'"
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
      <a-form-item label="名称" name="modules">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="shop"
          v-model:value="form.modules"
        />
      </a-form-item>
      <a-form-item label="节点URL" name="modulesUrl">
        <a-input
          allow-clear
          :maxlength="200"
          placeholder="https://shop.wsdns.cn"
          v-model:value="form.modulesUrl"
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
  import type { FormInstance, Rule, RuleObject } from 'ant-design-vue/es/form';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import { addModules, updateModules } from '@/api/system/modules';
  import type { Modules } from '@/api/system/modules/model';
  import { isChinese, urlReg } from 'ele-admin-pro';

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
    data?: Modules | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Modules>({
    id: undefined,
    modules: '',
    modulesUrl: '',
    comments: undefined
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    modules: [
      {
        required: true,
        type: 'string',
        trigger: 'blur',
        validator: async (_rule: RuleObject, value: string) => {
          if (!value) {
            return Promise.reject('请输入节点ID');
          } else if (isChinese(value)) {
            return Promise.reject('仅支持英文字母');
          } else {
            return Promise.resolve();
          }
        }
      }
    ],
    modulesUrl: [
      {
        required: true,
        message: '请输入正确的URL',
        pattern: urlReg,
        type: 'string',
        trigger: 'blur'
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
        if (isChinese(String(form.modules))) {
          return message.error('节点名称请使用英文字母');
        }
        const saveOrUpdate = isUpdate.value ? updateModules : addModules;
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
