import type { PageParam } from '@/api';

/**
 * 表单设计表
 */
export interface CmsForm {
  // ID
  formId?: number;
  // 表单标题
  name?: string;
  // 顶部图片
  photo?: string;
  // 背景图片
  background?: string;
  // 视频文件
  video?: string;
  // 提交次数
  submitNumber?: number;
  // 页面布局
  layout?: string;
  // 是否隐藏顶部图片
  hidePhoto?: number;
  // 是否隐藏背景图片
  hideBackground?: number;
  // 是否隐藏视频
  hideVideo?: number;
  // 背景图片透明度
  opacity?: string;
  // 用户ID
  userId?: number;
  // 商户ID
  merchantId?: number;
  // 排序(数字越小越靠前)
  sortNumber?: number;
  // 备注
  comments?: string;
  // 状态, 0正常, 1冻结
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 创建时间
  createTime?: string;
}

/**
 * 表单设计表搜索条件
 */
export interface CmsFormParam extends PageParam {
  formId?: number;
  keywords?: string;
}
