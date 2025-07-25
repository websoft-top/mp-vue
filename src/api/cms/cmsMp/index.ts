import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMp, CmsMpParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序信息
 */
export async function pageCmsMp(params: CmsMpParam) {
  const res = await request.get<ApiResult<PageResult<CmsMp>>>(
    MODULES_API_URL + '/cms/cms-mp/page',
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
 * 查询小程序信息列表
 */
export async function listCmsMp(params?: CmsMpParam) {
  const res = await request.get<ApiResult<CmsMp[]>>(
    MODULES_API_URL + '/cms/cms-mp',
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
 * 添加小程序信息
 */
export async function addCmsMp(data: CmsMp) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改小程序信息
 */
export async function updateCmsMp(data: CmsMp) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除小程序信息
 */
export async function removeCmsMp(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序信息
 */
export async function removeBatchCmsMp(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp/batch',
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
 * 根据id查询小程序信息
 */
export async function getCmsMp(id: number) {
  const res = await request.get<ApiResult<CmsMp>>(
    MODULES_API_URL + '/cms/cms-mp/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
