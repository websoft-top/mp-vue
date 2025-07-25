import type { PageParam } from '@/api';

/**
 * 电子围栏
 */
export interface HjmFence {
  // 自增ID
  id?: number;
  // 围栏名称
  name?: string;
  // 类型 0圆形 1方形
  type?: number;
  // 位置
  location?: string;
  // 经度
  longitude?: string;
  // 纬度
  latitude?: string;
  // 区域
  district?: string;
  // 轮廓
  points?: string;
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
  // 修改时间
  updateTime?: string;
}

/**
 * 电子围栏搜索条件
 */
export interface HjmFenceParam extends PageParam {
  id?: number;
  type?: number;
  keywords?: string;
}
