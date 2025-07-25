import type { PageParam } from '@/api';

/**
 * 百色中学-报名记录
 */
export interface BszxBm {
  // 自增ID
  id?: number;
  // 订单编号
  orderNo?: string;
  // 姓名
  name?: string;
  // 性别 1男 2女
  sex?: number;
  sexName?: string;
  // 手机号码
  phone?: string;
  // 手机号码(脱敏)
  mobile?: string;
  // 捐款金额
  price?: string;
  // 分部ID
  branchId?: number;
  // 班级ID
  classId?: number;
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
  // 是否能到场
  present?: string;
  // 年龄
  age?: number;
  // 人数
  number?: number;
  // 额外信息
  extra?: string;
  // 生成的邀请函存放路径
  certificate?: string;
  // 预定日期
  dateTime?: string;
  // 表单数据
  formData?: string;
  // 表单ID
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
 * 百色中学-报名记录搜索条件
 */
export interface BszxBmParam extends PageParam {
  id?: number;
  branchId?: number;
  gradeName?: string;
  className?: string;
  classId?: number;
  keywords?: string;
}
