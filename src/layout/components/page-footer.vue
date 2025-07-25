<!-- 全局页脚 -->
<template>
  <div v-if="config.setting?.showAdminCopyright" class="ele-text-center" style="padding: 16px 0">
    <div class="ele-text-secondary" style="margin-top: 8px">
      {{ t('layout.footer.copyright') }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n';
import {useWebsiteSettingStore} from "@/store/modules/setting";
import {getSettingByKey} from "@/api/system/setting";

const {t} = useI18n();
const config = useWebsiteSettingStore();

const reload = async () => {
  if (!config.setting) {
    const info = await getSettingByKey('privacy');
    config.setSetting(info)
  }
}

reload();
</script>
