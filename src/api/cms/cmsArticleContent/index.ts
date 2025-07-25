import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsArticleContent, CmsArticleContentParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询文章记录表
 */
export async function pageCmsArticleContent(params: CmsArticleContentParam) {
  const res = await request.get<ApiResult<PageResult<CmsArticleContent>>>(
    MODULES_API_URL + '/cms/cms-article-content/page',
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
 * 查询文章记录表列表
 */
export async function listCmsArticleContent(params?: CmsArticleContentParam) {
  const res = await request.get<ApiResult<CmsArticleContent[]>>(
    MODULES_API_URL + '/cms/cms-article-content',
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
 * 添加文章记录表
 */
export async function addCmsArticleContent(data: CmsArticleContent) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文章记录表
 */
export async function updateCmsArticleContent(data: CmsArticleContent) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-content',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文章记录表
 */
export async function removeCmsArticleContent(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-content/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文章记录表
 */
export async function removeBatchCmsArticleContent(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-article-content/batch',
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
 * 根据id查询文章记录表
 */
export async function getCmsArticleContent(id: number) {
  const res = await request.get<ApiResult<CmsArticleContent>>(
    MODULES_API_URL + '/cms/cms-article-content/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
