import type { PageParam } from '@/api';

/**
 * 微信公众号
 */
export interface CmsMpOfficialMenu {
  // ID
  id?: number;
  // 上级id, 0是顶级
  parentId?: number;
  // 菜单名称
  name?: string;
  // 类型
  type?: string;
  // 菜单值
  key?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 微信公众号搜索条件
 */
export interface CmsMpOfficialMenuParam extends PageParam {
  id?: number;
  keywords?: string;
}
