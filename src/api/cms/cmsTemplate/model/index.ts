import type { PageParam } from '@/api';

/**
 * 网站模版
 */
export interface CmsTemplate {
  // ID
  id?: number;
  // 模版名称
  name?: string;
  // 模版标识
  code?: string;
  // 缩列图
  image?: string;
  // 类型 1企业官网 2其他
  type?: number;
  // 网站关键词
  keywords?: string;
  // 域名前缀
  prefix?: string;
  // 预览地址
  domain?: string;
  // 模版下载地址
  downUrl?: string;
  // 色系
  color?: string;
  // 应用版本 10免费版 20授权版 30永久授权
  version?: number;
  // 行业类型(父级)
  industryParent?: string;
  // 行业类型(子级)
  industryChild?: string;
  // 备注
  comments?: string;
  // 是否推荐
  recommend?: string;
  // 是否共享模板
  share?: string;
  // 排序号
  sortNumber?: number;
  // 用户ID
  userId?: number;
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
 * 网站模版搜索条件
 */
export interface CmsTemplateParam extends PageParam {
  id?: number;
  keywords?: string;
}
