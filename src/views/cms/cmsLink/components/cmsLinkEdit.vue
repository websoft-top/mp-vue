<!-- 链接编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改链接' : '添加链接'"
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
      <a-form-item label="名称" name="name">
        <a-input
          allow-clear
          :maxlength="50"
          placeholder="链接名称"
          v-model:value="form.name"
        />
      </a-form-item>
      <a-form-item label="网址" name="url">
        <a-input
          v-model:value="form.url"
          placeholder="websoft.top"
        >
          <template #addonBefore>
            <a-select v-model:value="before" style="width: 90px">
              <a-select-option value="https://">https://</a-select-option>
              <a-select-option value="http://">http://</a-select-option>
            </a-select>
          </template>
        </a-input>
      </a-form-item>
<!--      <a-form-item label="选择栏目" name="categoryId">-->
<!--        <a-tree-select-->
<!--          allow-clear-->
<!--          :tree-data="navigationList"-->
<!--          tree-default-expand-all-->
<!--          placeholder="请选择栏目"-->
<!--          :value="form.categoryId || undefined"-->
<!--          :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"-->
<!--          @update:value="(value?: number) => (form.categoryId = value)"-->
<!--          @change="onCategoryId"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="图标" name="icon">
        <SelectFile
          :placeholder="`请选择图标`"
          :limit="1"
          :data="images"
          :width="50"
          :height="50"
          @done="chooseFile"
          @del="onDeleteItem"
        />
      </a-form-item>
      <a-form-item label="排序" name="sortNumber">
        <a-input-number
          :min="0"
          :max="99999"
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
import { message } from 'ant-design-vue/es';
import type { FormInstance, Rule } from 'ant-design-vue/es/form';
import { storeToRefs } from 'pinia';
import { useThemeStore } from '@/store/modules/theme';
import useFormData from '@/utils/use-form-data';
import { addCmsLink, updateCmsLink } from '@/api/cms/cmsLink';
import type { CmsLink } from '@/api/cms/cmsLink/model';
import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
import { uploadFile } from '@/api/system/file';
import { FileRecord } from '@/api/system/file/model';
import { CmsNavigation } from '@/api/cms/cmsNavigation/model';
import {getLang} from "@/utils/common";

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
  data?: CmsLink | null;
  navigationList?: CmsNavigation[];
}>();

//
const formRef = ref<FormInstance | null>(null);
// 是否是修改
const isUpdate = ref(false);
// 已上传数据
const images = ref<ItemType[]>([]);
// 提交状态
const loading = ref(false);
const before = ref<string>('https://');

// 表单数据
const { form, resetFields, assignFields } = useFormData<CmsLink>({
  id: undefined,
  name: '',
  url: '',
  sortNumber: 100,
  lang: getLang(),
  categoryId: undefined,
  comments: undefined
});

// 表单验证规则
const rules = reactive<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      type: 'string',
      trigger: 'blur'
    }
  ],
  url: [
    {
      required: true,
      message: '请输入正确的URL',
      type: 'string',
      trigger: 'blur'
    }
  ]
});

// 上传文件
const onUpload = (item: any) => {
  const { file } = item;
  uploadFile(file)
    .then((data) => {
      images.value.push({
        uid: data.id,
        url: data.url,
        status: 'done'
      });
      form.icon = data.url;
      message.success('上传成功');
    })
    .catch((e) => {
      message.error(e.message);
    });
};

/* 上传事件 */
const uploadHandler = (file: File) => {
  const item: ItemType = {
    file,
    uid: (file as any).uid,
    name: file.name
  };
  if (file.size / 1024 / 1024 > 1) {
    message.error('大小不能超过 1MB');
    return;
  }
  onUpload(item);
};

const chooseFile = (data: FileRecord) => {
  images.value.push({
    uid: data.id,
    url: data.path,
    status: 'done'
  });
  form.icon = data.path;
};

const onDeleteItem = (index: number) => {
  images.value.splice(index, 1);
  form.icon = '';
};

// 选择栏目
const onCategoryId = (id: number) => {
  form.categoryId = id;
};

/* 保存编辑 */
const save = () => {
  if (!formRef.value) {
    return;
  }
  console.log(form,'fff>');
  formRef.value
    .validate()
    .then(() => {
      loading.value = true;
      const saveOrUpdate = isUpdate.value ? updateCmsLink : addCmsLink;
      form.url = `${before.value}${form.url}`;
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
        images.value = [];
        if (props.data.icon) {
          images.value.push({
            uid: 1,
            url: props.data.icon,
            status: 'done'
          });
        }
        if(props.data.url?.startsWith('https://')){
          before.value = 'https://';
          form.url = props.data.url.replace('https://', '');
        }
        if(props.data.url?.startsWith('http://')){
          before.value = 'http://';
          form.url = props.data.url.replace('http://', '');
        }
        isUpdate.value = true;
      } else {
        images.value = [];
        isUpdate.value = false;
      }
    } else {
      resetFields();
      formRef.value?.clearValidate();
    }
  }
);
</script>
