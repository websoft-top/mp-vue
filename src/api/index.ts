/**
 * 接口统一返回结果
 */
export interface ApiResult<T> {
  // 状态码
  code: number;
  // 状态信息
  message?: string;
  // 返回数据
  data?: T;
}

/**
 * 分页查询统一结果
 */
export interface PageResult<T> {
  // 返回数据
  list: T[];
  // 总数量
  count: number;
}

/**
 * 分页查询基本参数
 */
export interface PageParam {
  // 第几页
  page?: number;
  // 每页多少条
  limit?: number;
  // 排序字段
  sort?: string;
  sortNum?: string;
  // 排序方式, asc升序, desc降序
  order?: string;
  // 租户ID
  tenantId?: number;
  // 企业ID
  companyId?: number;
  // 商户ID
  merchantId?: number;
  merchantName?: string;
  categoryIds?: any;
  // 商品分类
  categoryId?: number;
  categoryName?: string;
  // 搜素关键词
  keywords?: string;
  // 起始时间
  createTimeStart?: string;
  // 结束时间
  createTimeEnd?: string;
  timeStart?: number;
  timeEnd?: number;
  isExpireTime?: number;
  showSoldStatus?: boolean;
  dateTime?: string;
  sceneType?: string;
  userId?: number;
  lang?: string;
}
