import type { PageParam } from '@/api';

/**
 * 黄家明_gps轨迹
 */
export interface HjmGpsLog {
  // 自增ID
  id?: number;
  // 车辆ID
  carId?: number;
  // gps编号
  gpsNo?: string;
  // 经度
  longitude?: string;
  // 纬度
  latitude?: string;
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
 * 黄家明_gps轨迹搜索条件
 */
export interface HjmGpsLogParam extends PageParam {
  id?: number;
  gpsNo?: string;
  keywords?: string;
}
