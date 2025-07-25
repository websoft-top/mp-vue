import type { PageParam } from '@/api';

/**
 * 文章记录表
 */
export interface CmsArticleContent {
  // 
  id?: number;
  // 文章ID
  articleId?: number;
  // 文章内容
  content?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 文章记录表搜索条件
 */
export interface CmsArticleContentParam extends PageParam {
  id?: number;
  keywords?: string;
}
