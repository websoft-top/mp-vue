import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Grade, GradeParam } from '@/api/user/grade/model';
import { SERVER_API_URL } from '@/config/setting';
/**
 * 分页查询仓库
 */
export async function pageGrade(params: GradeParam) {
  const res = await request.get<ApiResult<PageResult<Grade>>>(
    SERVER_API_URL + '/system/user-grade/page',
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
 * 查询仓库列表
 */
export async function listGrade(params?: GradeParam) {
  const res = await request.get<ApiResult<Grade[]>>('/system/user-grade', {
    params
  });
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加仓库
 */
export async function addGrade(data: Grade) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-grade',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改仓库
 */
export async function updateGrade(data: Grade) {
  const res = await request.put<ApiResult<unknown>>('/system/user-grade', data);
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 绑定仓库
 */
export async function bindGrade(data: Grade) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-grade/bind',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量添加设备
 */
export async function addBatchGrade(data: Grade[]) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-grade/batch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除仓库
 */
export async function removeGrade(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-grade/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除仓库
 */
export async function removeBatchGrade(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user-grade/batch',
    {
      data
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
