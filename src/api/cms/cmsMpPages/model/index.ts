import type { PageParam } from '@/api';

/**
 * 小程序页面
 */
export interface CmsMpPages {
  // ID
  id?: number;
  // 上级id, 0是顶级
  parentId?: number;
  // 页面名称
  title?: string;
  // 页面路径
  path?: string;
  // 设为首页
  home?: number;
  // 分包
  subpackage?: string;
  // 图标
  icon?: string;
  // 未选中图标
  iconPath?: string;
  // 选中的图标
  selectedIconPath?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 用户ID
  userId?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 子级
  children?: CmsMpPages[];
}

/**
 * 小程序页面搜索条件
 */
export interface CmsMpPagesParam extends PageParam {
  id?: number;
  keywords?: string;
}
