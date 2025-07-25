import type { PageParam } from '@/api';

/**
 * 小程序配置
 */
export interface CmsMpField {
  // 自增ID
  id?: number;
  // 类型，0文本 1图片 2其他
  type?: number;
  // 名称
  name?: string;
  // 备注
  comments?: string;
  // 名称
  value?: string;
  // 页面ID
  pageId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 小程序配置搜索条件
 */
export interface CmsMpFieldParam extends PageParam {
  id?: number;
  keywords?: string;
}
