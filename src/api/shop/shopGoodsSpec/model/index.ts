import type { PageParam } from '@/api';

/**
 * 商品多规格
 */
export interface ShopGoodsSpec {
  // 主键
  id?: number;
  // 商品ID
  goodsId?: number;
  // 规格ID
  specId?: number;
  // 规格名称
  specName?: string;
  // 规格值
  specValue?: string;
  // 活动类型 0=商品，1=秒杀，2=砍价，3=拼团
  type?: string;
  // 租户id
  tenantId?: number;
}

/**
 * 商品多规格搜索条件
 */
export interface ShopGoodsSpecParam extends PageParam {
  id?: number;
  keywords?: string;
}
