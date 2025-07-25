<template>
  <div style="max-width: 240px">
    <a-input
      allow-clear
      v-model:value="where.phone"
      placeholder="输入手机号码搜素"
      prefix-icon="el-icon-search"
      @change="search"
    >
      <template #prefix>
        <SearchOutlined class="ele-text-placeholder" />
      </template>
    </a-input>
  </div>
</template>

<script lang="ts" setup>
  import { reactive } from 'vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import type { WhereType } from './types';

  const emit = defineEmits<{
    (e: 'search', where: WhereType): void;
  }>();

  // 搜索表单
  const where = reactive<WhereType>({
    keywords: '',
    nickname: '',
    phone: ''
  });

  /* 搜索 */
  const search = () => {
    emit('search', where);
  };
</script>
