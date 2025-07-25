import type { PageParam } from '@/api';

/**
 * 第三方用户信息表
 */
export interface UserOauth {
  // 主键ID
  id?: number;
  // 用户ID
  userId?: number;
  // 第三方登陆类型(MP-WEIXIN)
  oauthType?: string;
  // 第三方用户唯一标识 (uid openid)
  oauthId?: string;
  // 微信unionID
  unionid?: string;
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
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 第三方用户信息表搜索条件
 */
export interface UserOauthParam extends PageParam {
  id?: number;
  keywords?: string;
}
