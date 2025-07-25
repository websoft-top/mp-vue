/**
 * 主题状态管理
 */
import { defineStore } from 'pinia';
import {
  changeColor,
  screenWidth,
  screenHeight,
  contentWidth,
  contentHeight,
  WEAK_CLASS,
  BODY_LIMIT_CLASS,
  DISABLES_CLASS
} from 'ele-admin-pro/es';
import type {
  TabItem,
  HeadStyleType,
  SideStyleType,
  LayoutStyleType,
  SideMenuStyleType,
  TabStyleType,
  TabRemoveOption
} from 'ele-admin-pro/es';
import {
  TAB_KEEP_ALIVE,
  KEEP_ALIVE_EXCLUDES,
  THEME_STORE_NAME
} from '@/config/setting';
// import { getCache } from '@/api/system/cache';

/**
 * state 默认值
 */
const DEFAULT_STATE: ThemeState = Object.freeze({
  // 页签数据
  tabs: [],
  // 是否折叠侧栏
  collapse: false,
  // 是否折叠一级侧栏
  sideNavCollapse: true,
  // 内容区域是否全屏
  bodyFullscreen: false,
  // 是否开启页签栏
  showTabs: false,
  // 是否开启页脚
  showFooter: true,
  // 顶栏风格: light(亮色), dark(暗色), primary(主色)
  headStyle: 'light',
  // 侧栏风格: light(亮色), dark(暗色)
  sideStyle: 'light',
  // 布局风格: side(默认), top(顶栏导航), mix(混合导航)
  layoutStyle: 'side',
  // 侧栏菜单风格: default(默认), mix(双排侧栏)
  sideMenuStyle: 'default',
  // 页签风格: default(默认), dot(圆点), card(卡片)
  tabStyle: 'default',
  // 路由切换动画
  transitionName: 'fade',
  // 是否固定顶栏
  fixedHeader: true,
  // 是否固定侧栏
  fixedSidebar: true,
  // 是否固定主体
  fixedBody: true,
  // 内容区域宽度铺满
  bodyFull: true,
  // logo 是否自适应宽度
  logoAutoSize: false,
  // 侧栏是否彩色图标
  colorfulIcon: false,
  // 侧栏是否只保持一个子菜单展开
  sideUniqueOpen: true,
  // 是否是色弱模式
  weakMode: false,
  // 是否是暗黑模式
  darkMode: false,
  // 主题色
  color: '#00B42A',
  // 主页的组件名称
  homeComponents: [],
  // 刷新路由时的参数
  routeReload: null,
  // 屏幕宽度
  screenWidth: screenWidth(),
  // 屏幕高度
  screenHeight: screenHeight(),
  // 内容区域宽度
  contentWidth: contentWidth(),
  // 内容区域高度
  contentHeight: contentHeight(),
  // 是否开启响应式
  styleResponsive: true
});
// 延时操作定时器
let disableTransitionTimer: number, updateContentSizeTimer: number;

/**
 * 读取缓存配置
 */
function getCacheSetting(): any {
  try {
    const value = localStorage.getItem(THEME_STORE_NAME);
    if (value) {
      const cache = JSON.parse(value);
      if (typeof cache === 'object') {
        return cache;
      }
    }
  } catch (e) {
    console.error(e);
  }
  return {};
}

/**
 * 缓存配置
 */
function cacheSetting(key: string, value: any) {
  const cache = getCacheSetting();
  if (cache[key] !== value) {
    cache[key] = value;
    // console.log(value);
    // localStorage.setItem(THEME_STORE_NAME, JSON.stringify(cache));
    // updateCacheTheme({
    //   key: 'theme',
    //   content: JSON.stringify(cache)
    // }).then((res) => {
    //   console.log(res);
    // });
  }
}

/**
 * 开关响应式布局
 */
function changeStyleResponsive(styleResponsive: boolean) {
  if (styleResponsive) {
    document.body.classList.remove(BODY_LIMIT_CLASS);
  } else {
    document.body.classList.add(BODY_LIMIT_CLASS);
  }
}

