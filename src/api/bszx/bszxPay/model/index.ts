import type { PageParam } from '@/api';

/**
 * 百色中学-捐款记录
 */
export interface BszxPay {
  // ID
  id?: number;
  // 年龄
  age?: number;
  // 姓名
  name?: string;
  // 性别 1男 2女
  sex?: number;
  // 手机号码
  phone?: string;
  // 班级
  className?: string;
  // 年级
  gradeName?: string;
  // 居住地址
  address?: string;
  // 工作单位
  workUnit?: string;
  // 职务
  position?: string;
  // 数量
  number?: number;
  // 付费金额
  price?: string;
  // 额外信息
  extra?: string;
  // 订单编号
  orderNo?: string;
  // 预定日期
  dateTime?: string;
  // 捐赠证书
  certificate?: string;
  // 表单数据
  formData?: string;
  // 来源表ID
  formId?: number;
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
}

/**
 * 百色中学-捐款记录搜索条件
 */
export interface BszxPayParam extends PageParam {
  id?: number;
  orderId?: number;
  orderNo?: string;
  gradeName?: string;
  className?: string;
  keywords?: string;
}
