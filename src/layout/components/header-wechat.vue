<!-- 顶栏消息通知 -->
<template>
  <a-popover>
    <template #content>
      <p class="ele-text-placeholder" style="text-align: center">
        请使用微信扫描二维码
      </p>
      <a-image
        :preview="false"
        :width="200"
        :height="200"
        src="https://file.wsdns.cn/20230518/6b3c88423e0e437f81b3adbf63d30cba.png"
      />
      <p class="ele-text-placeholder" style="text-align: center">
        客服电话：0771-5386339
      </p>
    </template>
    <div class="ele-admin-header-tool-item">
      <wechat-outlined style="padding: 8px 0" />
    </div>
  </a-popover>
</template>

<script lang="ts" setup>
  import { WechatOutlined } from '@ant-design/icons-vue';
</script>
<style lang="less">
  .wechat-box {
    .title {
      line-height: 40px;
    }
  }
</style>
