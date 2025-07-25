<script setup lang="ts">
  import { ref } from 'vue';

  const top = ref<number>(10);
  const bottom = ref<number>(10);

  const change = (affixed: boolean) => {
    console.log(affixed);
  };
</script>

<template>
  <div class="ele-body">
    <a-card title="测试页面" style="height: 2000px">
      收到佛山市
      <a-affix :offset-top="120" @change="change">
        <a-button>120px to affix top</a-button>
      </a-affix>
    </a-card>
  </div>
</template>

<style scoped lang="less"></style>
