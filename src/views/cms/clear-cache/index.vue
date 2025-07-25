<template>
  <div class="ele-body">
    <a-card :bordered="false">
      <div style="max-width: 960px; margin: 0 auto">
        <a-result :status="success ? 'success' : ''" :title="title">
          <template #extra>
            <a-space size="middle">
              <a-button danger @click="reload">清除缓存</a-button>
            </a-space>
          </template>
        </a-result>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { removeSiteInfoCache } from '@/api/cms/cmsWebsite';
  import { ref } from 'vue';

  const success = ref<boolean>(false);
  const title = ref<string>();

  const reload = () => {
    removeSiteInfoCache('SiteInfo:' + localStorage.getItem('TenantId')).then(
      (msg) => {
        if (msg) {
          success.value = true;
          title.value = '操作成功';
        }
      }
    );
  };

  reload();
</script>
<script lang="ts">
  export default {
    name: 'ClearCache'
  };
</script>