/**
 * 切换色弱模式
 */
function changeWeakMode(weakMode: boolean) {
  if (weakMode) {
    document.body.classList.add(WEAK_CLASS);
  } else {
    document.body.classList.remove(WEAK_CLASS);
  }
}

/**
 * 切换主题
 */
function changeTheme(value?: string | null, dark?: boolean) {
  return new Promise<void>((resolve, reject) => {
    try {
      changeColor(value, dark);
      resolve();
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * 切换布局时禁用过渡动画
 */
function disableTransition() {
  disableTransitionTimer && clearTimeout(disableTransitionTimer);
  document.body.classList.add(DISABLES_CLASS);
  disableTransitionTimer = setTimeout(() => {
    document.body.classList.remove(DISABLES_CLASS);
  }, 100) as unknown as number;
}

export const useThemeStore = defineStore({
  id: 'theme',
  state: (): ThemeState => {
    const state = { ...DEFAULT_STATE };
    // 读取本地缓存
    const cache = getCacheSetting();
    Object.keys(state).forEach((key) => {
      if (typeof cache[key] !== 'undefined') {
        state[key] = cache[key];
      }
    });
    return state;
  },
  getters: {
    // 需要 keep-alive 的组件
    keepAliveInclude(): string[] {
      if (!TAB_KEEP_ALIVE || !this.showTabs) {
        return [];
      }
      const components = new Set<string>();
      const { reloadPath, reloadHome } = this.routeReload || {};
      this.tabs?.forEach((t) => {
        const isAlive = t.meta?.keepAlive !== false;
        const isExclude = KEEP_ALIVE_EXCLUDES.includes(t.path as string);
        const isReload = reloadPath && reloadPath === t.fullPath;
        if (isAlive && !isExclude && !isReload && t.components) {
          t.components.forEach((c) => {
            if (typeof c === 'string' && c) {
              components.add(c);
            }
          });
        }
      });
      if (!reloadHome) {
        this.homeComponents?.forEach((c) => {
          if (typeof c === 'string' && c) {
            components.add(c);
          }
        });
      }
      return Array.from(components);
    }
  },
  actions: {
    setTabs(value: TabItem[]) {
      this.tabs = value;
      //cacheSetting('tabs', value);
    },
    setCollapse(value: boolean) {
      this.collapse = value;
      this.delayUpdateContentSize(800);
    },
    setSideNavCollapse(value: boolean) {
      this.sideNavCollapse = value;
      this.delayUpdateContentSize(800);
    },
    setBodyFullscreen(value: boolean) {
      disableTransition();
      this.bodyFullscreen = value;
      this.delayUpdateContentSize(800);
    },
    setShowTabs(value: boolean) {
      this.showTabs = value;
      cacheSetting('showTabs', value);
      this.delayUpdateContentSize();
    },
    setShowFooter(value: boolean) {
      this.showFooter = value;
      cacheSetting('showFooter', value);
      this.delayUpdateContentSize();
    },
    setHeadStyle(value: HeadStyleType) {
      this.headStyle = value;
      cacheSetting('headStyle', value);
    },
    setSideStyle(value: SideStyleType) {
      this.sideStyle = value;
      cacheSetting('sideStyle', value);
    },
    setLayoutStyle(value: LayoutStyleType) {
      disableTransition();
      this.layoutStyle = value;
      cacheSetting('layoutStyle', value);
      this.delayUpdateContentSize();
    },
    setSideMenuStyle(value: SideMenuStyleType) {
      disableTransition();
      this.sideMenuStyle = value;
      cacheSetting('sideMenuStyle', value);
      this.delayUpdateContentSize();
    },
    setTabStyle(value: TabStyleType) {
      this.tabStyle = value;
      cacheSetting('tabStyle', value);
    },
    setTransitionName(value: string) {
      this.transitionName = value;
      cacheSetting('transitionName', value);
    },
    setFixedHeader(value: boolean) {
      disableTransition();
      this.fixedHeader = value;
      cacheSetting('fixedHeader', value);
    },
    setFixedSidebar(value: boolean) {
      disableTransition();
      this.fixedSidebar = value;
      cacheSetting('fixedSidebar', value);
    },
    setFixedBody(value: boolean) {
      disableTransition();
      this.fixedBody = value;
      cacheSetting('fixedBody', value);
    },
    setBodyFull(value: boolean) {
      this.bodyFull = value;
      cacheSetting('bodyFull', value);
      this.delayUpdateContentSize();
    },
    setLogoAutoSize(value: boolean) {
      disableTransition();
      this.logoAutoSize = value;
      cacheSetting('logoAutoSize', value);
    },
    setColorfulIcon(value: boolean) {
      this.colorfulIcon = value;
      cacheSetting('colorfulIcon', value);
    },
    setSideUniqueOpen(value: boolean) {
      this.sideUniqueOpen = value;
      cacheSetting('sideUniqueOpen', value);
    },
    setStyleResponsive(value: boolean) {
      changeStyleResponsive(value);
      this.styleResponsive = value;
      cacheSetting('styleResponsive', value);
    },
    /**
     * 切换色弱模式
     * @param value 是否是色弱模式
     */
    setWeakMode(value: boolean) {
      return new Promise<void>((resolve) => {
        changeWeakMode(value);
        this.weakMode = value;
        cacheSetting('weakMode', value);
        resolve();
      });
    },
    /**
     * 切换暗黑模式
     * @param value 是否是暗黑模式
     */
    setDarkMode(value: boolean) {
      return new Promise<void>((resolve, reject) => {
        changeTheme(this.color, value)
          .then(() => {
            this.darkMode = value;
            cacheSetting('darkMode', value);
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 切换主题色
     * @param value 主题色
     */
    setColor(value?: string) {
      return new Promise<void>((resolve, reject) => {
        changeTheme(value, this.darkMode)
          .then(() => {
            this.color = value;
            cacheSetting('color', value);
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 设置主页路由对应的组件名称
     * @param components 组件名称
     */
    setHomeComponents(components: string[]) {
      this.homeComponents = components;
    },
    /**
     * 设置刷新路由信息
     * @param option 路由刷新参数
     */
    setRouteReload(option: RouteReloadOption | null) {
      this.routeReload = option;
    },
    /**
     * 更新屏幕尺寸
     */
    updateScreenSize() {
      this.screenWidth = screenWidth();
      this.screenHeight = screenHeight();
      this.updateContentSize();
    },
    /**
     * 更新内容区域尺寸
     */
    updateContentSize() {
      this.contentWidth = contentWidth();
      this.contentHeight = contentHeight();
    },
    /**
     * 延时更新内容区域尺寸
     * @param delay 延迟时间
     */
    delayUpdateContentSize(delay?: number) {
      updateContentSizeTimer && clearTimeout(updateContentSizeTimer);
      updateContentSizeTimer = setTimeout(() => {
        this.updateContentSize();
      }, delay ?? 100) as unknown as number;
    },
    /**
     * 重置设置
     */
    resetSetting() {
      return new Promise<void>((resolve, reject) => {
        disableTransition();
        this.showTabs = DEFAULT_STATE.showTabs;
        this.showFooter = DEFAULT_STATE.showFooter;
        this.headStyle = DEFAULT_STATE.headStyle;
        this.sideStyle = DEFAULT_STATE.sideStyle;
        this.layoutStyle = DEFAULT_STATE.layoutStyle;
        this.sideMenuStyle = DEFAULT_STATE.sideMenuStyle;
        this.tabStyle = DEFAULT_STATE.tabStyle;
        this.transitionName = DEFAULT_STATE.transitionName;
        this.fixedHeader = DEFAULT_STATE.fixedHeader;
        this.fixedSidebar = DEFAULT_STATE.fixedSidebar;
        this.fixedBody = DEFAULT_STATE.fixedBody;
        this.bodyFull = DEFAULT_STATE.bodyFull;
        this.logoAutoSize = DEFAULT_STATE.logoAutoSize;
        this.colorfulIcon = DEFAULT_STATE.colorfulIcon;
        this.sideUniqueOpen = DEFAULT_STATE.sideUniqueOpen;
        this.styleResponsive = DEFAULT_STATE.styleResponsive;
        this.weakMode = DEFAULT_STATE.weakMode;
        this.darkMode = DEFAULT_STATE.darkMode;
        this.color = DEFAULT_STATE.color;
        localStorage.removeItem(THEME_STORE_NAME);
        Promise.all([
          changeStyleResponsive(this.styleResponsive),
          changeWeakMode(this.weakMode),
          changeTheme(this.color, this.darkMode)
        ])
          .then(() => {
            resolve();
          })
          .catch((e) => {
            reject(e);
          });
      });
    },
    /**
     * 恢复主题
     */
    recoverTheme() {
      // 关闭响应式布局
      if (!this.styleResponsive) {
        changeStyleResponsive(false);
      }
      // 恢复色弱模式
      if (this.weakMode) {
        changeWeakMode(true);
      }
      // 恢复主题色
      if (this.color || this.darkMode) {
        changeTheme(this.color, this.darkMode).catch((e) => {
          console.error(e);
        });
      }
    },
    /**
     * 添加页签或更新相同 key 的页签数据
     * @param data 页签数据
     */
    tabAdd(data: TabItem | TabItem[]) {
      if (Array.isArray(data)) {
        data.forEach((d) => {
          this.tabAdd(d);
        });
        return;
      }
      const i = this.tabs.findIndex((d) => d.key === data.key);
      if (i === -1) {
        this.setTabs(this.tabs.concat([data]));
      } else if (data.fullPath !== this.tabs[i].fullPath) {
        this.setTabs(
          this.tabs
            .slice(0, i)
            .concat([data])
            .concat(this.tabs.slice(i + 1))
        );
      }
    },
    /**
     * 关闭页签
     * @param key 页签 key
     */
    async tabRemove({
      key,
      active
    }: TabRemoveOption): Promise<TabRemoveResult> {
      const i = this.tabs.findIndex((t) => t.key === key || t.fullPath === key);
      if (i === -1) {
        return {};
      }
      const t = this.tabs[i];
      if (!t.closable) {
        return Promise.reject();
      }
      const path = this.tabs[i - 1]?.fullPath;
      this.setTabs(this.tabs.filter((_d, j) => j !== i));
      return t.key === active ? { path, home: !path } : {};
    },
    /**
     * 关闭左侧页签
     */
    async tabRemoveLeft({
      key,
      active
    }: TabRemoveOption): Promise<TabRemoveResult> {
      let index = -1; // 选中页签的 index
      for (let i = 0; i < this.tabs.length; i++) {
        if (this.tabs[i].key === active) {
          index = i;
        }
        if (this.tabs[i].key === key) {
          if (i === 0) {
            break;
          }
          const temp = this.tabs.filter((d, j) => !d.closable && j < i);
          if (temp.length === i + 1) {
            break;
          }
          const path = index === -1 ? void 0 : this.tabs[i].fullPath;
          this.setTabs(temp.concat(this.tabs.slice(i)));
          return { path };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭右侧页签
     */
    async tabRemoveRight({
      key,
      active
    }: TabRemoveOption): Promise<TabRemoveResult> {
      if (this.tabs.length) {
        let index = -1; // 选中页签的 index
        for (let i = 0; i < this.tabs.length; i++) {
          if (this.tabs[i].key === active) {
            index = i;
          }
          if (this.tabs[i].key === key) {
            if (i === this.tabs.length - 1) {
              return Promise.reject();
            }
            const temp = this.tabs.filter((d, j) => !d.closable && j > i);
            if (temp.length === this.tabs.length - i - 1) {
              return Promise.reject();
            }
            const path = index === -1 ? this.tabs[i].fullPath : void 0;
            this.setTabs(
              this.tabs
                .slice(0, i + 1)
                .concat(this.tabs.filter((d, j) => !d.closable && j > i))
            );
            return { path };
          }
        }
        // 主页时关闭全部
        const temp = this.tabs.filter((d) => !d.closable);
        if (temp.length !== this.tabs.length) {
          this.setTabs(temp);
          return { home: index !== -1 };
        }
      }
      return Promise.reject();
    },
    /**
     * 关闭其它页签
     */
    async tabRemoveOther({
      key,
      active
    }: TabRemoveOption): Promise<TabRemoveResult> {
      let index = -1; // 选中页签的 index
      let path: string | undefined; // 关闭后跳转的 path
      const temp = this.tabs.filter((d, i) => {
        if (d.key === active) {
          index = i;
        }
        if (d.key === key) {
          path = d.fullPath;
        }
        return !d.closable || d.key === key;
      });
      if (temp.length === this.tabs.length) {
        return Promise.reject();
      }
      this.setTabs(temp);
      if (index === -1) {
        return {};
      }
      return key === active ? {} : { path, home: !path };
    },
    /**
     * 关闭全部页签
     * @param active 选中页签的 key
     */
    async tabRemoveAll(active: string): Promise<TabRemoveResult> {
      const t = this.tabs.find((d) => d.key === active);
      const home = typeof t !== 'undefined' && t.closable === true; // 是否跳转主页
      const temp = this.tabs.filter((d) => !d.closable);
      if (temp.length === this.tabs.length) {
        return Promise.reject();
      }
      this.setTabs(temp);
      return { home };
    },
    /**
     * 修改页签
     * @param data 页签数据
     */
    tabSetItem(data: TabItem) {
      let i = -1;
      if (data.key) {
        i = this.tabs.findIndex((d) => d.key === data.key);
      } else if (data.fullPath) {
        i = this.tabs.findIndex((d) => d.fullPath === data.fullPath);
      } else if (data.path) {
        i = this.tabs.findIndex((d) => d.path === data.path);
      }
      if (i !== -1) {
        const item = { ...this.tabs[i] };
        if (data.title) {
          item.title = data.title;
        }
        if (typeof data.closable === 'boolean') {
          item.closable = data.closable;
        }
        if (data.components) {
          item.components = data.components;
        }
        this.setTabs(
          this.tabs
            .slice(0, i)
            .concat([item])
            .concat(this.tabs.slice(i + 1))
        );
      }
    }
  }
});

/**
 * 主题 State 类型
 */
export interface ThemeState {
  tabs: TabItem[];
  collapse: boolean;
  sideNavCollapse: boolean;
  bodyFullscreen: boolean;
  showTabs: boolean;
  showFooter: boolean;
  headStyle: HeadStyleType;
  sideStyle: SideStyleType;
  layoutStyle: LayoutStyleType;
  sideMenuStyle: SideMenuStyleType;
  tabStyle: TabStyleType;
  transitionName: string;
  fixedHeader: boolean;
  fixedSidebar: boolean;
  fixedBody: boolean;
  bodyFull: boolean;
  logoAutoSize: boolean;
  colorfulIcon: boolean;
  sideUniqueOpen: boolean;
  weakMode: boolean;
  darkMode: boolean;
  color?: string | null;
  homeComponents: string[];
  routeReload: RouteReloadOption | null;
  screenWidth: number;
  screenHeight: number;
  contentWidth: number;
  contentHeight: number;
  styleResponsive: boolean;
}

/**
 * 设置路由刷新方法的参数
 */
export interface RouteReloadOption {
  // 是否是刷新主页
  reloadHome?: boolean;
  // 要刷新的页签路由地址
  reloadPath?: string;
}

/**
 * 关闭页签返回类型
 */
export interface TabRemoveResult {
  // 关闭后要跳转的地址
  path?: string;
  // 关闭后是否跳转到主页
  home?: boolean;
}
