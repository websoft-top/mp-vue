<!-- 搜索表单 -->
<template>
  <a-space :size="10" style="flex-wrap: wrap">
    1、设置角色为【邮政协会/管局】即可出现以下列表，2、关注微信公众号，3、然后<a href="https://mp.weixin.qq.com/" target="_blank">获取openId</a> 并填入表格，即可接受到微信的订阅消息提醒。
  </a-space>
</template>

<script lang="ts" setup>
  import { watch } from 'vue';
  import {UserParam} from "@/api/system/user/model";

  const props = withDefaults(
    defineProps<{
      // 选中的角色
      selection?: [];
    }>(),
    {}
  );

  const emit = defineEmits<{
    (e: 'search', where?: UserParam): void;
    (e: 'add'): void;
    (e: 'remove'): void;
    (e: 'batchMove'): void;
  }>();

  // 新增
  const add = () => {
    emit('add');
  };

  watch(
    () => props.selection,
    () => {}
  );
</script>
