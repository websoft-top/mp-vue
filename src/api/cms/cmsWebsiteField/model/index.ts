import type { PageParam } from '@/api';

/**
 * 应用参数
 */
export interface CmsWebsiteField {
  // 自增ID
  id?: number;
  // 类型，0文本 1图片 2其他
  type?: number;
  // 名称
  name?: string;
  // 默认值
  defaultValue?: string;
  // 可修改的值 [on|off]
  modifyRange?: string;
  // 备注
  comments?: string;
  // css样式
  style?: string;
  // 名称
  value?: string;
  // 语言
  lang?: string;
  // 模板
  template?: string;
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
 * 应用参数搜索条件
 */
export interface CmsWebsiteFieldParam extends PageParam {
  id?: number;
  keywords?: string;
}

export interface Config {
  siteName?: string;
  siteLogo?: string;
  domain?: string;
  icpNo?: string;
  copyright?: string;
  loginBgImg?: string;
  address?: string;
  tel?: string;
  kefu2?: string;
  kefu1?: string;
  email?: string;
  loginTitle?: string;
  sysLogo?: string;
}
