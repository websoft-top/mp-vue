import type { PageParam } from '@/api';

/**
 * 产品
 */
export interface CmsProduct {
  // 自增ID
  productId?: number;
  // 类型 0软件产品 1实物商品 2虚拟商品
  type?: number;
  // 产品编码
  code?: string;
  // 产品标题
  title?: string;
  // 封面图
  image?: string;
  // 产品详情
  content?: string;
  // 父级分类ID
  parentId?: number;
  // 父级栏目名称
  parentName?: string;
  // 产品分类ID
  categoryId?: number;
  // 分类名称
  categoryName?: string;
  // 关联的菜单ID
  menuId?: number;
  // 控制台入口
  path?: string;
  // 产品规格 0单规格 1多规格
  specs?: number;
  // 货架
  position?: string;
  // 单位名称 (个)
  unitName?: string;
  // 进货价格
  price?: string;
  // 销售价格
  salePrice?: string;
  // 标签
  tag?: string;
  // 库存计算方式(10下单减库存 20付款减库存)
  deductStockType?: number;
  // 交付方式
  deliveryMethod?: number;
  // 购买时长
  durationMethod?: number;
  // 服务套餐
  serverMethod?: number;
  // 套餐版本
  packageMethod?: number;
  // 可购买数量
  canBuyNumber?: number;
  // 轮播图
  files?: string;
  // 销量
  sales?: number;
  // 库存
  stock?: number;
  // 消费赚取积分
  gainIntegral?: string;
  // 推荐
  recommend?: number;
  // 是否官方自营
  official?: number;
  // 商户ID
  merchantId?: number;
  // 状态（0：未上架，1：上架）
  isShow?: string;
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
}

/**
 * 产品搜索条件
 */
export interface CmsProductParam extends PageParam {
  productId?: number;
  type?: number;
  official?: number;
  status?: number;
  keywords?: string;
}
