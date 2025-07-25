import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Parameter, ParameterParam } from './model';
import {SERVER_API_URL} from '@/config/setting';

/**
 * 分页查询应用参数
 */
export async function pageParameter(params: ParameterParam) {
  const res = await request.get<ApiResult<PageResult<Parameter>>>(
    SERVER_API_URL + '/system/parameter/page',
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
 * 查询应用参数列表
 */
export async function listParameter(params?: ParameterParam) {
  const res = await request.get<ApiResult<Parameter[]>>(
    SERVER_API_URL + '/system/parameter',
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
 * 添加应用参数
 */
export async function addParameter(data: Parameter) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改应用参数
 */
export async function updateParameter(data: Parameter) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/parameter',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除应用参数
 */
export async function removeParameter(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/parameter/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除应用参数
 */
export async function removeBatchParameter(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/parameter/batch',
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
 * 根据id查询应用参数
 */
export async function getParameter(id: number) {
  const res = await request.get<ApiResult<Parameter>>(
    SERVER_API_URL + '/system/parameter/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
