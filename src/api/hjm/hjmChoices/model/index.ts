import type { PageParam } from '@/api';

/**
 * 选择题选项
 */
export interface HjmChoices {
  // 自增ID
  id?: number;
  // 题目ID
  questionId?: number;
  // 题目
  content?: string;
  // 是否正确
  isCorrect?: boolean;
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
 * 选择题选项搜索条件
 */
export interface HjmChoicesParam extends PageParam {
  id?: number;
  keywords?: string;
}
