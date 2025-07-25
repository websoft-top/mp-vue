import type { PageParam } from '@/api';

/**
 * 文档管理记录表
 */
export interface CmsDocs {
  // 文档ID
  docsId?: number;
  // 文档标题
  title?: string;
  // 上级目录
  parentId?: number;
  // 书籍ID
  bookId?: number;
  // 可见性(public,private,protected)
  visibility?: string;
  // 虚拟阅读量(仅用作展示)
  virtualViews?: number;
  // 实际阅读量
  actualViews?: number;
  // 用户ID
  userId?: number;
  // 备注
  comments?: string;
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
  // 修改时间
  updateTime?: string;
}

/**
 * 文档管理记录表搜索条件
 */
export interface CmsDocsParam extends PageParam {
  docsId?: number;
  keywords?: string;
}
