<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="500"
    :visible="visible"
    :maskClosable="false"
    :title="isUpdate ? '编辑字段' : '添加字段'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 4 }, sm: { span: 4 }, xs: { span: 24 } }"
      :wrapper-col="{ md: { span: 21 }, sm: { span: 22 }, xs: { span: 24 } }"
    >
      <a-form-item label="键名" name="name">
        <a-input allow-clear placeholder="KEY" v-model:value="form.name" />
      </a-form-item>
      <a-form-item label="参数值" name="value">
        <a-input allow-clear placeholder="VALUE" v-model:value="form.value" />
      </a-form-item>
      <a-form-item label="(选填)">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="描述" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="备注"
          v-model:value="form.comments"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { CmsWebsiteField } from '@/api/cms/cmsWebsiteField/model';
  import useFormData from '@/utils/use-form-data';
  import { addCmsWebsiteField, updateCmsWebsiteField } from '@/api/cms/cmsWebsiteField';
  import { message } from 'ant-design-vue/es';
  import { removeSiteInfoCache } from '@/api/cms/CmsWebsite';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FileRecord } from '@/api/system/file/model';
  import { uuid } from 'ele-admin-pro';

  // 是否是修改
  const isUpdate = ref(false);

  const props = defineProps<{
    // 弹窗是否打开
    visible: boolean;
    websiteId: number | null | undefined;
    // 修改回显的数据
    data?: CmsWebsiteField | null;
  }>();

  const emit = defineEmits<{
    (e: 'done'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  // 提交状态
  const loading = ref(false);
  const images = ref<ItemType[]>([]);
  const formRef = ref<FormInstance | null>(null);

  const { form, resetFields, assignFields } = useFormData<CmsWebsiteField>({
    id: undefined,
    name: undefined,
    value: undefined,
    comments: '',
    sortNumber: 100
  });

  // 表单验证规则
  const rules = reactive({
    value: [
      {
        required: true,
        type: 'string',
        message: '请填写参数值'
      }
    ],
    name: [
      {
        required: true,
        type: 'string',
        message: '请输入参数名称(英语)'
      }
    ]
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  const chooseImage = (data: FileRecord) => {
    images.value.push({
      uid: data.id,
      url: data.path,
      status: 'done'
    });
    form.value = data.downloadUrl;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.value = '';
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
        const data = {
          ...form,
          name: form.name?.toUpperCase(),
          websiteId: props.websiteId
        };
        const saveOrUpdate = isUpdate.value
          ? updateCmsWebsiteField
          : addCmsWebsiteField;

        saveOrUpdate(data)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            updateVisible(false);
            // 清除缓存
            removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId'));
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
          assignFields(props.data);
          form.comments = props.data.comments;
          images.value.push({
            uid: uuid(),
            url: props.data.value,
            status: 'done'
          });
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
