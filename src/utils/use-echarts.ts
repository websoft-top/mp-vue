/**
 * echarts 自动切换主题、重置尺寸封装
 */
import type { Ref } from 'vue';
import {
  ref,
  reactive,
  unref,
  provide,
  watch,
  onActivated,
  onDeactivated,
  nextTick
} from 'vue';
import { storeToRefs } from 'pinia';
import { THEME_KEY } from 'vue-echarts';
import type VChart from 'vue-echarts';
import { ChartTheme, ChartThemeDark } from 'ele-admin-pro/es';
import { useThemeStore } from '@/store/modules/theme';
import { onSizeChange } from './on-size-change';

export default function (chartRefs: Ref<InstanceType<typeof VChart> | null>[]) {
  // 当前框架是否是暗黑主题
  const themeStore = useThemeStore();
  const { darkMode } = storeToRefs(themeStore);
  // 是否为 deactivated 状态
  const deactivated = ref<boolean>(false);
  // 当前图表是否是暗黑主题
  const isDark = ref<boolean>(unref(darkMode));
  // 当前图表主题
  const chartsTheme = reactive({
    ...(unref(isDark) ? ChartThemeDark : ChartTheme)
  });

  // 设置图表主题
  provide(THEME_KEY, chartsTheme);

  /* 重置图表尺寸 */
  const resizeCharts = () => {
    chartRefs.forEach((chartRef) => {
      unref(chartRef)?.resize();
    });
  };

  /* 屏幕尺寸变化监听 */
  onSizeChange(() => {
    resizeCharts();
  });

  /* 更改图表主题 */
  const changeTheme = (dark: boolean) => {
    isDark.value = dark;
    Object.assign(chartsTheme, dark ? ChartThemeDark : ChartTheme);
  };

  onActivated(() => {
    deactivated.value = false;
    nextTick(() => {
      if (unref(isDark) !== unref(darkMode)) {
        changeTheme(unref(darkMode));
      } else {
        resizeCharts();
      }
    });
  });

  onDeactivated(() => {
    deactivated.value = true;
  });

  watch(darkMode, (dark) => {
    if (!unref(deactivated)) {
      changeTheme(dark);
    }
  });
}
