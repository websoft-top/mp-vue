import type { PageParam } from '@/api';

/**
 * 小程序广告位
 */
export interface CmsMpAd {
  // ID
  adId?: number;
  // 页面ID
  pageId?: number;
  // 广告类型
  adType?: string;
  // 广告位名称
  name?: string;
  // 宽
  width?: string;
  // 高
  height?: string;
  // 广告图片
  images?: string;
  // 路由/链接地址
  path?: string;
  // 页面名称
  pageName?: string;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
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
 * 小程序广告位搜索条件
 */
export interface CmsMpAdParam extends PageParam {
  adId?: number;
  keywords?: string;
}
