import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type {
  ChatConversation,
  ChatConversationParam,
  ChatMessage,
  ChatMessageParam
} from '@/api/system/chat/model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 查询聊天列表
 */
export async function pageChatConversation(params: ChatConversationParam) {
  const res = await request.get<ApiResult<PageResult<ChatConversation>>>(
    SERVER_API_URL + '/system/chat-conversation/page',
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
 * 查询聊天列表
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
 * 查询日志列表
 */
export async function listChatConversation(params?: ChatConversationParam) {
  const res = await request.get<ApiResult<ChatConversation[]>>(
    SERVER_API_URL + '/system/chat-conversation',
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
 * 添加日志
 */
export async function addChatMessage(data: ChatMessage) {
  const res = await request.post<ApiResult<ChatConversation>>(
    SERVER_API_URL + '/system/chat-message',
    data
  );
  if (res.data.code === 0) {
    return res.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加日志
 */
export async function addChatConversation(data: ChatConversation) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改日志
 */
export async function updateChatConversation(data: any) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 绑定日志
 */
export async function bindChatConversation(data: ChatConversation) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation/bind',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量添加
 */
export async function addBatchChatConversation(data: ChatConversation[]) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation/batch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除日志
 */
export async function removeChatConversation(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除日志
 */
export async function removeBatchChatConversation(
  data: (number | undefined)[]
) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/chat-conversation/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
