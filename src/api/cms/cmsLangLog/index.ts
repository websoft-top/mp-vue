import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsLangLog, CmsLangLogParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询国际化记录启用
 */
export async function pageCmsLangLog(params: CmsLangLogParam) {
  const res = await request.get<ApiResult<PageResult<CmsLangLog>>>(
    MODULES_API_URL + '/cms/cms-lang-log/page',
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
 * 查询国际化记录启用列表
 */
export async function listCmsLangLog(params?: CmsLangLogParam) {
  const res = await request.get<ApiResult<CmsLangLog[]>>(
    MODULES_API_URL + '/cms/cms-lang-log',
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
 * 添加国际化记录启用
 */
export async function addCmsLangLog(data: CmsLangLog) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改国际化记录启用
 */
export async function updateCmsLangLog(data: CmsLangLog) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang-log',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除国际化记录启用
 */
export async function removeCmsLangLog(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang-log/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除国际化记录启用
 */
export async function removeBatchCmsLangLog(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-lang-log/batch',
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
 * 根据id查询国际化记录启用
 */
export async function getCmsLangLog(id: number) {
  const res = await request.get<ApiResult<CmsLangLog>>(
    MODULES_API_URL + '/cms/cms-lang-log/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
