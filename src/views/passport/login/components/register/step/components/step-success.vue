<template>
  <div style="padding-bottom: 40px">
    <a-result :title="`注册成功`" status="success" :sub-title="subTitle">
      <div class="desc">
        <p> 租户ID：{{ data.tenantId }} </p>
        <p> 名称：{{ data.companyName }} </p>
        <p> 账号：{{ data.phone }} </p>
        <p> 密码：{{ data.password }} </p>
      </div>
    </a-result>
  </div>
</template>

<script lang="ts" setup>
  import type { StepForm } from '../model';
  import { ref } from 'vue';

  defineProps<{
    // 修改回显的数据
    data?: StepForm | null;
  }>();

  const subTitle = ref('注册资料已发到您预留的邮箱地址');
</script>
