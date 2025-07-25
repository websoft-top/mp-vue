import type { PageParam } from '@/api';

/**
 * 运费模板
 */
export interface ShopExpressTemplate {
  // 
  id?: number;
  // 
  type?: string;
  // 
  title?: string;
  // 收件价格
  firstAmount?: string;
  // 续件价格
  extraAmount?: string;
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
  // 
  sortNumber?: number;
  // 首件数量/重量
  firstNum?: string;
  // 续件数量/重量
  extraNum?: string;
}

/**
 * 运费模板搜索条件
 */
export interface ShopExpressTemplateParam extends PageParam {
  id?: number;
  keywords?: string;
}
