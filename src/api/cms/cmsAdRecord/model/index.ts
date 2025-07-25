import type { PageParam } from '@/api';

/**
 * 广告图片
 */
export interface CmsAdRecord {
  // ID
  adRecordId?: number;
  // 广告标题
  title?: string;
  // 图片地址
  path?: string;
  // 链接地址
  url?: string;
  // 广告位ID
  adId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 广告图片搜索条件
 */
export interface CmsAdRecordParam extends PageParam {
  adRecordId?: number;
  keywords?: string;
}
