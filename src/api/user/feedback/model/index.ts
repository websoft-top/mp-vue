import type { PageParam } from '@/api';

/**
 * 意见反馈
 */
export interface UserFeedback {
  id?: number;
  userId?: number;
  type?: string;
  content?: string;
  images?: string;
  sortNumber?: number;
  comments?: string;
  status?: number;
  deleted?: number;
  tenantId?: number;
  createTime?: string;
}

/**
 * 用户搜索条件
 */
export interface UserFeedbackParam extends PageParam {
  id?: number;
  userId?: number;
  type?: string;
  createTimeStart?: string;
  createTimeEnd?: string;
}
