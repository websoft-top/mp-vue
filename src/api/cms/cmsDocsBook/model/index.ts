import type { PageParam } from '@/api';

/**
 * 书籍记录表
 */
export interface CmsDocsBook {
  // ID
  bookId?: number;
  // 书籍名称
  name?: string;
  // 书籍标识
  code?: string;
  // 封面图
  photo?: string;
  // 备注
  comments?: string;
  // 文档内容
  content?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 书籍记录表搜索条件
 */
export interface CmsDocsBookParam extends PageParam {
  bookId?: number;
  keywords?: string;
}
