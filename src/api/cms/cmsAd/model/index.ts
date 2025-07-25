import type { PageParam } from '@/api';

/**
 * 广告位
 */
export interface CmsAd {
  // ID
  adId?: number;
  // 类型
  type?: number;
  // 栏目分类
  categoryId?: number;
  // 栏目名称
  categoryName?: string;
  // 页面ID
  designId?: number;
  // 广告类型
  adType?: string;
  // 广告位名称
  name?: string;
  // 宽
  width?: string;
  // 高
  height?: string;
  // css样式
  style?: string;
  // 广告图片
  images?: any;
  // 广告图片
  imageList?: any;
  // 路由/链接地址
  path?: string;
  // 用户ID
  userId?: number;
  // 语言
  lang?: string;
  // 页面ID
  pageId?: number;
  // 页面名称
  pageName?: string;
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
  merchantId?: number;
}

/**
 * 广告位搜索条件
 */
export interface CmsAdParam extends PageParam {
  adId?: number;
  pageId?: number;
  keywords?: string;
}
