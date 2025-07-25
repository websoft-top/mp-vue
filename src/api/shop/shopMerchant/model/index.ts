import type { PageParam } from '@/api';

/**
 * 商户
 */
export interface ShopMerchant {
  // ID
  merchantId?: number;
  // 商户名称
  merchantName?: string;
  // 商户编号
  merchantCode?: string;
  // 商户类型
  type?: number;
  // 商户图标
  image?: string;
  // 商户手机号
  phone?: string;
  // 商户姓名
  realName?: string;
  // 店铺类型
  shopType?: string;
  // 项目分类
  itemType?: string;
  // 商户分类
  category?: string;
  // 商户经营分类
  merchantCategoryId?: number;
  // 商户分类
  merchantCategoryTitle?: string;
  // 经纬度
  lngAndLat?: string;
  //
  lng?: string;
  //
  lat?: string;
  // 所在省份
  province?: string;
  // 所在城市
  city?: string;
  // 所在辖区
  region?: string;
  // 详细地址
  address?: string;
  // 手续费
  commission?: string;
  // 关键字
  keywords?: string;
  // 资质图片
  files?: string;
  // 营业时间
  businessTime?: string;
  // 文章内容
  content?: string;
  // 每小时价格
  price?: string;
  // 是否自营
  ownStore?: number;
  // 是否推荐
  recommend?: number;
  // 是否需要审核
  goodsReview?: number;
  // 管理入口
  adminUrl?: string;
  // 备注
  comments?: string;
  // 所有人
  userId?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 状态
  status?: number;
  // 排序号
  sortNumber?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 商户搜索条件
 */
export interface ShopMerchantParam extends PageParam {
  merchantId?: number;
  phone?: string;
  userId?: number;
  shopType?: string;
  keywords?: string;
}
