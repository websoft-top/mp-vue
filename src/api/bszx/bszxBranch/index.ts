import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { BszxBranch, BszxBranchParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询百色中学-分部
 */
export async function pageBszxBranch(params: BszxBranchParam) {
  const res = await request.get<ApiResult<PageResult<BszxBranch>>>(
    MODULES_API_URL + '/bszx/bszx-branch/page',
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
 * 查询百色中学-分部列表
 */
export async function listBszxBranch(params?: BszxBranchParam) {
  const res = await request.get<ApiResult<BszxBranch[]>>(
    MODULES_API_URL + '/bszx/bszx-branch',
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
 * 添加百色中学-分部
 */
export async function addBszxBranch(data: BszxBranch) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-branch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改百色中学-分部
 */
export async function updateBszxBranch(data: BszxBranch) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-branch',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除百色中学-分部
 */
export async function removeBszxBranch(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-branch/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除百色中学-分部
 */
export async function removeBatchBszxBranch(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/bszx/bszx-branch/batch',
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
 * 根据id查询百色中学-分部
 */
export async function getBszxBranch(id: number) {
  const res = await request.get<ApiResult<BszxBranch>>(
    MODULES_API_URL + '/bszx/bszx-branch/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
