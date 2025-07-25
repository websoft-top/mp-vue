import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ChatConversation, ChatConversationParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询聊天消息表
 */
export async function pageChatConversation(params: ChatConversationParam) {
  const res = await request.get<ApiResult<PageResult<ChatConversation>>>(
    MODULES_API_URL + '/shop/chat-conversation/page',
    {
      params
    }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询聊天消息表列表
 */
export async function listChatConversation(params?: ChatConversationParam) {
  const res = await request.get<ApiResult<ChatConversation[]>>(
    MODULES_API_URL + '/shop/chat-conversation',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加聊天消息表
 */
export async function addChatConversation(data: ChatConversation) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/chat-conversation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改聊天消息表
 */
export async function updateChatConversation(data: ChatConversation) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/chat-conversation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除聊天消息表
 */
export async function removeChatConversation(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/chat-conversation/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除聊天消息表
 */
export async function removeBatchChatConversation(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/shop/chat-conversation/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询聊天消息表
 */
export async function getChatConversation(id: number) {
  const res = await request.get<ApiResult<ChatConversation>>(
    MODULES_API_URL + '/shop/chat-conversation/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
