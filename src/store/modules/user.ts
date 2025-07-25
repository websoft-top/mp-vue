/**
 * 登录用户 store
 */
import { defineStore } from 'pinia';
import { formatMenus, toTreeData, formatTreeData } from 'ele-admin-pro/es';
import type { MenuItemType } from 'ele-admin-pro/es';
import type { User } from '@/api/system/user/model';
import { TOKEN_STORE_NAME, USER_MENUS } from '@/config/setting';
import {getUserInfo} from '@/api/layout';
import { initialization } from '@/api/layout';
import {clone} from "@/api/system/menu";
import { message } from 'ant-design-vue/es';
import {logout} from "@/utils/page-tab-util";
// import { isExternalLink } from 'ele-admin-pro';
const EXTRA_MENUS: any = [];

export interface UserState {
  info: User | null;
  menus: MenuItemType[] | null | undefined;
  authorities: (string | undefined)[];
  roles: (string | undefined)[];
}

export const useUserStore = defineStore({
  id: 'user',
  state: (): UserState => ({
    // 当前登录用户的信息
    info: null,
    // 当前登录用户的菜单
    menus: null,
    // 当前登录用户的权限
    authorities: [],
    // 当前登录用户的角色
    roles: []
  }),
  getters: {},
  actions: {
    /**
     * 请求用户信息、权限、角色、菜单
     */
    async fetchUserInfo() {
      // const company = await getTenantInfo().catch(() => void 0);
      const result = await getUserInfo().catch(() => {});
      if (!result) {
        logout(false, '/login');
        return {};
      }
      // 系统初始化
      if (!result.installed && result.username === 'superAdmin') {
        const hide = message.loading('正在分配资源请勿刷新页面...', 500);
        // @ts-ignore
        clone({tenantId: Number(result.templateId)}).then(() => {
          if (result.authorities?.length == 0) {
            result.roles?.map((d) => {
              if (d.roleCode === 'superAdmin') {
                initialization(d.roleId).then(() => {
                  hide();
                  location.reload();
                  return false;
                });
              }
            });
          }
        })
      }
      // 用户信息
      this.info = result;
      // 缓存租户信息
      localStorage.setItem('TenantName', `${this.info.tenantName}`);
      // 缓存企业信息
      if (this.info.companyInfo) {
        localStorage.setItem(
          'CompanyLogo',
          `${this.info.companyInfo?.companyLogo}`
        );
        localStorage.setItem('PlanId', `${this.info.companyInfo?.planId}`);
        localStorage.setItem(
          'ModulesUrl',
          `${this.info.companyInfo.modulesUrl}`
        );
      }
      // 用户权限
      this.authorities =
        result.authorities
          ?.filter((d) => !!d.authority)
          ?.map((d) => d.authority) ?? [];
      // 用户角色
      this.roles = result.roles?.map((d) => d.roleCode) ?? [];
      // 获取token
      const token = localStorage.getItem(TOKEN_STORE_NAME);
      // 用户菜单, 过滤掉按钮类型并转为 children 形式
      const { menus, homePath } = formatMenus(
        USER_MENUS ??
          toTreeData({
            data: result.authorities
              ?.filter((d) => d.menuType !== 1)
              .map((d) => {
                // 改造子模块的访问路径
                if (d.modulesUrl) {
                  d.component = `${d.modulesUrl}${d.path}?token=${token}`;
                }
                return d;
              }),
            idField: 'menuId',
            parentIdField: 'parentId'
          }).concat(EXTRA_MENUS)
      );
      this.menus = menus;
      return { menus, homePath };
    },
    /**
     * 更新用户信息
     */
    setInfo(value: User) {
      this.info = value;
    },
    /**
     * 更新菜单的 badge
     */
    setMenuBadge(path: string, value?: number | string, color?: string) {
      this.menus = formatTreeData(this.menus, (m) => {
        if (path === m.path) {
          return {
            ...m,
            meta: {
              ...m.meta,
              badge: value,
              badgeColor: color
            }
          };
        }
        return m;
      });
    }
  }
});
