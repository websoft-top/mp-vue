<template>
  <ele-config-provider
    :map-key="MAP_KEY"
    :keep-alive="keepAlive"
    :license="LICENSE_CODE"
  >
    <a-config-provider :locale="antLocale">
      <router-view />
    </a-config-provider>
  </ele-config-provider>
</template>

<script lang="ts" setup>
  import { unref, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useThemeStore } from '@/store/modules/theme';
  import {
    MAP_KEY,
    MAP_CODE,
    LICENSE_CODE,
    TAB_KEEP_ALIVE
  } from '@/config/setting';
  import { useSetDocumentTitle } from '@/utils/document-title-util';
  import { useLocale } from '@/i18n/use-locale';
  import {configWebsiteField} from "@/api/cms/cmsWebsiteField";

  const themeStore = useThemeStore();
  const { showTabs } = storeToRefs(themeStore);

  // 恢复主题
  themeStore.recoverTheme();

  // 切换路由自动更新浏览器页签标题
  useSetDocumentTitle();

  // 国际化配置
  const { antLocale } = useLocale();

  // 读取产品模板信息
  if(!sessionStorage.getItem('LICENSE_CODE')){
    configWebsiteField({}).then((data) => {
      // @ts-ignore
      const code =  "mp" + data.VITE_LICENSE_CODE;
      if(code){
        sessionStorage.setItem('LICENSE_CODE', code)
      }
    });
  }

  // 用于内链 iframe 组件获取 KeepAlive
  const keepAlive = computed(() => TAB_KEEP_ALIVE && unref(showTabs));
  window._AMapSecurityConfig = {
    securityJsCode: MAP_CODE
  };
</script>
