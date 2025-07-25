<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <div style="max-width: 960px; margin: 0 auto">
        <a-result
          status="error"
          title="404"
          sub-title="您访问的页面走丢了"
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
              <a-button type="primary" @click="openUrl('/')">返回首页</a-button>
              <!--              <a-button @click="openNew('https://www.gxwebsoft.com')">技术支持</a-button>-->
            </a-space>
          </template>
        </a-result>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { CloseCircleOutlined } from '@ant-design/icons-vue';
  import { openNew, openUrl } from '@/utils/common';

  console.log('>>>>>');

  const reload = () => {
    return false;
  };
  reload();
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
