<!-- 字典项编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :body-style="{ paddingBottom: '8px' }"
    :title="isUpdate ? '修改字典项' : '添加字典项'"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      :label-col="{ md: { span: 6 }, sm: { span: 6 }, xs: { span: 24 } }"
      :wrapper-col="{ md: { span: 18 }, sm: { span: 18 }, xs: { span: 24 } }"
    >
      <a-form-item label="字典项名称" v-bind="validateInfos.dictDataName">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入字典项名称"
          v-model:value="form.dictDataName"
        />
      </a-form-item>
      <a-form-item label="字典项值" v-bind="validateInfos.dictDataCode">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入字典项值"
          v-model:value="form.dictDataCode"
        />
      </a-form-item>
      <a-form-item label="排序号" v-bind="validateInfos.sortNumber">
        <a-input-number
          :min="0"
          :max="9999"
          class="ele-fluid"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
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
      <a-divider style="margin-bottom: 20px" />
      <a-form-item label="预留字段" v-bind="validateInfos.component">
        <a-input
          allow-clear
          :maxlength="100"
          placeholder="预设字段:组件路径(选填)"
          v-model:value="form.component"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import {
    addDictionaryData,
    updateDictionaryData
  } from '@/api/system/dictionary-data';
  import type { DictionaryData } from '@/api/system/dictionary-data/model';

  const useForm = Form.useForm;

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: DictionaryData | null;
    // 字典id
    dictId: number;
  }>();

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const form = reactive<DictionaryData>({
    dictDataId: undefined,
    dictDataName: '',
    dictDataCode: '',
    path: '',
    component: '',
    sortNumber: 100,
    comments: ''
  });

  // 表单验证规则
  const rules = reactive({
    dictDataName: [
      {
        required: true,
        message: '请输入字典项名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    dictDataCode: [
      {
        required: true,
        message: '请输入字典项值',
        type: 'string',
        trigger: 'blur'
      }
    ],
    sortNumber: [
      {
        required: true,
        message: '请输入排序号',
        type: 'number',
        trigger: 'blur'
      }
    ]
  });

  const { resetFields, validate, validateInfos } = useForm(form, rules);

  /* 保存编辑 */
  const save = () => {
    validate()
      .then(() => {
        loading.value = true;
        const saveOrUpdate = isUpdate.value
          ? updateDictionaryData
          : addDictionaryData;
        saveOrUpdate({
          ...form,
          dictId: props.dictId
        })
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
  const updateVisible = (value) => {
    emit('update:visible', value);
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
