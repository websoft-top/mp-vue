<!-- 国际化语言切换组件 -->
<template>
  <a-dropdown
    :placement="placement"
    :overlay-style="{ minWidth: '120px', paddingTop: '17px' }"
  >
    <slot>
      <global-outlined :style="style" />
    </slot>
    <template #overlay>
      <a-menu :selected-keys="language" @click="changeLanguage">
        <a-menu-item key="en">English</a-menu-item>
        <a-menu-item key="zh_CN">简体中文</a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script lang="ts" setup>
  import type { CSSProperties } from 'vue';
  import { computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { GlobalOutlined } from '@ant-design/icons-vue';
  import { I18N_CACHE_NAME } from '@/config/setting';

  withDefaults(
    defineProps<{
      // dropdown placement
      placement?: any;
      // 自定义样式
      style?: CSSProperties;
    }>(),
    {
      placement: 'bottom',
      style: () => {
        return { transform: 'scale(1.08)' };
      }
    }
  );

  const { locale } = useI18n();

  // 当前显示语言
  const language = computed(() => [locale.value]);

  /* 切换语言 */
  const changeLanguage = ({ key }) => {
    locale.value = key;
    localStorage.setItem(I18N_CACHE_NAME, key);
    window.location.reload();
  };
</script>
