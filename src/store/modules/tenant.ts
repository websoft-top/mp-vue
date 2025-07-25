/**
 * 租户信息 store
 */
import { defineStore } from 'pinia';
import { formatTreeData } from 'ele-admin-pro';
import type { MenuItem } from 'ele-admin-pro';
import { getTenantInfo } from '@/api/layout';
import { Tenant } from '@/api/system/tenant/model';
import { Company } from '@/api/system/company/model';
// const EXTRA_MENUS: any = [];

export interface UserState {
  tenant: Tenant | null;
  company: Company | null;
  menus: MenuItem[] | null | undefined;
}

export const useTenantStore = defineStore({
  id: 'tenant',
  state: (): UserState => ({
    // 租户信息
    tenant: null,
    // 企业信息
    company: null,
    // 当前登录用户的菜单
    menus: null
  }),
  getters: {},
  actions: {
    /**
     * 请求用户信息、权限、角色、菜单
     */
    async fetchTenantInfo() {
      const company = await getTenantInfo().catch(() => void 0);
      if (!company) {
        return {};
      }
      // 租户信息
      this.company = company;
      // 企业信息
      if (company) {
        this.company = company;
      }
    },
    /**
     * 更新租户信息
     */
    setInfo(value: Tenant) {
      this.tenant = value;
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
