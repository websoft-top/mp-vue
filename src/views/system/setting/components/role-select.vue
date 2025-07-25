<!-- 角色选择下拉框 -->
<template>
  <a-select
    allow-clear
    :value="value"
    :placeholder="placeholder"
    @update:value="updateValue"
    @blur="onBlur"
  >
    <a-select-option
      v-for="item in data"
      :key="item.roleId"
      :value="item.roleId"
    >
      {{ item.roleName }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { message } from 'ant-design-vue/es';
  import { listRoles } from '@/api/system/role';
  import type { Role } from '@/api/system/role/model';

  const emit = defineEmits<{
    (e: 'update:value', value): void;
    (e: 'blur'): void;
  }>();

  withDefaults(
    defineProps<{
      // 选中的角色
      value?: Role[];
      //
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择角色'
    }
  );

  // 角色数据
  const data = ref<Role[]>([]);

  /* 更新选中数据 */
  const updateValue = (value) => {
    emit('update:value', value);
  };

  /* 获取角色数据 */
  listRoles()
    .then((list) => {
      data.value = list;
    })
    .catch((e) => {
      message.error(e.message);
    });

  /* 失去焦点 */
  const onBlur = () => {
    emit('blur');
  };
</script>
