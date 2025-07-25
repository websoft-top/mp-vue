import type { PageParam } from '@/api';

/**
 * 国际化记录启用
 */
export interface CmsLangLog {
  // ID
  id?: number;
  // 名称
  lang?: string;
  // 关联ID
  langId?: number;
  // 编码
  code?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 国际化记录启用搜索条件
 */
export interface CmsLangLogParam extends PageParam {
  id?: number;
  keywords?: string;
}
