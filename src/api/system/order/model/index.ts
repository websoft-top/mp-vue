import type { PageParam } from '@/api';

/**
 * 订单
 */
export interface Order {
  // 订单号
  orderId?: number;
  // 订单编号
  orderNo?: string;
  // 订单类型，0产品 1插件
  type?: number;
  // 下单渠道，0网站 1小程序 2其他
  channel?: number;
  // 微信支付订单号
  transactionId?: string;
  // 微信退款订单号
  refundOrder?: string;
  // 使用的优惠券id
  couponId?: number;
  // 真实姓名
  realName?: string;
  // 手机号码
  phone?: string;
  // 订单总额
  totalPrice?: string;
  // 减少的金额，使用VIP会员折扣、优惠券抵扣、优惠券折扣后减去的价格
  reducePrice?: string;
  // 实际付款
  payPrice?: string;
  // 用于统计
  price?: string;
  // 价钱，用于积分赠送
  money?: string;
  // 退款金额
  refundMoney?: string;
  // 购买数量
  totalNum?: number;
  // 0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机
  payType?: number;
  // 0未付款，1已付款
  payStatus?: number;
  // 0未完成，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款
  orderStatus?: number;
  // 优惠类型：0无、1抵扣优惠券、2折扣优惠券、3、VIP月卡、4VIP年卡，5VIP次卡、6VIP会员卡、7IC月卡、8IC年卡、9IC次卡、10IC会员卡、11免费订单、12VIP充值卡、13IC充值卡、14VIP季卡、15IC季卡
  couponType?: number;
  // 优惠说明
  couponDesc?: string;
  // 二维码地址，保存订单号，支付成功后才生成
  qrcode?: string;
  // 预约详情开始时间数组
  startTime?: string;
  // 是否已开具发票：0未开发票，1已开发票，2不能开具发票
  isInvoice?: string;
  // 发票流水号
  invoiceNo?: string;
  // 支付时间
  payTime?: string;
  // 退款时间
  refundTime?: string;
  // 申请退款时间
  refundApplyTime?: string;
  // 过期时间
  expirationTime?: string;
  // 对账情况：0=未对账；1=已对账；3=已对账，金额对不上；4=未查询到该订单
  checkBill?: number;
  // 订单是否已结算(0未结算 1已结算)
  isSettled?: number;
  // 系统版本号 0当前版本 value=其他版本
  version?: number;
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
 * 订单搜索条件
 */
export interface OrderParam extends PageParam {
  orderId?: number;
  type?: number;
  payStatus?: number;
  payType?: number;
  isInvoice?: string;
  week?: string;
  keywords?: string;
}
