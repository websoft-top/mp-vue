<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑应用参数' : '添加应用参数'"
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
      <a-form-item label="类型，0文本 1图片 2其他" name="type">
        <a-input
          allow-clear
          placeholder="请输入类型，0文本 1图片 2其他"
          v-model:value="form.type"
        />
      </a-form-item>
      <a-form-item label="名称" name="name">
        <a-input
          allow-clear
          placeholder="请输入名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="栏目ID" name="categoryId">
        <a-input
          allow-clear
          placeholder="请输入栏目ID"
          v-model:value="form.categoryId"
        />
      </a-form-item>
      <a-form-item label="默认值" name="defaultValue">
        <a-input
          allow-clear
          placeholder="请输入默认值"
          v-model:value="form.defaultValue"
        />
      </a-form-item>
      <a-form-item label="可修改的值 [on|off]" name="modifyRange">
        <a-input
          allow-clear
          placeholder="请输入可修改的值 [on|off]"
          v-model:value="form.modifyRange"
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
      <a-form-item label="css样式" name="style">
        <a-input
          allow-clear
          placeholder="请输入css样式"
          v-model:value="form.style"
        />
      </a-form-item>
      <a-form-item label="名称" name="value">
        <a-input
          allow-clear
          placeholder="请输入名称"
          v-model:value="form.value"
        />
      </a-form-item>
      <a-form-item label="语言" name="lang">
        <a-input
          allow-clear
          placeholder="请输入语言"
          v-model:value="form.lang"
        />
      </a-form-item>
      <a-form-item label="商户ID" name="merchantId">
        <a-input
          allow-clear
          placeholder="请输入商户ID"
          v-model:value="form.merchantId"
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
      <a-form-item label="是否删除, 0否, 1是" name="deleted">
        <a-input
          allow-clear
          placeholder="请输入是否删除, 0否, 1是"
          v-model:value="form.deleted"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsWebsiteField, updateCmsWebsiteField } from '@/api/cms/cmsWebsiteField';
  import { CmsWebsiteField } from '@/api/cms/cmsWebsiteField/model';
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
    data?: CmsWebsiteField | null;
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
  const form = reactive<CmsWebsiteField>({
    id: undefined,
    type: undefined,
    name: undefined,
    categoryId: undefined,
    defaultValue: undefined,
    modifyRange: undefined,
    comments: undefined,
    style: undefined,
    value: undefined,
    lang: undefined,
    merchantId: undefined,
    sortNumber: undefined,
    deleted: undefined,
    tenantId: undefined,
    createTime: undefined,
    cmsWebsiteFieldId: undefined,
    cmsWebsiteFieldName: '',
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
    cmsWebsiteFieldName: [
      {
        required: true,
        type: 'string',
        message: '请填写应用参数名称',
        trigger: 'blur'
      }
    ]
  });

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.image = data.path;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.image = '';
  };

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
        const saveOrUpdate = isUpdate.value ? updateCmsWebsiteField : addCmsWebsiteField;
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
          if(props.data.image){
            images.value.push({
              uid: uuid(),
              url: props.data.image,
              status: 'done'
            })
          }
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
