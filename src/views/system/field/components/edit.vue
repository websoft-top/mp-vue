<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="600"
    :visible="visible"
    :maskClosable="false"
    :title="isUpdate ? '编辑参数' : '添加参数'"
    :body-style="{ paddingBottom: '28px' }"
    @update:visible="updateVisible"
    @ok="save"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="{ md: { span: 3 }, sm: { span: 4 }, xs: { span: 24 } }"
      :wrapper-col="{ md: { span: 21 }, sm: { span: 22 }, xs: { span: 24 } }"
    >
      <a-form-item label="参数" name="comments">
        <a-input
          allow-clear
          :maxlength="100"
          placeholder="网站名称"
          v-model:value="form.comments"
          @pressEnter="save"
        />
      </a-form-item>
      <a-form-item label="调用" name="name">
        <SelectWebsiteField
          :placeholder="`可配置参数`"
          class="input-item"
          v-model:value="form.name"
          @done="chooseData"
        />
      </a-form-item>
      <a-form-item label="配置值" name="value">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="网站名称"
          v-model:value="form.value"
        />
      </a-form-item>
      <a-form-item label="css样式" name="style">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="css样式"
          v-model:value="form.style"
        />
      </a-form-item>
      <a-form-item label="图片">
        <SelectFile
          :placeholder="`请选择图片`"
          :limit="1"
          :data="images"
          @done="chooseImage"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="排序" name="sortNumber">
        <a-input-number
          :min="0"
          :max="99999"
          placeholder="请输入排序号"
          v-model:value="form.sortNumber"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { FormInstance } from 'ant-design-vue/es/form';
  import useFormData from '@/utils/use-form-data';
  import {
    addCmsWebsiteField,
    updateCmsWebsiteField
  } from '@/api/cms/cmsWebsiteField';
  import { message } from 'ant-design-vue/es';
  import { removeSiteInfoCache } from '@/api/cms/cmsWebsite';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FileRecord } from '@/api/system/file/model';
  import { uuid } from 'ele-admin-pro';
  import { CmsWebsiteField } from '@/api/cms/cmsWebsiteField/model';

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
    type: 0,
    name: undefined,
    value: undefined,
    modifyRange: undefined,
    defaultValue: undefined,
    comments: '',
    style: '',
    status: 0,
    sortNumber: 100
  });

  // 表单验证规则
  const rules = reactive({
    name: [
      {
        required: true,
        type: 'string',
        message: '请输入参数名称(英语)'
      }
    ],
    // comments: [
    //   {
    //     required: true,
    //     type: 'string',
    //     message: '请输入描述'
    //   }
    // ],
    value: [
      {
        required: true,
        type: 'string',
        message: '请填写参数值'
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
    form.type = 1;
  };

  const onDeleteItem = (index: number) => {
    images.value.splice(index, 1);
    form.type = 0;
  };

  const chooseData = (data: CmsWebsiteField) => {
    assignFields(data);
    form.value = data.defaultValue;
    if (data.type == 1) {
      images.value.push({
        uid: `${data.id}`,
        url: data.defaultValue,
        status: 'done'
      });
    }
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
          // name: form.name?.toUpperCase(),
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
          if (form.type == 1) {
            images.value.push({
              uid: uuid(),
              url: props.data.value,
              status: 'done'
            });
          }
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
