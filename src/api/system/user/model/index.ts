import type { PageParam } from '@/api';
import type { Role } from '../../role/model';
import type { Menu } from '../../menu/model';
import { Company } from '@/api/system/company/model';

/**
 * 用户
 */
export interface User {
  // 账号类型
  type?: number;
  // 用户id
  userId?: number;
  // 账号
  username?: string;
  // 密码
  password?: string;
  password2?: string;
  // 昵称
  nickname?: string;
  openId?: string;
  officeOpenid?: string;
  sessionKey?: string;
  // 别名
  alias?: string;
  // 头像
  avatar?: string;
  // 性别(字典)
  sex?: string;
  // 手机号
  phone?: string;
  // 脱敏手机号
  mobile?: string;
  // 邮箱
  email?: string;
  // 出生日期
  birthday?: string;
  age?: number;
  // 详细地址
  address?: string;
  longitude?: string;
  latitude?: string;
  // 会员等级ID
  gradeId?: number;
  // 个人简介
  introduction?: string;
  // 机构id
  organizationId?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 性别名称
  sexName?: string;
  province?: string;
  city?: string;
  region?: string;
  // 机构名称
  organizationName?: string;
  // 角色列表
  roles?: Role[];
  roleCode?: string;
  roleId?: number;
  roleName?: string;
  // 权限列表
  authorities?: Menu[];
  payTime?: string;
  deliveryTime?: string;
  receiptTime?: string;
  merchantId?: number;
  // 可管理的商户
  merchants?: string;
  // 创建时间
  createTime?: string;
  // 租户ID
  tenantId?: number;
  // 租户名称
  tenantName?: string;
  logo?: string;
  companyId?: number;
  companyInfo?: Company;
  planId?: number;
  code?: string;
  smsCode?: string;
  //
  remember?: boolean;
  balance?: number;
  points?: number;
  payMoney?: number;
  setting?: string;
  realName?: string;
  companyName?: string;
  merchantName?: string;
  merchantAvatar?: string;
  gradeName?: string;
  idCard?: string;
  comments?: string;
  recommend?: number;
  system?: any;
  // 头像地址
  avatarUrl?: string;
  // 1男，2女
  gender?: string;
  // 国家
  country?: string;
  // 邮箱是否验证, 0否, 1是
  emailVerified?: number;
  // 注册时间
  addTime?: number;
  //
  idcard?: string;
  //
  truename?: string;
  // 是否管理员：1是；2否
  isAdmin?: boolean;
  // 客户端ID
  clientId?: string;
  // 注册来源客户端 (APP、H5、小程序等)
  platform?: string;
  // 排序
  sortNumber?: number;
  isSuperAdmin?: boolean;
  deleted?: number;
  // 克隆的模板ID
  templateId?: number;
  // 是否安装
  installed?: boolean;
  label?: string;
  value?: number;
  // 关注数量
  followers?: number;
}

/**
 * 用户搜索条件
 */
export interface UserParam extends PageParam {
  keywords?: any;
  type?: any;
  userId?: number;
  username?: string;
  nickname?: string;
  realName?: string;
  gradeId?: unknown;
  gradeName?: string;
  companyName?: string;
  city?: string;
  cityMate?: string;
  sex?: string;
  phone?: string;
  status?: number;
  organizationId?: number;
  parentId?: number;
  sexName?: string;
  roleId?: string;
  isAdmin?: number;
  showProfile?: boolean;
  isStaff?: boolean;
  templateId?: number;
}
