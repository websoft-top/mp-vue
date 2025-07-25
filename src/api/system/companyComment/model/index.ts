import type { PageParam } from '@/api';

/**
 * 应用评论
 */
export interface CompanyComment {
  // ID
  id?: number;
  // 父级ID
  parentId?: number;
  // 用户ID
  userId?: number;
  // 企业ID
  companyId?: number;
  // 评分
  rate?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 评论内容
  comments?: string;
  // 状态
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 应用评论搜索条件
 */
export interface CompanyCommentParam extends PageParam {
  id?: number;
  keywords?: string;
}
