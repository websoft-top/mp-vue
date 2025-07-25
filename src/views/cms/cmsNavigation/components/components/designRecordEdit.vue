<!-- 编辑弹窗 -->
<template>
  <ele-modal
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :maxable="maxable"
    :title="isUpdate ? '编辑组件' : '添加组件'"
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
      <!--      <a-form-item label="上级" name="parentId">-->
      <!--        <a-input-->
      <!--          allow-clear-->
      <!--          placeholder="请输入上级id, 0是顶级"-->
      <!--          v-model:value="form.parentId"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-form-item label="选择组件" name="dictCode">
        <SelectDictDictionary
          dict-code="componentsType"
          :placeholder="`选择组件`"
          v-model:value="form.dictCode"
          @done="chooseComponents"
        />
      </a-form-item>
      <!-- 公共字段 -->
      <a-form-item label="标题" name="title">
        <a-input allow-clear placeholder="标题" v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="样式" name="styles">
        <a-input allow-clear placeholder="样式" v-model:value="form.styles" />
      </a-form-item>
      <!-- 卡片 -->
      <!--      <template v-if="form.dictCode == 'Card'">-->
      <!--        <a-form-item label="标题" name="title">-->
      <!--          <a-input allow-clear placeholder="标题" v-model:value="form.title" />-->
      <!--        </a-form-item>-->
      <!--      </template>-->
      <!--      <a-form-item label="缩列图" name="photo">-->
      <!--        <a-input-->
      <!--          allow-clear-->
      <!--          placeholder="请输入缩列图"-->
      <!--          v-model:value="form.photo"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="用户ID" name="userId">-->
      <!--        <a-input-->
      <!--          allow-clear-->
      <!--          placeholder="请输入用户ID"-->
      <!--          v-model:value="form.userId"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="排序(数字越小越靠前)" name="sortNumber">-->
      <!--        <a-input-number-->
      <!--          :min="0"-->
      <!--          :max="9999"-->
      <!--          class="ele-fluid"-->
      <!--          placeholder="请输入排序号"-->
      <!--          v-model:value="form.sortNumber"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <!--      <a-form-item label="备注" name="comments">-->
      <!--        <a-textarea-->
      <!--          :rows="4"-->
      <!--          :maxlength="200"-->
      <!--          placeholder="请输入描述"-->
      <!--          v-model:value="form.comments"-->
      <!--        />-->
      <!--      </a-form-item>-->
      <a-form-item label="状态" name="status">
        <a-radio-group v-model:value="form.status">
          <a-radio :value="0">显示</a-radio>
          <a-radio :value="1">隐藏</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>
  </ele-modal>
</template>

<script lang="ts" setup>
  import { ref, reactive, watch } from 'vue';
  import { Form, message } from 'ant-design-vue';
  import { assignObject, uuid } from 'ele-admin-pro';
  import { addCmsDesignRecord, updateCmsDesignRecord } from '@/api/cms/cmsDesignRecord';
  import { CmsDesignRecord } from '@/api/cms/cmsDesignRecord/model';
  import { useThemeStore } from '@/store/modules/theme';
  import { storeToRefs } from 'pinia';
  import { ItemType } from 'ele-admin-pro/es/ele-image-upload/types';
  import { FormInstance } from 'ant-design-vue/es/form';
  import { FileRecord } from '@/api/system/file/model';
  import { DictionaryData } from '@/api/system/dictionary-data/model';

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
    data?: CmsDesignRecord | null;
    // 导航ID
    categoryId?: number;
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
  const form = reactive<CmsDesignRecord>({
    id: undefined,
    pageId: undefined,
    parentId: undefined,
    title: undefined,
    styles: '',
    keywords: undefined,
    description: undefined,
    path: undefined,
    photo: undefined,
    userId: undefined,
    comments: undefined,
    status: undefined,
    tenantId: undefined,
    createTime: undefined,
    sortNumber: 100
  });

  /* 更新visible */
  const updateVisible = (value: boolean) => {
    emit('update:visible', value);
  };

  // 表单验证规则
  const rules = reactive({
    dictCode: [
      {
        required: true,
        type: 'string',
        message: '请选择组件',
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

  const chooseComponents = (data: DictionaryData) => {
    form.title = data.dictDataName;
    form.dictCode = data.dictDataCode;
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
          ...form,
          navigationId: props.categoryId
        };
        const saveOrUpdate = isUpdate.value
          ? updateCmsDesignRecord
          : addCmsDesignRecord;
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
          if (props.data.image) {
            images.value.push({
              uid: uuid(),
              url: props.data.image,
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
    },
    { immediate: true }
  );
</script>
