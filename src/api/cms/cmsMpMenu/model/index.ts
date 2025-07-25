import type { PageParam } from '@/api';

/**
 * 小程序端菜单
 */
export interface CmsMpMenu {
  // ID
  menuId?: number;
  // 上级id, 0是顶级
  parentId?: number;
  // 菜单名称
  title?: string;
  // 类型 0功能图标 1订单状态图标 2首页导航图标 3 商城导航图标 4管理人员功能图标
  type?: number;
  // 是否微信小程序菜单
  isMpWeixin?: string;
  // 菜单路由地址
  path?: string;
  // 菜单组件地址, 目录可为空
  component?: string;
  // 打开位置
  target?: string;
  // 菜单图标
  avatar?: string;
  // 图标颜色
  color?: string;
  // 上传图标
  icon?: string;
  // 是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)
  hide?: number;
  // 位置 0不限 1顶部 2底部
  position?: number;
  // 0 第一行 1第二行
  rows?: number;
  // 菜单侧栏选中的path
  active?: string;
  // 其它路由元信息
  meta?: string;
  // 绑定的页面
  pageId?: number;
  // 绑定的文章分类ID
  articleCategoryId?: number;
  // 绑定的文章ID
  articleId?: number;
  // 绑定的表单ID
  formId?: number;
  // 绑定的书籍标识
  bookCode?: string;
  // 绑定的商品分类ID
  goodsCategoryId?: number;
  // 绑定的商品ID
  goodsId?: number;
  // 用户ID
  userId?: number;
  // 是否管理人员可见
  adminShow?: number;
  // 设为首页
  home?: number;
  // 分组名称
  groupName?: string;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 小程序端菜单搜索条件
 */
export interface CmsMpMenuParam extends PageParam {
  menuId?: number;
  keywords?: string;
}
