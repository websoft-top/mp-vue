import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsMpField, CmsMpFieldParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询小程序配置
 */
export async function pageCmsMpField(params: CmsMpFieldParam) {
  const res = await request.get<ApiResult<PageResult<CmsMpField>>>(
    MODULES_API_URL + '/cms/cms-mp-field/page',
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
 * 查询小程序配置列表
 */
export async function listCmsMpField(params?: CmsMpFieldParam) {
  const res = await request.get<ApiResult<CmsMpField[]>>(
    MODULES_API_URL + '/cms/cms-mp-field',
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
 * 添加小程序配置
 */
export async function addCmsMpField(data: CmsMpField) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改小程序配置
 */
export async function updateCmsMpField(data: CmsMpField) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-field',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除小程序配置
 */
export async function removeCmsMpField(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-field/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除小程序配置
 */
export async function removeBatchCmsMpField(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-mp-field/batch',
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
 * 根据id查询小程序配置
 */
export async function getCmsMpField(id: number) {
  const res = await request.get<ApiResult<CmsMpField>>(
    MODULES_API_URL + '/cms/cms-mp-field/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
