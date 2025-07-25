<template>
  <a-button @click="add">添加参数</a-button>
</template>

<script lang="ts" setup>
  const emit = defineEmits<{
    (e: 'add'): void;
  }>();

  const add = () => {
    emit('add');
  };
</script>
