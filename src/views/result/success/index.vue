<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <div style="max-width: 960px; margin: 0 auto">
        <a-result status="success" :title="item.title">
          <div>{{ item.comments }}</div>
          <template #extra>
            <a-space size="middle">
              <a-button
                type="primary"
                @click="item.back ? openUrl(item.back) : () => $router.go(-2)"
                >返回</a-button
              >
              <a-button v-if="item.redirect" @click="openUrl(item.redirect)"
                >查看详情</a-button
              >
            </a-space>
          </template>
        </a-result>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { openUrl } from '@/utils/common';
  import { useParamsStore } from '@/store/modules/params';
  const item = useParamsStore();
</script>
<script lang="ts">
  export default {
    name: 'ResultSuccess'
  };
</script>
