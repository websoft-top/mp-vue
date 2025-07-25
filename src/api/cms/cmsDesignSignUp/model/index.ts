import type { PageParam } from '@/api';

/**
 * 设计征集报名
 */
export interface CmsDesignSignUp {
  // 
  id?: number;
  // 
  designId?: number;
  // 
  name?: string;
  // 
  phone?: string;
  // 
  content?: string;
  // 用户ID
  userId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0已发布, 1待审核 2已驳回 3违规内容
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
 * 设计征集报名搜索条件
 */
export interface CmsDesignSignUpParam extends PageParam {
  id?: number;
  keywords?: string;
}
