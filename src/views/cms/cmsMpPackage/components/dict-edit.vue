<!-- 分包编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改分包' : '添加分包'"
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
      <a-form-item label="标识" name="dictCode">
        <a-input
          allow-clear
          :maxlength="20"
          disabled
          placeholder="请输入标识"
          v-model:value="form.dictCode"
        />
      </a-form-item>
<!--      <a-form-item label="名称" name="dictDataName">-->
<!--        <a-input-->
<!--          allow-clear-->
<!--          :maxlength="20"-->
<!--          placeholder="分包"-->
<!--          v-model:value="form.dictDataName"-->
<!--        />-->
<!--      </a-form-item>-->
      <a-form-item label="名称" name="dictDataCode">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="pages"
          v-model:value="form.dictDataCode"
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
  import { addDictData, updateDictData } from '@/api/system/dict-data';
  import { DictData } from '@/api/system/dict-data/model';
  import {removeSiteInfoCache} from "@/api/cms/cmsWebsite";

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
    data?: DictData | null;
    // 字典ID
    dictId?: number | 0;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<DictData>({
    dictId: undefined,
    dictDataId: undefined,
    dictDataName: '',
    dictCode: 'mpPackage',
    dictDataCode: '',
    sortNumber: 100,
    comments: ''
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    dictDataCode: [
      {
        required: true,
        message: '请输入分包英文名',
        type: 'string',
        trigger: 'blur'
      }
    ],
    // dictDataName: [
    //   {
    //     required: true,
    //     message: '请输入分包名称',
    //     type: 'string',
    //     trigger: 'blur'
    //   }
    // ],
    dictCode: [
      {
        required: true,
        message: '请输入分包标识',
        type: 'string',
        trigger: 'blur'
      }
    ]
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
        const saveOrUpdate = isUpdate.value ? updateDictData : addDictData;
        // form.dictDataCode = form.dictDataName;
        form.dictId = props.dictId;
        form.dictDataName = form.dictDataCode;
        saveOrUpdate(form)
          .then((msg) => {
            loading.value = false;
            message.success(msg);
            // 清除字典缓存
            removeSiteInfoCache(form.dictCode + ':' + form.tenantId);
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
