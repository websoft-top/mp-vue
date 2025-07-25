import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Comment, CommentParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询应用评论
 */
export async function pageComment(params: CommentParam) {
  const res = await request.get<ApiResult<PageResult<Comment>>>(
    SERVER_API_URL + '/system/comment/page',
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
 * 查询应用评论列表
 */
export async function listComment(params?: CommentParam) {
  const res = await request.get<ApiResult<Comment[]>>(
    SERVER_API_URL + '/system/comment',
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
 * 添加应用评论
 */
export async function addComment(data: Comment) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用评论
 */
export async function updateComment(data: Comment) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用评论
 */
export async function removeComment(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/comment/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用评论
 */
export async function removeBatchComment(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/comment/batch',
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
 * 根据id查询应用评论
 */
export async function getComment(id: number) {
  const res = await request.get<ApiResult<Comment>>(
    SERVER_API_URL + '/system/comment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
