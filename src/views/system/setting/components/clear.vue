<template>
  <a-card :bordered="false">
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-col="styleResponsive ? { md: 3, sm: 5, xs: 24 } : { flex: '90px' }"
      :wrapper-col="styleResponsive ? { md: 9, sm: 19, xs: 24 } : { flex: '1' }"
    >
<!--      <a-form-item label="缓存项目" name="clearCache">-->
<!--        <a-checkbox-group v-model:value="form.clearCache">-->
<!--          <a-checkbox value="setting">系统设置</a-checkbox>-->
<!--          <a-checkbox value="dict">数据字典</a-checkbox>-->
<!--          <a-checkbox value="category">商品分类</a-checkbox>-->
<!--          <a-checkbox value="temp">临时图片</a-checkbox>-->
<!--        </a-checkbox-group>-->
<!--      </a-form-item>-->
      <a-form-item label="操作">
        <a-button
          type="primary"
          class="ele-btn-icon"
          @click="save"
        >
          <span>更新缓存</span>
        </a-button>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { Setting } from '@/api/system/setting/model';
import { useThemeStore } from '@/store/modules/theme';
import { storeToRefs } from 'pinia';
import { FormInstance } from 'ant-design-vue/es/form';
import useFormData from '@/utils/use-form-data';
import { ItemType } from "ele-admin-pro/es/ele-image-upload/types";
import { uploadFile } from "@/api/system/file";
import { FILE_SERVER } from "@/config/setting";
import { listDictionaries } from "@/api/system/dict";

const props = defineProps<{
  // 当前选项卡
  value?: string;
  // 修改回显的数据
  data?: Setting | null;
}>();

// 保存字段信息(设定好key和描述,content里的字段是随意加的会自动转为json保存到数据库)
const settingId = ref(undefined);
const settingKey = ref('setting');
const comments = ref('系统设置');
// 是否开启响应式布局
const themeStore = useThemeStore();
const { styleResponsive } = storeToRefs(themeStore);
// 编辑器内容，双向绑定
const logo = ref<any>([]);
const value = ref('all')
// 是否是修改
const isUpdate = ref(false);
//
const formRef = ref<FormInstance | null>(null);
// 表单数据
const { form, resetFields, assignFields } = useFormData<Setting>({
  clearCache: 'setting,dict,category,temp',
  tenantId: localStorage.getItem('TenantId')
});

// 表单验证规则
const rules = reactive({
  clearCache: [
    {
      required: true,
      message: '请选择要清楚的项',
      type: 'string',
      trigger: 'blur'
    }
  ]
});

const onUpload = (d: ItemType) => {
  uploadFile(<File>d.file)
    .then((result) => {
      form.logo = result.path;
      message.success('上传成功');
    })
    .catch((e) => {
      message.error(e.message);
    });
};

const selectAll = (e) => {
  // if (e.target.value === 'all') {
  //   form.clearCache = '"all","setting","dict","category","temp"'
  // }
}
const onClose = () => {
  form.logo = undefined
}



/* 保存编辑 */
const save = () => {
  // 清除字典缓存
  listDictionaries().then(data => {
    data?.map(d => {
      localStorage.removeItem("__" + d.dictCode + "__");
    })
  })
  message.success('更新成功');
};

watch(
  () => props.data,
  (data) => {
    if(data?.settingId){
      isUpdate.value = true
      // 表单赋值
      if(data.content){
        const jsonData = JSON.parse(data.content);
        assignFields(jsonData);
      }
      // 其他必要参数
      form.settingId = data.settingId
      form.settingKey = data.settingKey
    } else {
      // 新增
      isUpdate.value = false
      resetFields();
      form.settingKey = props.value
    }
  }
);
</script>
