<template>
  <div></div>
</template>
<script setup lang="ts">
import { getIdBySpm, getTokenBySpm, push } from '@/utils/common';
import { setToken } from '@/utils/token-util';
// import { message } from 'ant-design-vue';
// import {pageOrderGoods} from "@/api/system/orderGoods";

if (getTokenBySpm()) {
  setToken(getTokenBySpm(), true);
  localStorage.setItem('TenantId', String(getIdBySpm(5)));
  localStorage.setItem('UserId', String(getIdBySpm(6)));
  // 登录成功
  push('/');
  // 是否已购买本产品
  // pageOrderGoods({ userId: Number(localStorage.getItem('UserId')),orderStatus: 1}).then(res => {
  //   if(res?.count == 0){
  //     message.error('请先安装本应用插件！');
  //     setTimeout(() => {
  //       push('/login')
  //     },1000)
  //     return false;
  //   }
  //   // 登录成功
  //   push('/');
  // })
}
</script>

<style scoped lang="less"></style>
