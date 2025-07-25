import type { PageParam } from '@/api';

/**
 * 网站导航记录表
 */
export interface CmsNavigation {
  // ID
  navigationId?: number;
  // 上级id, 0是顶级
  parentId?: number;
  // 菜单名称
  title?: string;
  // 模型
  model?: string;
  // 标识
  code?: string;
  // 菜单路由地址
  path?: string;
  // 菜单组件地址, 目录可为空
  component?: string;
  componentPath?: string;
  // 打开位置
  target?: string;
  // 菜单图标
  icon?: string;
  // banner图片
  banner?: string;
  // 图标颜色
  color?: string;
  // 是否隐藏, 0否, 1是(仅注册路由不显示在左侧菜单)
  hide?: number;
  // 可见类型 0所有人 1登录可见 2密码可见
  permission?: number;
  // 访问密码
  password?: string;
  // 位置 0不限 1顶部 2底部
  position?: number;
  // 仅在顶部显示
  top?: number;
  // 仅在底部显示
  bottom?: number;
  // 菜单侧栏选中的path
  active?: string;
  // 其它路由元信息
  meta?: string;
  // css样式
  style?: string;
  // 父级栏目路由
  parentPath?: string;
  // 父级栏目名称
  parentName?: string;
  // 父级栏目位置
  parentPosition?: number;
  // 模型名称
  modelName?: string;
  // 类型（已废弃）
  type?: number;
  // 绑定的页面（已废弃）
  pageId?: number;
  // 项目ID
  itemId?: number;
  // 是否微信小程序菜单
  isMpWeixin?: string;
  gutter?: number;
  span?: number;
  readNum?: number;
  // 用户ID
  userId?: number;
  // 国际化语言
  lang?: string;
  // 设为首页
  home?: number;
  // 是否推荐
  recommend?: boolean;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 状态, 0正常, 1冻结
  status?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  children?: CmsNavigation[];
  disabled?: boolean;
  label?: string;
  value?: number;
  suffix?: string;
  showBanner?: boolean;
  showLayout?: boolean;
  langCategoryId?: number;
}

/**
 * 网站导航记录表搜索条件
 */
export interface CmsNavigationParam extends PageParam {
  navigationId?: number;
  model?: string;
  lang?: string;
  recommend?: boolean;
  keywords?: string;
}
