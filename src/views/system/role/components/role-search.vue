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
        <a-form-item label="角色名称">
          <a-input
            v-model:value.trim="form.roleName"
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
        <a-form-item label="角色标识">
          <a-input
            v-model:value.trim="form.roleCode"
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
        <a-form-item label="备注">
          <a-input
            v-model:value.trim="form.comments"
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
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import useFormData from '@/utils/use-form-data';
  import type { RoleParam } from '@/api/system/role/model';

  // 是否开启响应式布局
  const themeStore = useThemeStore();
  const { styleResponsive } = storeToRefs(themeStore);

  const emit = defineEmits<{
    (e: 'search', where?: RoleParam): void;
  }>();

  // 表单数据
  const { form, resetFields } = useFormData<RoleParam>({
    roleName: '',
    roleCode: '',
    comments: ''
  });

  /* 搜索 */
  const search = () => {
    emit('search', form);
  };

  /*  重置 */
  const reset = () => {
    resetFields();
    search();
  };
</script>
