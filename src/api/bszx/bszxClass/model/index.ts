import type { PageParam } from '@/api';

/**
 * 百色中学-班级
 */
export interface BszxClass {
  // ID
  id?: number;
  // 时代ID
  eraId?: number;
  // 年级ID
  gradeId?: number;
  // 年级
  gradeName?: string;
  // 班级
  className?: string;
  // 分部
  branch?: number;
  // 班级
  name?: string;
  // 累计捐款总金额
  totalMoney?: string;
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
  value?: number;
  label?: string;
}

/**
 * 百色中学-班级搜索条件
 */
export interface BszxClassParam extends PageParam {
  id?: number;
  gradeId?: number;
  eraId?: number;
  branch?: number;
  name?: string;
  className?: string;
  keywords?: string;
}
