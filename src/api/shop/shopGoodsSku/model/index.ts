import type { PageParam } from '@/api';

/**
 * 商品sku列表
 */
export interface ShopGoodsSku {
  // 主键ID
  id?: number;
  // 商品ID
  goodsId?: number;
  // 商品属性索引值 (attr_value|attr_value[|....])
  sku?: string;
  // 商品图片
  image?: string;
  // 商品价格
  price?: string;
  // 市场价格
  salePrice?: string;
  // 成本价
  cost?: string;
  // 库存
  stock?: number;
  // sku编码
  skuNo?: string;
  // 商品条码
  barCode?: string;
  // 重量
  weight?: string;
  // 体积
  volume?: string;
  // 唯一值
  uuid?: string;
  // 状态, 0正常, 1异常
  status?: number;
  // 备注
  comments?: string;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  images?: string;
}

/**
 * 商品sku列表搜索条件
 */
export interface ShopGoodsSkuParam extends PageParam {
  id?: number;
  keywords?: string;
}
