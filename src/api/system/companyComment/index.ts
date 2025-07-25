import request from '@/utils/request';
import type {ApiResult, PageResult} from '@/api';
import type {CompanyComment, CompanyCommentParam} from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用评论
 */
export async function pageCompanyComment(params: CompanyCommentParam) {
  const res = await request.get<ApiResult<PageResult<CompanyComment>>>(
    SERVER_API_URL + '/system/company-comment/page',
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
export async function listCompanyComment(params?: CompanyCommentParam) {
  const res = await request.get<ApiResult<CompanyComment[]>>(
    SERVER_API_URL + '/system/company-comment',
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
export async function addCompanyComment(data: CompanyComment) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-comment',
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
export async function updateCompanyComment(data: CompanyComment) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-comment',
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
export async function removeCompanyComment(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-comment/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用评论
 */
export async function removeBatchCompanyComment(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/company-comment/batch',
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
export async function getCompanyComment(id: number) {
  const res = await request.get<ApiResult<CompanyComment>>(
    SERVER_API_URL + '/system/company-comment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
