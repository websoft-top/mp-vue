<!-- 字典编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改字典' : '添加字典'"
    :body-style="{ paddingBottom: '8px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      :label-col="{ md: { span: 5 }, sm: { span: 5 }, xs: { span: 24 } }"
      :wrapper-col="{ md: { span: 19 }, sm: { span: 19 }, xs: { span: 24 } }"
    >
      <a-form-item label="字典名称" v-bind="validateInfos.dictName">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入字典名称"
          v-model:value="form.dictName"
        />
      </a-form-item>
      <a-form-item label="字典标识" v-bind="validateInfos.dictCode">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入字典标识"
          v-model:value="form.dictCode"
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
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject } from 'ele-admin-pro';
  import { addDict, updateDict } from '@/api/system/dict';
  import type { Dict } from '@/api/system/dict/model';

  const useForm = Form.useForm;

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    // 修改回显的数据
    data?: Dict | null;
  }>();

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const form = reactive<Dict>({
    dictId: undefined,
    dictName: '',
    dictCode: '',
    sortNumber: 100,
    comments: ''
  });

  // 表单验证规则
  const rules = reactive({
    dictName: [
      {
        required: true,
        message: '请输入字典名称',
        type: 'string',
        trigger: 'blur'
      }
    ],
    dictCode: [
      {
        required: true,
        message: '请输入字典标识',
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
        const saveOrUpdate = isUpdate.value ? updateDict : addDict;
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
