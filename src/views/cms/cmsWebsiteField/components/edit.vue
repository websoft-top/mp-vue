<!-- 用户编辑弹窗 -->
<template>
  <ele-modal
    :width="650"
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
      :wrapper-col="{ md: { span: 19 }, sm: { span: 20 }, xs: { span: 24 } }"
    >
      <a-form-item label="字段名称" name="name">
        <div class="w-full flex justify-between">
          <a-input
            allow-clear
            :maxlength="100"
            placeholder="siteName"
            class="px-5 mr-2"
            v-model:value="form.name"
          />
          <SelectWebsiteField
            :placeholder="`从模板选择`"
            class="input-item"
            v-model:value="form.name"
            @done="chooseData"
          />
        </div>
      </a-form-item>
      <a-form-item label="字段类型" name="type">
        <a-space direction="vertical" class="w-full">
          <div class="p-1">
            <a-radio-group v-model:value="form.type">
              <a-radio :value="0">文本</a-radio>
              <a-radio :value="1">图片</a-radio>
              <a-radio :value="2">视频</a-radio>
            </a-radio-group>
          </div>
          <template v-if="form.type == 1">
            <SelectFile
              :placeholder="`请选择图片`"
              :limit="1"
              :type="`image`"
              :data="images"
              @done="chooseImage"
              @del="onDeleteItem"
            />
            <div class="pt-2 text-gray-400">
              请选择或上传图片
            </div>
          </template>
          <template v-if="form.type == 2">
            <SelectFile
              :placeholder="`请选择视频`"
              :limit="1"
              :type="`video`"
              :data="images"
              @done="chooseImage"
              @del="onDeleteItem"
            />
            <div class="pt-2 text-gray-400">
              请选择或上传视频
            </div>
          </template>
        </a-space>
      </a-form-item>
      <a-form-item label="字段内容" name="value">
        <a-textarea
          :rows="4"
          :maxlength="2000"
          placeholder="XXXX有限公司"
          v-model:value="form.value"
        />
      </a-form-item>
      <a-form-item label="字段描述" name="comments">
        <a-textarea
          :rows="2"
          :maxlength="200"
          placeholder="网站名称"
          v-model:value="form.comments"
        />
      </a-form-item>
      <a-form-item label="CSS样式" name="style">
        <a-input
          allow-clear
          placeholder="CSS样式"
          v-model:value="form.style"
        />
        <div class="pt-2">
          <a class="text-sm text-gray-500" href="https://www.tailwindcss.cn/docs/installation" target="_blank">Tailwind Css使用教程</a>
        </div>
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
  import { useI18n } from 'vue-i18n';
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
  const formRef = ref<FormInstance | null>(null);// 国际化
  const { locale } = useI18n();

  const { form, resetFields, assignFields } = useFormData<CmsWebsiteField>({
    id: undefined,
    type: 0,
    template: undefined,
    name: undefined,
    value: undefined,
    modifyRange: undefined,
    defaultValue: undefined,
    comments: '',
    style: '',
    lang: '',
    sortNumber: 100
  });

  // 表单验证规则
  const rules = reactive({
    name: [
      {
        required: true,
        type: 'string',
        message: '请输入字段名称(英语)'
      }
    ],
    type: [
      {
        required: true,
        type: 'number',
        message: '请选择字段类型'
      }
    ],
    value: [
      {
        required: true,
        type: 'string',
        message: '请填写字段值'
      }
    ]
    // comments: [
    //   {
    //     required: true,
    //     type: 'string',
    //     message: '请输入字段'
    //   }
    // ],
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
    form.name = data.name;
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
          websiteId: props.websiteId,
          lang: locale.value
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
            if (form.name == 'i18n') {
              localStorage.setItem('i18n','1');
              window.location.reload();
            }
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
