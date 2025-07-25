<!-- 角色编辑弹窗 -->
<template>
  <ele-modal
    :width="600"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '编辑' : '上传文件'"
    :body-style="{ paddingBottom: '8px' }"
    okText="保存"
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
      <a-form-item label="文件名称" name="name">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入文件名称"
          v-model:value="form.name"
          @pressEnter="save"
        />
      </a-form-item>
      <a-form-item label="设置分组" name="name">
        <SelectDict
          dict-code="groupId"
          :placeholder="`选择分组`"
          v-model:value="form.groupName"
          @done="chooseGroupId"
        />
      </a-form-item>
      <a-form-item label="描述" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="图片描述"
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
  import type { FileRecord } from '@/api/system/file/model';
  import { addFiles, updateFiles } from '@/api/system/file';
  import { RuleObject } from 'ant-design-vue/es/form';
  import { DictData } from '@/api/system/dict-data/model';
  import { listDictData } from '@/api/system/dict-data';

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
    data?: FileRecord | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);
  const fileName = ref('');
  // 是否是修改
  const isUpdate = ref(false);
  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<FileRecord>({
    id: 0,
    name: '',
    comments: '',
    groupId: undefined,
    groupName: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    fileName: [
      {
        required: true,
        message: '请上传文件',
        type: 'string',
        trigger: 'blur',
        validator: async (_rule: RuleObject) => {
          if (!isUpdate.value && fileName.value.length == 0) {
            return Promise.reject('请上传文件');
          }
          return Promise.resolve();
        }
      }
    ],
    name: [
      {
        required: true,
        message: '请输入文件名称',
        type: 'string',
        trigger: 'blur'
      }
    ]
  });

  const chooseGroupId = (item: DictData) => {
    form.groupId = item.dictDataId;
    form.groupName = item.dictDataName;
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
        const saveOrUpdate = isUpdate.value ? updateFiles : addFiles;
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
          listDictData({ dictDataId: props.data.groupId }).then((data) => {
            if (data.length > 0) {
              form.groupName = data[0].dictDataName;
            }
          });
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
