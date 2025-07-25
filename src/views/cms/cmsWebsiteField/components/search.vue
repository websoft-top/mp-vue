<template>
  <a-button @click="add" type="primary" :disabled="!websiteId">添加字段</a-button>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'add'): void;
  }>();

  const add = () => {
    emit('add');
  };

  const websiteId = localStorage.getItem('WebsiteId')
</script>
