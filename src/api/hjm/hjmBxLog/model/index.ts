import type { PageParam } from '@/api';

/**
 * 黄家明_报险记录
 */
export interface HjmBxLog {
  // 自增ID
  id?: number;
  // 用户ID
  userId?: number;
  // 车辆ID
  carId?: number;
  //  车牌号
  carNo?: string;
  // 操作员
  realName?: string;
  //  事故类型
  accidentType?: string;
  // 部门
  parentOrganization?: string;
  // 保险图片
  image?: string;
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
  // 修改时间
  updateTime?: string;
}

/**
 * 黄家明_报险记录搜索条件
 */
export interface HjmBxLogParam extends PageParam {
  id?: number;
  keywords?: string;
}
