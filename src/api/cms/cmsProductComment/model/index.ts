import type { PageParam } from '@/api';

/**
 * 产品评论
 */
export interface CmsProductComment {
  // ID
  id?: number;
  // 产品ID
  productId?: number;
  // 用户ID
  userId?: number;
  // 昵称
  nickname?: string;
  // 用户头像
  avatar?: string;
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
  image?: string;
}

/**
 * 产品评论搜索条件
 */
export interface CmsProductCommentParam extends PageParam {
  id?: number;
  userId?: number;
  keywords?: string;
}
