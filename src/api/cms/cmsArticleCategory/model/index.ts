import type { PageParam } from '@/api';

/**
 * 文章分类表
 */
export interface CmsArticleCategory {
  // 文章分类ID
  categoryId?: number;
  // 分类标识
  categoryCode?: string;
  // 分类名称
  title?: string;
  // 类型 0列表 1单页 2外链
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
  // 文章数量
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
  // 状态, 0正常, 1禁用
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  value?: number;
  label?: string;
}

/**
 * 文章分类表搜索条件
 */
export interface CmsArticleCategoryParam extends PageParam {
  categoryId?: number;
  keywords?: string;
}
