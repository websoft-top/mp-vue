import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticleCategory, CmsArticleCategoryParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询文章分类表
 */
export async function pageCmsArticleCategory(params: CmsArticleCategoryParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticleCategory>>>(
    MODULES_API_URL + '/cms/cms-article-category/page',
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
 * 查询文章分类表列表
 */
export async function listCmsArticleCategory(params?: CmsArticleCategoryParam) {
  const res = await request.get<ApiResult<CmsArticleCategory[]>>(
    MODULES_API_URL + '/cms/cms-article-category',
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
 * 添加文章分类表
 */
export async function addCmsArticleCategory(data: CmsArticleCategory) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-category',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文章分类表
 */
export async function updateCmsArticleCategory(data: CmsArticleCategory) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-category',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文章分类表
 */
export async function removeCmsArticleCategory(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-category/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文章分类表
 */
export async function removeBatchCmsArticleCategory(
  data: (number | undefined)[]
) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-category/batch',
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
 * 根据id查询文章分类表
 */
export async function getCmsArticleCategory(id: number) {
  const res = await request.get<ApiResult<CmsArticleCategory>>(
    MODULES_API_URL + '/cms/cms-article-category/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
