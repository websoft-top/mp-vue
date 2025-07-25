import type { PageParam } from '@/api';

/**
 * 收货地址
 */
export interface ShopUserAddress {
  // 主键ID
  id?: number;
  // 姓名
  name?: string;
  // 手机号码
  phone?: string;
  // 所在国家
  country?: string;
  // 所在省份
  province?: string;
  // 所在城市
  city?: string;
  // 所在辖区
  region?: string;
  // 收货地址
  address?: string;
  // 收货地址
  fullAddress?: string;
  // 
  lat?: string;
  // 
  lng?: string;
  // 1先生 2女士
  gender?: number;
  // 家、公司、学校
  type?: string;
  // 默认收货地址
  isDefault?: string;
  // 用户ID
  userId?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
}

/**
 * 收货地址搜索条件
 */
export interface ShopUserAddressParam extends PageParam {
  id?: number;
  keywords?: string;
}
