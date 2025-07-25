<template>
  <div class="ele-body ele-body-card">
    <a-card
      :bordered="false"
      :body-style="{ paddingTop: '0px', minHeight: '800px' }"
    >
      <a-tabs v-model:active-key="active">
        <a-tab-pane tab="网站设置" key="website">
          <Website v-model:value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="上传设置" key="upload">
          <Upload v-model:value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="短信设置" key="sms">
          <Sms v-model:value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="注册设置" key="register">
          <Register :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="微信小程序" key="mp-weixin">
          <MpWeixin :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="企业微信" key="wx-work">
          <WxWork :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="微信公众号" key="wx-official">
          <WxOfficial :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="隐私与安全" key="privacy">
          <Privacy :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="打印设置" key="printer">
          <Printer :value="active" :data="data"/>
        </a-tab-pane>
        <a-tab-pane tab="更新缓存" key="clear">
          <Clear :value="active" :data="data"/>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue';
import {Setting} from '@/api/system/setting/model';
import Website from './components/website.vue';
import Upload from './components/upload.vue';
import Register from './components/register.vue';
import WxWork from './components/wx-work.vue';
import WxOfficial from './components/wx-official.vue';
import MpWeixin from './components/mp-weixin.vue';
import Privacy from './components/privacy.vue';
// import Payment from './components/payment.vue';
import Sms from './components/sms.vue';
import Printer from './components/printer.vue';
import Clear from './components/clear.vue';
import {getSettingByKey} from '@/api/system/setting';

// tab页选中
const active = ref('privacy');

const data = ref<Setting>();

const reload = () => {
  getSettingByKey(active.value).then(res => {
    data.value = res;
  })
};

reload();

watch(
  () => active.value,
  () => {
    reload();
  }
);
</script>

<script lang="ts">
export default {
  name: 'Setting'
};
</script>
