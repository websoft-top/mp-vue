<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑页面' : '添加页面'"
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
      <a-form-item label="上级分类" name="parentId">
        <a-tree-select
          allow-clear
          :tree-data="pages"
          tree-default-expand-all
          placeholder="请选择上级分类"
          :value="form.parentId || undefined"
          :dropdown-style="{ maxHeight: '360px', overflow: 'auto' }"
          @update:value="(value?: number) => (form.parentId = value)"
        />
      </a-form-item>
      <a-form-item label="页面名称" name="title">
        <a-input
          allow-clear
          placeholder="商品详情"
          v-model:value="form.title"
        />
      </a-form-item>
      <a-form-item label="页面路径" name="path" :extra="pathExtra">
        <a-input
          allow-clear
          placeholder="/package/goods/detail"
          v-model:value="form.path"
        />
      </a-form-item>
      <a-form-item label="分包" name="subpackage">
        <DictSelect
          dict-code="mpPackage"
          :placeholder="`选择分包`"
          style="width: 200px"
          v-model:value="form.subpackage"
          @done="chooseSubpackage"
        />
      </a-form-item>
      <a-form-item label="图标" name="icon">
        <SelectFile
          :placeholder="`请选择图标`"
          :limit="2"
          :data="icon"
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
      <a-form-item label="备注" name="comments">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入描述"
          v-model:value="form.comments"
        />
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
import {ref, reactive, watch} from 'vue';
import {Form, message} from 'ant-design-vue';
import {assignObject, uuid} from 'ele-admin-pro';
import {addCmsMpPages, updateCmsMpPages} from '@/api/cms/cmsMpPages';
import {CmsMpPages} from '@/api/cms/cmsMpPages/model';
import {useThemeStore} from '@/store/modules/theme';
import {storeToRefs} from 'pinia';
import {ItemType} from 'ele-admin-pro/es/ele-image-upload/types';
import {FormInstance} from 'ant-design-vue/es/form';
import {FileRecord} from '@/api/system/file/model';
import {DictData} from "@/api/system/dict-data/model";

// 是否是修改
const isUpdate = ref(false);
const useForm = Form.useForm;
// 是否开启响应式布局
const themeStore = useThemeStore();
const {styleResponsive} = storeToRefs(themeStore);

const props = defineProps<{
  // 弹窗是否打开
  visible: boolean;
  // 上级分类id
  parentId?: number;
  // 分包名称
  packageName?: string;
  // 修改回显的数据
  data?: CmsMpPages | null;
  // 页面列表
  pages?: CmsMpPages[] | null;
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
const icon = ref<ItemType[]>([]);
const selectedIconPath = ref<ItemType[]>([]);
const pathExtra = ref<string>()

// 用户信息
const form = reactive<CmsMpPages>({
  id: undefined,
  parentId: undefined,
  title: undefined,
  path: undefined,
  home: undefined,
  subpackage: undefined,
  icon: undefined,
  iconPath: '',
  selectedIconPath: '',
  sortNumber: 100,
  comments: undefined,
  status: undefined
});

/* 更新visible */
const updateVisible = (value: boolean) => {
  emit('update:visible', value);
};

// 表单验证规则
const rules = reactive({
  title: [
    {
      required: true,
      type: 'string',
      message: '页面名称',
      trigger: 'blur'
    }
  ],
  path: [
    {
      required: true,
      type: 'string',
      message: '请填写路径',
      trigger: 'blur'
    }
  ],
  subpackage: [
    {
      required: true,
      type: 'string',
      message: '请选择分包',
      trigger: 'blur'
    }
  ]
});

const chooseFile = (data: FileRecord) => {
  icon.value.push({
    uid: data.id,
    url: data.downloadUrl,
    status: 'done'
  });
};

const onDeleteItem = (index: number) => {
  icon.value.splice(index, 1);
};

const chooseSubpackage = (item: DictData) => {
  form.subpackage = item.dictDataCode;
  form.path = `/${form.subpackage}/`;
  pathExtra.value = `请补填完整的页面路径`
}

const {resetFields} = useForm(form, rules);

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
        ...form,
        icon: JSON.stringify(icon.value)
      };
      const saveOrUpdate = isUpdate.value ? updateCmsMpPages : addCmsMpPages;
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
    .catch(() => {
    });
};

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      icon.value = [];
      if (props.parentId) {
        form.parentId = props.parentId;
      }
      if (props.data) {
        assignObject(form, props.data);
        if(props.data.icon){
          const arr = JSON.parse(props.data.icon);
          arr.map(d => {
            icon.value.push({
              uid: uuid(),
              url: d.url,
              status: 'done'
            });
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
  {immediate: true}
);
</script>

<script lang="ts">
import * as icons from '@/layout/menu-icons';

export default {
  components: icons,
  data() {
    return {
      iconData: [
        {
          title: '已引入的图标',
          icons: Object.keys(icons)
        }
      ]
    };
  }
};
</script>
