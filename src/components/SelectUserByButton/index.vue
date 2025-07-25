<template>
  <div>
    <a-button type="primary" :icon="h(UserAddOutlined)" @click="openEdit"
      >关联会员</a-button
    >
    <!-- 选择弹窗 -->
    <select-data
      v-model:visible="showEdit"
      :data="current"
      :title="placeholder"
      @done="onChange"
    />
  </div>
</template>

<script lang="ts" setup>
  import { BulbOutlined, UserAddOutlined } from '@ant-design/icons-vue';
  import { ref, h } from 'vue';
  import SelectData from './components/select-data.vue';
  import { User } from '@/api/system/user/model';

  withDefaults(
    defineProps<{
      value?: any;
      placeholder?: string;
    }>(),
    {
      placeholder: '请选择'
    }
  );

  const emit = defineEmits<{
    (e: 'done', User): void;
    (e: 'clear'): void;
  }>();

  // 是否显示编辑弹窗
  const showEdit = ref(false);
  // 当前编辑数据
  const current = ref<User | null>(null);

  /* 打开编辑弹窗 */
  const openEdit = (row?: User) => {
    current.value = row ?? null;
    showEdit.value = true;
  };

  const onChange = (row?: User) => {
    emit('done', row);
  };
  // 查询租户列表
  // const appList = ref<App[] | undefined>([]);
</script>
