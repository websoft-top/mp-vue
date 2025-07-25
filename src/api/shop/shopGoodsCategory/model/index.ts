import type { PageParam } from '@/api';

/**
 * 商品分类
 */
export interface ShopGoodsCategory {
  // 商品分类ID
  categoryId?: number;
  // 分类标识
  categoryCode?: string;
  // 分类名称
  title?: string;
  // 类型 0商城分类 1外卖分类
  type?: number;
  // 分类图片
  image?: string;
  // 上级分类ID
  parentId?: number;
  // 路由/链接地址
  path?: string;
  // 组件路径
  component?: string;
  // 绑定的页面
  pageId?: number;
  // 用户ID
  userId?: number;
  // 商品数量
  count?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)
  hide?: number;
  // 是否推荐
  recommend?: number;
  // 是否显示在首页
  showIndex?: number;
  // 商铺ID
  merchantId?: number;
  // 状态, 0正常, 1禁用
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  // 子菜单
  children?: ShopGoodsCategory[];
  key?: number;
  value?: number;
  label?: string;
}

/**
 * 商品分类搜索条件
 */
export interface ShopGoodsCategoryParam extends PageParam {
  categoryId?: number;
  keywords?: string;
}
