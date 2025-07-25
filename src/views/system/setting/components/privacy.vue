<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
      <a-form-item label="允许被搜索" name="name" extra="关闭后，用户无法通过名称搜索到此网站">
        <a-switch v-model:checked="form.searched" checked-children="允许" un-checked-children="不允许" @change="save" />
      </a-form-item>
      <a-form-item label="文章发布审核" name="articleReview" extra="开启需要审核后发布，关闭则直接发布">
        <a-switch v-model:checked="form.articleReview" checked-children="需要" un-checked-children="不需要" @change="save" />
      </a-form-item>
      <a-form-item label="开发者模式" name="plugin" extra="开启开发者模式">
        <a-switch v-model:checked="form.plugin" checked-children="启用" un-checked-children="禁用" @change="save" />
      </a-form-item>
      <a-form-item label="隐藏底部版权信息" name="showAdminCopyright">
        <a-switch v-model:checked="form.showAdminCopyright" checked-children="显示" un-checked-children="隐藏" @change="save" />
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {message} from 'ant-design-vue';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {FormInstance} from 'ant-design-vue/es/form';
import useFormData from '@/utils/use-form-data';
import {addSetting, updateSettingByKey} from "@/api/system/setting";
import {useWebsiteSettingStore} from "@/store/modules/setting";

const props = defineProps<{
  value?: string;
  // 修改回显的数据
  data?: any | null;
}>();

// 是否开启响应式布局
const themeStore = useThemeStore();
const settingStore = useWebsiteSettingStore();
const {styleResponsive} = storeToRefs(themeStore);
// 提交状态
const loading = ref(false);
// 是否是修改
const isUpdate = ref(false);
//
const formRef = ref<FormInstance | null>(null);
// 表单数据
const {form, resetFields, assignFields} = useFormData<any>({
  settingId: undefined,
  settingKey: 'privacy',
  searched:  undefined,
  showAdminCopyright: ''
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
      // 更新状态
      settingStore.setSetting(form)
      const appForm = {
        ...form,
        content: JSON.stringify(form)
      };
      const saveOrUpdate = isUpdate.value ? updateSettingByKey : addSetting;
      saveOrUpdate(appForm)
        .then(() => {
          message.success('保存成功');
        })
        .catch((e) => {
          message.error(e.message);
        });
    })
    .catch(() => {
    });
};

watch(
  () => props.data,
  (data) => {
    console.log(data,'propss')
    if (data?.settingKey) {
      isUpdate.value = true
      // 表单赋值
      assignFields(data);
    } else {
      // 新增
      isUpdate.value = false
      resetFields();
    }
  }
);
</script>
