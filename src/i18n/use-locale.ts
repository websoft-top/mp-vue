/**
 * AntDesignVue、WebSoftAdmin、Dayjs 国际化配置
 */
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Locale } from 'ant-design-vue/es/locale-provider';
import type { EleLocale } from 'ele-admin-pro/es';
// AntDesignVue
import zh_CN from 'ant-design-vue/es/locale/zh_CN';
import en from 'ant-design-vue/es/locale/en_US';
// WebSoftAdmin
import eleZh_CN from 'ele-admin-pro/es/lang/zh_CN';
import eleEn from 'ele-admin-pro/es/lang/en_US';
// Dayjs
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
const antLocales = { zh_CN, en };
const eleLocales = { zh_CN: eleZh_CN, en: eleEn };

export function useLocale() {
  const { locale } = useI18n();
  const antLocale = ref<Locale>();
  const eleLocale = ref<EleLocale>();

  watch(
    locale,
    () => {
      antLocale.value = antLocales[locale.value];
      eleLocale.value = eleLocales[locale.value];
      dayjs.locale(locale.value.toLowerCase().replace(/_/g, '-'));
    },
    { immediate: true }
  );
  return { antLocale, eleLocale };
}
