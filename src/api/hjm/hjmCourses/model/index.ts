import type { PageParam } from '@/api';

/**
 * 课程
 */
export interface HjmCourses {
  // 自增ID
  id?: number;
  // 课程名称
  name?: string;
  // 类型
  type?: number;
  // 课程编号
  code?: string;
  // 课程封面图
  image?: string;
  // 用户ID
  userId?: number;
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
 * 课程搜索条件
 */
export interface HjmCoursesParam extends PageParam {
  id?: number;
  keywords?: string;
}
