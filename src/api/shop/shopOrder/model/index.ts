import type { PageParam } from '@/api';

/**
 * 订单
 */
export interface ShopOrder {
  // 订单号
  orderId?: number;
  // 订单编号
  orderNo?: string;
  // 订单类型，0商城订单 1预定订单/外卖 2会员卡
  type?: number;
  // 快递/自提
  deliveryType?: number;
  // 下单渠道，0小程序预定 1俱乐部训练场 3活动订场
  channel?: number;
  // 微信支付订单号
  transactionId?: string;
  // 微信退款订单号
  refundOrder?: string;
  // 商户ID
  merchantId?: number;
  // 商户名称
  merchantName?: string;
  // 商户编号
  merchantCode?: string;
  // 使用的优惠券id
  couponId?: number;
  // 使用的会员卡id
  cardId?: string;
  // 关联管理员id
  adminId?: number;
  // 核销管理员id
  confirmId?: number;
  // IC卡号
  icCard?: string;
  // 头像
  avatar?: string;
  // 真实姓名
  realName?: string;
  // 手机号码
  phone?: string;
  // 手机号码(脱敏)
  mobile?: string;
  // 收货地址
  address?: string;
  //
  addressLat?: string;
  //
  addressLng?: string;
  // 自提店铺id
  selfTakeMerchantId?: number;
  // 自提店铺
  selfTakeMerchantName?: string;
  // 配送开始时间
  sendStartTime?: string;
  // 配送结束时间
  sendEndTime?: string;
  // 发货店铺id
  expressMerchantId?: number;
  // 发货店铺
  expressMerchantName?: string;
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
  // 教练价格
  coachPrice?: string;
  // 购买数量
  totalNum?: number;
  // 教练id
  coachId?: number;
  // 支付的用户id
  payUserId?: number;
  // 0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机，6VIP月卡，7VIP年卡，8VIP次卡，9IC月卡，10IC年卡，11IC次卡，12免费，13VIP充值卡，14IC充值卡，15积分支付，16VIP季卡，17IC季卡，18代付
  payType?: number;
  // 代付支付方式,0余额支付, 1微信支付，102微信Native，2会员卡支付，3支付宝，4现金，5POS机，6VIP月卡，7VIP年卡，8VIP次卡，9IC月卡，10IC年卡，11IC次卡，12免费，13VIP充值卡，14IC充值卡，15积分支付，16VIP季卡，17IC季卡，18代付
  friendPayType?: number;
  // 0未付款，1已付款
  payStatus?: number;
  // 0未使用，1已完成，2已取消，3取消中，4退款申请中，5退款被拒绝，6退款成功，7客户端申请退款
  orderStatus?: number;
  // 发货状态(10未发货 20已发货 30部分发货)
  deliveryStatus?: number;
  // 发货时间
  deliveryTime?: string;
  // 优惠类型：0无、1抵扣优惠券、2折扣优惠券、3、VIP月卡、4VIP年卡，5VIP次卡、6VIP会员卡、7IC月卡、8IC年卡、9IC次卡、10IC会员卡、11免费订单、12VIP充值卡、13IC充值卡、14VIP季卡、15IC季卡
  couponType?: number;
  // 优惠说明
  couponDesc?: string;
  // 二维码地址，保存订单号，支付成功后才生成
  qrcode?: string;
  // vip月卡年卡、ic月卡年卡回退次数
  returnNum?: number;
  // vip充值回退金额
  returnMoney?: string;
  // 预约详情开始时间数组
  startTime?: string;
  // 是否已开具发票：0未开发票，1已开发票，2不能开具发票
  isInvoice?: number;
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
  // 自提码
  selfTakeCode?: string;
  // 是否已收到赠品
  hasTakeGift?: string;
}

/**
 * 订单搜索条件
 */
export interface ShopOrderParam extends PageParam {
  orderId?: number;
  orderNo?: string;
  phone?: string;
  payStatus?: number;
  orderStatus?: number;
  payType?: number;
  isInvoice?: boolean;
  keywords?: string;
}
