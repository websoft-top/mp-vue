<!-- 搜索表单 -->
<template>
  <a-form
    :label-col="
      styleResponsive ? { xl: 7, lg: 5, md: 7, sm: 4 } : { flex: '90px' }
    "
    :wrapper-col="
      styleResponsive ? { xl: 17, lg: 19, md: 17, sm: 20 } : { flex: '1' }
    "
  >
    <a-row :gutter="8">
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item label="用户账号">
          <a-input
            v-model:value.trim="form.username"
            placeholder="请输入"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item label="昵称">
          <a-input
            v-model:value.trim="form.nickname"
            placeholder="请输入"
            allow-clear
          />
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item label="登录时间">
          <a-range-picker
            v-model:value="dateRange"
            value-format="YYYY-MM-DD"
            class="ele-fluid"
          />
        </a-form-item>
      </a-col>
      <a-col
        v-bind="
          styleResponsive
            ? { xl: 6, lg: 12, md: 12, sm: 24, xs: 24 }
            : { span: 6 }
        "
      >
        <a-form-item class="ele-text-right" :wrapper-col="{ span: 24 }">
          <a-space>
            <a-button type="primary" @click="search">查询</a-button>
            <a-button @click="reset">重置</a-button>
          </a-space>
        </a-form-item>
      </a-col>
    </a-row>
  </a-form>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { LoginRecordParam } from '@/api/system/login-record/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'search', where?: LoginRecordParam): void;
  }>();

  // 表单数据
  const { form, resetFields } = useFormData<LoginRecordParam>({
    username: '',
    nickname: ''
  });

  // 日期范围选择
  const dateRange = ref<[string, string]>(['', '']);

  /* 搜索 */
  const search = () => {
    const [d1, d2] = dateRange.value ?? [];
    emit('search', {
      ...form,
      createTimeStart: d1 ? d1 + ' 00:00:00' : '',
      createTimeEnd: d2 ? d2 + ' 23:59:59' : ''
    });
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    dateRange.value = ['', ''];
    search();
  };
</script>
