import type { PageParam } from '@/api';

/**
 * 聊天消息表
 */
export interface ChatConversation {
  // 自增ID
  id?: number;
  // 用户ID
  userId?: number;
  // 好友ID
  friendId?: number;
  // 消息类型
  type?: number;
  // 消息内容
  content?: string;
  // 未读消息
  unRead?: number;
  // 状态, 0未读, 1已读
  status?: number;
  // 是否删除, 0否, 1是
  deleted?: number;
  // 租户id
  tenantId?: number;
  // 注册时间
  createTime?: string;
  // 修改时间
  updateTime?: string;
}

/**
 * 聊天消息表搜索条件
 */
export interface ChatConversationParam extends PageParam {
  id?: number;
  keywords?: string;
}
