import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsLang, CmsLangParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询国际化
 */
export async function pageCmsLang(params: CmsLangParam) {
  const res = await request.get<ApiResult<PageResult<CmsLang>>>(
    MODULES_API_URL + '/cms/cms-lang/page',
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
 * 查询国际化列表
 */
export async function listCmsLang(params?: CmsLangParam) {
  const res = await request.get<ApiResult<CmsLang[]>>(
    MODULES_API_URL + '/cms/cms-lang',
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
 * 添加国际化
 */
export async function addCmsLang(data: CmsLang) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改国际化
 */
export async function updateCmsLang(data: CmsLang) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除国际化
 */
export async function removeCmsLang(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除国际化
 */
export async function removeBatchCmsLang(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang/batch',
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
 * 根据id查询国际化
 */
export async function getCmsLang(id: number) {
  const res = await request.get<ApiResult<CmsLang>>(
    MODULES_API_URL + '/cms/cms-lang/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
