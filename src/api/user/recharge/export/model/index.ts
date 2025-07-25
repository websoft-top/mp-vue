import type { PageParam } from '@/api';

export interface RechargeOrder {
  orderId?: number;
  organizationId?: number;
  organizationName?: string;
  rechargeType?: number;
  nickname?: string;
  realName?: string;
  phone?: string;
  payPrice?: number;
  giftMoney?: number;
  actualMoney?: number;
  operator?: string;
  comments?: string;
  createTime?: string;
  tenantId?: number;
  expendMoney?: string;
  userId?: number;
}

/**
 * 搜索条件
 */
export interface RechargeOrderParam extends PageParam {
  exportId?: number;
  organizationName?: string;
  organizationId?: number;
  dayTime?: string;
  week?: number;
  status?: number;
  userId?: number;
  createTimeStart?: string;
  createTimeEnd?: string;
  deliveryTimeStart?: string;
  deliveryTimeEnd?: string;
}
