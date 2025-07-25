import request from '@/utils/request';
import type {ApiResult, PageResult} from '@/api';
import type {CmsProductComment, CmsProductCommentParam} from './model';
import {MODULES_API_URL} from '@/config/setting';

/**
 * 分页查询产品评论
 */
export async function pageCmsProductComment(params: CmsProductCommentParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductComment>>>(
    MODULES_API_URL + '/cms/cms-product-comment/page',
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
 * 查询产品评论列表
 */
export async function listCmsProductComment(params?: CmsProductCommentParam) {
  const res = await request.get<ApiResult<CmsProductComment[]>>(
    MODULES_API_URL + '/cms/cms-product-comment',
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
 * 添加产品评论
 */
export async function addCmsProductComment(data: CmsProductComment) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改产品评论
 */
export async function updateCmsProductComment(data: CmsProductComment) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-comment',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除产品评论
 */
export async function removeCmsProductComment(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-comment/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除产品评论
 */
export async function removeBatchCmsProductComment(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-comment/batch',
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
 * 根据id查询产品评论
 */
export async function getCmsProductComment(id: number) {
  const res = await request.get<ApiResult<CmsProductComment>>(
    MODULES_API_URL + '/cms/cms-product-comment/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
