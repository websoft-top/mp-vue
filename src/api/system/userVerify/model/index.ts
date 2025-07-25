import type { PageParam } from '@/api';

/**
 * 实名认证
 */
export interface UserVerify {
  // 自增ID
  id?: number;
  // 用户ID
  userId?: number;
  // 类型, 0个人, 1企业
  type?: number;
  // 主体名称
  name?: string;
  // 营业执照号码
  zzCode?: string;
  // 营业执照
  zzImg?: string;
  // 真实姓名
  realName?: string;
  // 手机号码
  phone?: string;
  // 证件号码
  idCard?: string;
  // 出生日期
  birthday?: string;
  // 正面
  sfz1?: string;
  // 反面
  sfz2?: string;
  // 机构名称
  organizationName?: string;
  // 备注
  comments?: string;
  // 状态, 0在线, 1离线
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 实名认证搜索条件
 */
export interface UserVerifyParam extends PageParam {
  id?: number;
  type?: number;
  keywords?: string;
}
