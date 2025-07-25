import type { PageParam } from '@/api';

export interface Grade {
  gradeId?: number;
  name?: string;
  weight?: string;
  upgrade?: string;
  equity?: string;
  commission?: string;
  status?: number;
  comments?: string;
  sortNumber?: number;
  userId?: number;
  deleted?: number;
  tenantId?: number;
  createTime?: string;
  updateTime?: string;
}

/**
 * 搜索条件
 */
export interface GradeParam extends PageParam {
  gradeId?: number;
  name?: string;
  status?: number;
  keywords?: string;
}
