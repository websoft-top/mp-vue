import type { PageParam } from '@/api';

/**
 * 文章
 */
export interface CmsArticle {
  // 文章ID
  articleId?: number;
  // 文章标题
  title?: string;
  // 文章类型 0常规 1视频
  type?: number;
  // 文章模型
  model?: string;
  // 文章详情
  detail?: string;
  // 列表显示方式(10小图展示 20大图展示)
  showType?: number;
  // 话题
  topic?: string;
  // 标签
  tags?: any;
  // 父级ID
  parentId?: number;
  parentName?: string;
  // 栏目ID
  categoryId?: number;
  // 栏目名称
  categoryName?: string;
  // 封面图
  image?: string;
  // 来源
  source?: string;
  // 摘要
  overview?: string;
  // 虚拟阅读量(仅用作展示)
  virtualViews?: number;
  // 实际阅读量
  actualViews?: number;
  // 浏览权限(0公开 1会员 2密码)
  permission?: number;
  // 访问密码
  password?: string;
  // 确认密码
  password2?: string;
  // 发布来源客户端 (APP、H5、小程序等)
  platform?: string;
  // 文章附件
  files?: string;
  // 视频地址
  video?: string;
  // 接受的文件类型
  accept?: string;
  // 经度
  longitude?: string;
  // 纬度
  latitude?: string;
  // 所在省份
  province?: string;
  // 所在城市
  city?: string;
  // 所在辖区
  region?: string;
  // 街道地址
  address?: string;
  // 点赞数
  likes?: number;
  // 评论数
  commentNumbers?: number;
  // 提醒谁看
  toUsers?: string;
  // 文章内容
  content?: string;
  // 编辑器类型
  editor?: number;
  // PDF地址
  pdfUrl?: string;
  // 用户ID
  userId?: number;
  // 商户ID
  merchantId?: number;
  // 作者
  author?: string;
  // 语言
  lang?: string;
  // 是否推荐
  recommend?: number;
  // 是否同步翻译其他语言版本
  translation?: boolean;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0已发布, 1待审核 2已驳回 3违规内容
  status?: number;
  // 状态描述
  statusText?: string;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
  // 是否移动端
  isMobile?: boolean;
  // 二维码
  qrcode?: string;
  // 文章路径
  url?: string;
}

/**
 * 文章搜索条件
 */
export interface CmsArticleParam extends PageParam {
  articleId?: number;
  model?: string;
  status?: number;
  keywords?: string;
}

export interface CmsArticleCount {
  totalNum?: number;
  totalNum2?: number;
  totalNum3?: number;
  totalNum4?: number;
}
