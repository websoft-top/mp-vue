import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticleCount, CmsArticleCountParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询点赞文章
 */
export async function pageCmsArticleCount(params: CmsArticleCountParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticleCount>>>(
    MODULES_API_URL + '/cms/cms-article-count/page',
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
 * 查询点赞文章列表
 */
export async function listCmsArticleCount(params?: CmsArticleCountParam) {
  const res = await request.get<ApiResult<CmsArticleCount[]>>(
    MODULES_API_URL + '/cms/cms-article-count',
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
 * 添加点赞文章
 */
export async function addCmsArticleCount(data: CmsArticleCount) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-count',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改点赞文章
 */
export async function updateCmsArticleCount(data: CmsArticleCount) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-count',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除点赞文章
 */
export async function removeCmsArticleCount(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-count/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除点赞文章
 */
export async function removeBatchCmsArticleCount(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-count/batch',
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
 * 根据id查询点赞文章
 */
export async function getCmsArticleCount(id: number) {
  const res = await request.get<ApiResult<CmsArticleCount>>(
    MODULES_API_URL + '/cms/cms-article-count/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
