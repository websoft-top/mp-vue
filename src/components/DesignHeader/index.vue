<template>
  <div :class="item.name" :style="item.style" @mousedown="onClick">
    <div class="logo">
      <a-image
        src="https://oss.wsdns.cn/20240311/63b56fd176c14a5ca634254edefed4e3.png"
        :width="item.style"
        :preview="false"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';

  const props = defineProps<{
    // 是否显示
    visible: boolean;
    // 修改回显的数据
    data?: any | null;
  }>();

  const emit = defineEmits<{
    (e: 'done', item: any): void;
    (e: 'update:visible', visible: boolean): void;
  }>();

  const item = ref<any>({
    body: { backgroundColor: '#ffffff' }
  });

  const onClick = () => {
    // if (item.value.body.border) {
    //   item.value.body.border = '';
    // } else {
    //   item.value.body.border = '1px dashed #dddddd';
    // }
    emit('done', props.data);
  };

  watch(
    () => props.data,
    (data) => {
      item.value = data;
    },
    { immediate: true }
  );
</script>
<style scoped lang="less"></style>
