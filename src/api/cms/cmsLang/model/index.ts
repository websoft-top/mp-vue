import type { PageParam } from '@/api';

/**
 * 国际化
 */
export interface CmsLang {
  // ID
  id?: number;
  // 名称
  name?: string;
  // 编码
  code?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0已发布, 1待审核 2已驳回 3违规内容
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 国际化搜索条件
 */
export interface CmsLangParam extends PageParam {
  id?: number;
  keywords?: string;
}
