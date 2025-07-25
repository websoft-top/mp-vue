import type { PageParam } from '@/api';

/**
 * 百色中学-捐款排行
 */
export interface BszxPayRanking {
  // ID
  id?: number;
  // 来源表ID（项目名称）
  formId?: number;
  // 数量
  number?: number;
  // 获得捐款总金额
  totalPrice?: number;
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
}

/**
 * 百色中学-捐款排行搜索条件
 */
export interface BszxPayRankingParam extends PageParam {
  id?: number;
  keywords?: string;
}
