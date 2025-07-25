<!-- 搜索表单 -->
<template>
  <a-space style="flex-wrap: wrap">
    <SelectUser
      :placeholder="`添加成员`"
      :organizationId="0"
      @done="updateOrganizationId"
    />
  </a-space>
</template>

<script lang="ts" setup>
  import { updateUser } from '@/api/system/user';
  import { User } from '@/api/system/user/model';

  const props = defineProps<{
    // 部门 id
    organizationId?: number;
  }>();

  const emit = defineEmits<{
    (e: 'search'): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const updateOrganizationId = (date: User) => {
    updateUser({ ...date, organizationId: props.organizationId }).then(() => {
      emit('search');
    });
  };
</script>
