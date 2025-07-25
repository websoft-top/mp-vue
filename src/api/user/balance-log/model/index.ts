import type { PageParam } from '@/api';

/**
 * 余额明细
 */
export interface UserBalanceLog {
  logId?: number;
  userId?: number;
  scene?: number;
  money?: string;
  describe?: string;
  remark?: string;
  sortNumber?: number;
  comments?: string;
  status?: number;
  deleted?: number;
  tenantId?: number;
  createTime?: string;
  updateTime?: string;
}

/**
 * 用户搜索条件
 */
export interface UserBalanceLogParam extends PageParam {
  logId?: number;
  userId?: number;
  scene?: number;
  createTimeStart?: string;
  createTimeEnd?: string;
}
