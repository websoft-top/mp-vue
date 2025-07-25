import type { PageParam } from '@/api';

/**
 * 黄家明_学习记录
 */
export interface HjmExamLog {
  // 自增ID
  id?: number;
  // 用户ID
  userId?: number;
  // 得分
  total?: string;
  // 用时
  useTime?: string;
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
 * 黄家明_学习记录搜索条件
 */
export interface HjmExamLogParam extends PageParam {
  id?: number;
  status?: number;
  keywords?: string;
}
