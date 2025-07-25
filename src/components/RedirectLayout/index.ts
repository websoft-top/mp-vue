/** 用于刷新的路由组件 */
import { defineComponent, unref, h } from 'vue';
import { useRouter } from 'vue-router';
import { setRouteReload } from '@/utils/page-tab-util';

export default defineComponent({
  name: 'RedirectLayout',
  setup() {
    const { currentRoute, replace } = useRouter();
    const { params, query } = unref(currentRoute);
    const from = Array.isArray(params.path)
      ? params.path.join('/')
      : params.path;
    const path = '/' + from;
    setTimeout(() => {
      setRouteReload(null);
      replace({ path, query });
    }, 100);
    return () => h('div');
  }
});
