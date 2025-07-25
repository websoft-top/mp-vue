import type { PageParam } from '@/api';
import {HjmChoices} from "@/api/hjm/hjmChoices/model";

/**
 * 题目
 */
export interface HjmQuestions {
  // 自增ID
  id?: number;
  // 课程ID
  courseId?: number;
  // 课程名称
  courseName?: string;
  // 类型 0choice 1fill 2essay
  type?: number;
  // 题目
  question?: string;
  // 正确答案
  correctAnswer?: string;
  // 难度，'easy', 'medium', 'hard'
  difficulty?: number;
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
  // 选项
  choicesA?: string,
  choicesB?: string,
  choicesC?: string,
  choicesD?: string,
  choices?: number;
  choicesList?: HjmChoices[];
}

/**
 * 题目搜索条件
 */
export interface HjmQuestionsParam extends PageParam {
  id?: number;
  courseId?: number;
  type?: number;
  keywords?: string;
}
