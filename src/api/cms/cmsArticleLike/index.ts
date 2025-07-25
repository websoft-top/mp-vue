import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticleLike, CmsArticleLikeParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询点赞文章
 */
export async function pageCmsArticleLike(params: CmsArticleLikeParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticleLike>>>(
    MODULES_API_URL + '/cms/cms-article-like/page',
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
export async function listCmsArticleLike(params?: CmsArticleLikeParam) {
  const res = await request.get<ApiResult<CmsArticleLike[]>>(
    MODULES_API_URL + '/cms/cms-article-like',
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
export async function addCmsArticleLike(data: CmsArticleLike) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-like',
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
export async function updateCmsArticleLike(data: CmsArticleLike) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-like',
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
export async function removeCmsArticleLike(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-like/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除点赞文章
 */
export async function removeBatchCmsArticleLike(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-like/batch',
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
export async function getCmsArticleLike(id: number) {
  const res = await request.get<ApiResult<CmsArticleLike>>(
    MODULES_API_URL + '/cms/cms-article-like/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
