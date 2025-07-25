import type { PageParam } from '@/api';

/**
 * 百色中学-年级
 */
export interface BszxGrade {
  // ID
  id?: number;
  // 年级
  name?: string;
  // 年代
  eraId?: number;
  // 分部
  branch?: number;
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
 * 百色中学-年级搜索条件
 */
export interface BszxGradeParam extends PageParam {
  id?: number;
  branch?: number;
  gradeId?: number;
  keywords?: string;
}
