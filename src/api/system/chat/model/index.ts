import type { PageParam } from '@/api';
import type { User } from '@/api/system/user/model';

export interface ChatConversation {
  id?: number;
  userId?: number;
  friendId?: number;
  userInfo?: User;
  friendInfo?: User;
  content: string;
  messages: ChatMessage[];
  unRead: number;
  createTime?: string;
  updateTime: string | number | Date;
}

export interface ChatMessage {
  id?: number;
  formUserId?: number;
  formUserInfo?: User;
  toUserInfo?: User;
  toUserId?: number;
  type: string;
  content: string;
  status?: number;
  createTime?: number;
  updateTime?: number;
}

/**
 * 搜索条件
 */
export interface ChatConversationParam extends PageParam {
  userId?: number;
  status: number;
  onlyFake: boolean;
  keywords: string;
}

/**
 * 搜索条件
 */
export interface ChatMessageParam extends PageParam {
  formUserId?: number;
  toUserId?: number;
  type?: string;
  status?: number;
  keywords: string;
}
