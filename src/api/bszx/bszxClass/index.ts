import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxClass, BszxClassParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询百色中学-班级
 */
export async function pageBszxClass(params: BszxClassParam) {
  const res = await request.get<ApiResult<PageResult<BszxClass>>>(
    MODULES_API_URL + '/bszx/bszx-class/page',
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
 * 查询百色中学-班级列表
 */
export async function listBszxClass(params?: BszxClassParam) {
  const res = await request.get<ApiResult<BszxClass[]>>(
    MODULES_API_URL + '/bszx/bszx-class',
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
 * 添加百色中学-班级
 */
export async function addBszxClass(data: BszxClass) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-class',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-班级
 */
export async function updateBszxClass(data: BszxClass) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-class',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-班级
 */
export async function removeBszxClass(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-class/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-班级
 */
export async function removeBatchBszxClass(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-class/batch',
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
 * 根据id查询百色中学-班级
 */
export async function getBszxClass(id: number) {
  const res = await request.get<ApiResult<BszxClass>>(
    MODULES_API_URL + '/bszx/bszx-class/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
