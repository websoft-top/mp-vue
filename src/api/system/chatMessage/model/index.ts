import type { PageParam } from '@/api';

/**
 * 聊天消息表
 */
export interface ChatMessage {
  // 自增ID
  id?: number;
  // 发送人ID
  formUserId?: number;
  // 接收人ID
  toUserId?: number;
  // 消息类型
  type?: string;
  // 消息内容
  content?: string;
  // 屏蔽接收方
  sideTo?: number;
  // 屏蔽发送方
  sideFrom?: number;
  // 是否撤回
  withdraw?: number;
  // 文件信息
  fileInfo?: string;
  toUserName?: any;
  formUserName?: string;
  // 批量发送
  toUserIds?: any[];
  // 存在联系方式
  hasContact?: number;
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
export interface ChatMessageParam extends PageParam {
  id?: number;
  keywords?: string;
}
