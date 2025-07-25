import type { PageParam } from '@/api';

/**
 * 充值记录
 */
export interface RechargeOrder {
  orderId?: number;
  userId?: number;
  scene?: number;
  orderNo?: string;
  money?: string;
  payPrice?: number;
  actualMoney?: number;
  organizationId?: number;
  rechargeType?: number;
  describe?: string;
  remark?: string;
  sortNumber?: number;
  comments?: string;
  status?: number;
  deleted?: number;
  tenantId?: number;
  createTime?: string;
  updateTime?: string;
  balance?: number;
}

/**
 * 用户搜索条件
 */
export interface RechargeOrderParam extends PageParam {
  orderId?: number;
  keywords?: string;
}
