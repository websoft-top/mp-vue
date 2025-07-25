import type { PageParam } from '@/api';

/**
 * 订单
 */
export interface CmsOrder {
  // 订单号
  orderId?: number;
  // 订单标题
  title?: string;
  // 订单编号
  orderNo?: string;
  // 订单类型，0商城 1询价 2留言
  type?: number;
  // 关联项目ID，配合订单类型使用
  itemId?: number;
  // 真实姓名
  realName?: string;
  // 手机号码
  phone?: string;
  // 电子邮箱
  email?: string;
  // 收货地址
  address?: string;
  // 订单内容
  content?: string;
  // 订单附件
  files?: string;
  // 订单总额
  totalPrice?: string;
  // 实际付款
  payPrice?: string;
  // 报价询价
  price?: string;
  // 购买数量
  totalNum?: number;
  // 二维码地址，保存订单号，支付成功后才生成
  qrcode?: string;
  // 下单渠道，0网站 1小程序 2其他
  channel?: number;
  // 过期时间
  expirationTime?: string;
  // 订单是否已结算(0未结算 1已结算)
  isSettled?: boolean;
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
  // 创建时间
  createTime?: string;
}

/**
 * 订单搜索条件
 */
export interface CmsOrderParam extends PageParam {
  orderId?: number;
  isSettled?: number;
  keywords?: string;
}
