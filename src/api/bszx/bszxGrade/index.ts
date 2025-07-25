import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxGrade, BszxGradeParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询百色中学-年级
 */
export async function pageBszxGrade(params: BszxGradeParam) {
  const res = await request.get<ApiResult<PageResult<BszxGrade>>>(
    MODULES_API_URL + '/bszx/bszx-grade/page',
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
 * 查询百色中学-年级列表
 */
export async function listBszxGrade(params?: BszxGradeParam) {
  const res = await request.get<ApiResult<BszxGrade[]>>(
    MODULES_API_URL + '/bszx/bszx-grade',
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
 * 添加百色中学-年级
 */
export async function addBszxGrade(data: BszxGrade) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-grade',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-年级
 */
export async function updateBszxGrade(data: BszxGrade) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-grade',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-年级
 */
export async function removeBszxGrade(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-grade/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-年级
 */
export async function removeBatchBszxGrade(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-grade/batch',
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
 * 根据id查询百色中学-年级
 */
export async function getBszxGrade(id: number) {
  const res = await request.get<ApiResult<BszxGrade>>(
    MODULES_API_URL + '/bszx/bszx-grade/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
