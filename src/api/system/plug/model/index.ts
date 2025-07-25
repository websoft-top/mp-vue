import type { PageParam } from '@/api';

/**
 * 插件
 */
export interface Plug {
  plugId?: number;
  plugName?: string;
  plugCode?: string;
  // 菜单id
  menuId?: number;
  // 上级id, 0是顶级
  parentId?: number;
  // 菜单名称
  title?: string;
  // 菜单路由地址
  path?: string;
  // 菜单组件地址
  component?: string;
  // 菜单类型, 0菜单, 1按钮
  menuType?: number;
  // 排序号
  sortNumber?: number;
  // 权限标识
  authority?: string;
  // 菜单图标
  icon?: string;
  // 是否隐藏, 0否,1是(仅注册路由不显示左侧菜单)
  hide?: number;
  // 路由元信息
  meta?: string;
  score?: number;
  price?: number;
  // 创建时间
  createTime?: string;
  // 子菜单
  children?: Plug[];
  // 权限树回显选中状态, 0未选中, 1选中
  checked?: boolean;
  shortName?: string;
  comments?: string;
  content?: string;
  //
  key?: number;
  //
  value?: number;
  //
  parentIds?: number[];
  //
  openType?: number;
  //
  userId?: number;
  //
  appId?: number;
  status?: number;
  tenantId?: number;
}

/**
 * 插件搜索条件
 */
export interface PlugParam extends PageParam {
  title?: string;
  path?: string;
  authority?: string;
  parentId?: number;
}
