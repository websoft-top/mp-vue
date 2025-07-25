<template>
  <div id="ww_login"></div>
</template>

<script setup>
  import * as ww from '@wecom/jssdk';
  import { onMounted, ref } from 'vue';

  const wwLoginInstance = ref(null);

  const wwLogin = () => {
    wwLoginInstance.value = ww.createWWLoginPanel({
      el: '#ww_login',
      params: {
        login_type: 'ServiceApp',
        appid: 'wx5400ab7aebf0f3c3',
        agentid: '10000xx',
        redirect_uri: 'https://oa.gxwebsoft.com/wx-work-login',
        state: 'loginState',
        redirect_type: 'callback',
        panel_size: 'small'
      },
      onCheckWeComLogin({ isWeComLogin }) {
        console.log('1111');
        console.log(isWeComLogin);
      },
      onLoginSuccess({ code }) {
        console.log('222');
        console.log({ code });
      },
      onLoginFail(err) {
        console.log('333');
        console.log(err);
      }
    });
  };

  onMounted(() => {
    wwLogin();
  });
</script>
