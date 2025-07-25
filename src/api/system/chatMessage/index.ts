import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { ChatMessage, ChatMessageParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询聊天消息表
 */
export async function pageChatMessage(params: ChatMessageParam) {
  const res = await request.get<ApiResult<PageResult<ChatMessage>>>(
    SERVER_API_URL + '/system/chat-message/page',
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
export async function listChatMessage(params?: ChatMessageParam) {
  const res = await request.get<ApiResult<ChatMessage[]>>(
    SERVER_API_URL + '/system/chat-message',
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
export async function addChatMessage(data: ChatMessage) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-message',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加聊天消息表
 */
export async function addBatchChatMessage(data: ChatMessage[]) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-message/batch',
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
export async function updateChatMessage(data: ChatMessage) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-message',
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
export async function removeChatMessage(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-message/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除聊天消息表
 */
export async function removeBatchChatMessage(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-message/batch',
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
export async function getChatMessage(id: number) {
  const res = await request.get<ApiResult<ChatMessage>>(
    SERVER_API_URL + '/system/chat-message/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
