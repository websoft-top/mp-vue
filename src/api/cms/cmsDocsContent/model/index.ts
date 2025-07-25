import type { PageParam } from '@/api';

/**
 * 文档内容记录表
 */
export interface CmsDocsContent {
  // ID
  id?: number;
  // 文档ID
  docsId?: number;
  // 文档内容
  content?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 文档内容记录表搜索条件
 */
export interface CmsDocsContentParam extends PageParam {
  id?: number;
  keywords?: string;
}
