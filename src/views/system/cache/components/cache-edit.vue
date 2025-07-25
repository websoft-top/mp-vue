<!-- 缓存编辑弹窗 -->
<template>
  <ele-modal
    :width="460"
    :visible="visible"
    :confirm-loading="loading"
    :title="isUpdate ? '修改缓存' : '添加缓存'"
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
      <a-form-item label="KEY" name="key">
        <a-input
          allow-clear
          :maxlength="20"
          placeholder="请输入缓存名称"
          v-model:value="form.key"
        />
      </a-form-item>
      <a-form-item label="CONTENT" name="content">
        <a-textarea
          :rows="4"
          :maxlength="200"
          placeholder="请输入KEY的值"
          v-model:value="form.content"
        />
      </a-form-item>
      <a-form-item label="过期时间" name="expireTime">
        <a-input-number
          placeholder="默认永不过期"
          style="width: 200px"
          v-model:value="form.expireTime"
        />
        <span class="ml-10">分钟</span>
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
  import { getCache, updateCache } from '@/api/system/cache';
  import type { Cache } from '@/api/system/cache/model';

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
    data?: Cache | null;
  }>();

  //
  const formRef = ref<FormInstance | null>(null);

  // 是否是修改
  const isUpdate = ref(false);

  // 提交状态
  const loading = ref(false);

  // 表单数据
  const { form, resetFields, assignFields } = useFormData<Cache>({
    key: undefined,
    content: '',
    expireTime: undefined
  });

  // 表单验证规则
  const rules = reactive<Record<string, Rule[]>>({
    key: [
      {
        required: true,
        message: '请输入KEY',
        type: 'string',
        trigger: 'blur'
      }
    ],
    content: [
      {
        required: true,
        message: '请输入KEY的值',
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
        updateCache(form)
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

<style lang="less">
  .tab-pane {
    min-height: 300px;
  }
  .ml-10 {
    margin-left: 5px;
  }
</style>
