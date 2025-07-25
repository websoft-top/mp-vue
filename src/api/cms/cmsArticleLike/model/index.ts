import type { PageParam } from '@/api';

/**
 * 点赞文章
 */
export interface CmsArticleLike {
  // 主键ID
  id?: number;
  // 文章ID
  articleId?: number;
  // 用户ID
  userId?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 点赞文章搜索条件
 */
export interface CmsArticleLikeParam extends PageParam {
  id?: number;
  keywords?: string;
}
