import type { PageParam } from '@/api';

/**
 * 黄家明_违章记录
 */
export interface HjmViolation {
  // 自增ID
  id?: number;
  // 车辆编号
  code?: string;
  // 标题
  title?: string;
  // 文章分类ID
  categoryId?: number;
  // 处罚金额
  money?: string;
  // 扣分
  score?: string;
  // 录入员
  adminId?: number;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0未处理, 1已处理
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 黄家明_违章记录搜索条件
 */
export interface HjmViolationParam extends PageParam {
  id?: number;
  keywords?: string;
}
