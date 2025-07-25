import type { PageParam } from '@/api';

/**
 * 我的优惠券
 */
export interface UserCoupon {
  // id
  id?: number;
  // 优惠劵id
  couponId?: number;
  // 优惠券名称
  name?: string;
  // 优惠券类型(10满减券 20折扣券)
  type?: number;
  // 满减券-减免金额
  reducePrice?: string;
  // 折扣券-折扣率(0-100)
  discount?: number;
  // 最低消费金额
  minPrice?: string;
  // 到期类型(10领取后生效 20固定时间)
  expireType?: number;
  // 领取后生效-有效天数
  expireDay?: number;
  // 有效期开始时间
  startTime?: number;
  // 有效期结束时间
  endTime?: number;
  // 适用范围(10全部商品 20指定商品)
  applyRange?: number;
  // 适用范围配置(json格式)
  applyRangeConfig?: string;
  // 是否过期(0未过期 1已过期)
  isExpire?: number;
  // 是否已使用(0未使用 1已使用)
  isUse?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 状态, 0待使用, 1已使用, 2已失效
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 用户ID
  userId?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 我的优惠券搜索条件
 */
export interface UserCouponParam extends PageParam {
  id?: number;
  keywords?: string;
}
