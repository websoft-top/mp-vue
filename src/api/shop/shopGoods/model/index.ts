import type { PageParam } from '@/api';
import { ShopGoodsSpec } from '@/api/shop/shopGoodsSpec/model';
import { ShopGoodsSku } from '@/api/shop/shopGoodsSku/model';
import { ShopGoodsRoleCommission } from '@/api/shop/shopGoodsRoleCommission/model';

export interface GoodsCount {
  totalNum: number;
  totalNum2: number;
  totalNum3: number;
  totalNum4: number;
}
/**
 * 商品记录表
 */
export interface ShopGoods {
  // 自增ID
  goodsId?: number;
  // 类型 1实物商品 2虚拟商品
  type?: number;
  // 商品编码
  code?: string;
  // 商品名称
  name?: string;
  // 商品标题
  goodsName?: string;
  // 商品封面图
  image?: string;
  video?: string;
  // 商品详情
  content?: string;
  canExpress?: number;
  // 商品分类
  category?: string;
  // 商品分类ID
  categoryId?: number;
  parentName?: string;
  categoryName?: string;
  // 一级分类
  categoryParent?: string;
  // 二级分类
  categoryChildren?: string;
  // 商品规格 0单规格 1多规格
  specs?: number;
  commissionRole?: number;
  // 货架
  position?: string;
  // 进货价
  buyingPrice?: string;
  // 商品价格
  price?: string;
  originPrice?: string;
  // 销售价格
  salePrice?: string;
  chainStorePrice?: string;
  chainStoreRate?: string;
  memberStoreRate?: string;
  memberMarketRate?: string;
  memberStoreCommission?: string;
  supplierCommission?: string;
  coopCommission?: string;
  memberStorePrice?: string;
  memberMarketPrice?: string;
  // 经销商价格
  dealerPrice?: string;
  // 有赠品
  buyingGift?: boolean;
  // 有赠品
  priceGift?: boolean;
  // 有赠品
  dealerGift?: boolean;
  buyingGiftNum?: number;
  priceGiftNum?: number;
  priceGiftName?: string;
  dealerGiftNum?: number;
  // 库存计算方式(10下单减库存 20付款减库存)
  deductStockType?: number;
  // 封面图
  files?: string;
  // 销量
  sales?: number;
  isNew?: number;
  // 库存
  stock?: number;
  // 商品重量
  goodsWeight?: number;
  // 消费赚取积分
  gainIntegral?: number;
  // 推荐
  recommend?: number;
  // 商户ID
  merchantId?: number;
  // 商户名称
  merchantName?: string;
  supplierMerchantId?: number;
  supplierName?: string;
  // 状态（0：未上架，1：上架）
  isShow?: number;
  // 状态, 0上架 1待上架 2待审核 3审核不通过
  status?: number;
  // 备注
  comments?: string;
  // 排序号
  sortNumber?: number;
  // 用户ID
  userId?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  // 显示规格名
  specName?: string;
  // 商品规格
  goodsSpecs?: ShopGoodsSpec[];
  goodsRoleCommission?: ShopGoodsRoleCommission[];
  // 商品sku列表
  goodsSkus?: ShopGoodsSku[];
  // 单位名称
  unitName?: string;
  expressTemplateId?: number;
  canUseDate?: string;
  ensureTag?: string;
  expiredDay?: number;
}

export interface BathSet {
  price?: number;
  salePrice?: number;
  stock?: number;
  skuNo?: string;
}

/**
 * 商品记录表搜索条件
 */
export interface ShopGoodsParam extends PageParam {
  parentId?: number;
  categoryId?: number;
  goodsId?: number;
  status?: number;
  goodsName?: string;
  isShow?: number;
  stock?: number;
  keywords?: string;
}
