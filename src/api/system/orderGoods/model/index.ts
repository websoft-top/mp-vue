import type { PageParam } from '@/api';

/**
 * 订单商品
 */
export interface OrderGoods {
  // 订单号
  id?: number;
  // 订单类型，0商城 1应用插件
  type?: number;
  // 项目ID
  itemId?: number;
  // 实际付款
  payPrice?: string;
  // 购买数量
  totalNum?: number;
  // 0未付款，1已付款
  payStatus?: string;
  // 0未完成，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款
  orderStatus?: number;
  // 预约详情开始时间数组
  startTime?: string;
  // 是否已开具发票：0未开发票，1已开发票，2不能开具发票
  isInvoice?: string;
  // 发票流水号
  invoiceNo?: string;
  // 支付时间
  payTime?: string;
  // 过期时间
  expirationTime?: string;
  // 用户id
  userId?: number;
  // 备注
  comments?: string;
  // 排序号
  sortNumber?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 修改时间
  updateTime?: string;
  // 创建时间
  createTime?: string;
}

/**
 * 订单商品搜索条件
 */
export interface OrderGoodsParam extends PageParam {
  id?: number;
  itemId?: number;
  payStatus?: boolean;
  userId?: number;
  orderStatus?: number;
  keywords?: string;
}
