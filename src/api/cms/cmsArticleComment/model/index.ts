import type { PageParam } from '@/api';

/**
 * 文章评论表
 */
export interface CmsArticleComment {
  // 评价ID
  commentId?: number;
  // 文章ID
  articleId?: number;
  // 评分 (10好评 20中评 30差评)
  score?: number;
  // 评价内容
  content?: string;
  // 是否为图片评价
  isPicture?: number;
  // 评论者ID
  userId?: number;
  // 被评价者ID
  toUserId?: number;
  // 回复的评论ID
  replyCommentId?: number;
  // 回复者ID
  replyUserId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0未读, 1已读
  status?: number;
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
 * 文章评论表搜索条件
 */
export interface CmsArticleCommentParam extends PageParam {
  commentId?: number;
  keywords?: string;
}
