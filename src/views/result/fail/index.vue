<template>
  <a-card :bordered="false">
    <div style="max-width: 960px; margin: 0 auto">
      <a-result
        status="warning"
        title="404 您访问的页面不存在"
        sub-title="请检查网络是否链接或拼写是否正确！"
      >
        <!--          <div>无访问原因如下:</div>-->
        <!--          <div class="error-tips-item">-->
        <!--            <close-circle-outlined class="ele-text-danger" />-->
        <!--            <div>您的账户已被冻结</div>-->
        <!--            <a>立即解冻&gt;</a>-->
        <!--          </div>-->
        <!--          <div class="error-tips-item">-->
        <!--            <close-circle-outlined class="ele-text-danger" />-->
        <!--            <div>您的账户还不具备申请资格</div>-->
        <!--            <a>立即咨询&gt;</a>-->
        <!--          </div>-->
        <!--          <div class="error-tips-item">-->
        <!--            <close-circle-outlined class="ele-text-danger" />-->
        <!--            <div>您的站点已过期</div>-->
        <!--            <a>立即续费&gt;</a>-->
        <!--          </div>-->
        <template #extra>
          <a-space size="middle">
            <a-button type="primary" @click="goBack">返回首页</a-button>
          </a-space>
        </template>
      </a-result>
    </div>
  </a-card>
</template>

<script lang="ts" setup>
  const goBack = () => {
    localStorage.clear();
    return window.location.reload();
  };
</script>

<script lang="ts">
  export default {
    name: 'ResultFail'
  };
</script>

<style lang="less" scoped>
  .error-tips-item {
    display: flex;
    align-items: center;
    margin-top: 16px;

    & > div {
      margin: 0 10px;
    }

    a {
      white-space: nowrap;
    }
  }
</style>
