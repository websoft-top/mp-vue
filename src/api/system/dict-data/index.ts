import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { DictData, DictDataParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询字典数据
 */
export async function pageDictData(params: DictDataParam) {
  const res = await request.get<ApiResult<PageResult<DictData>>>(
    SERVER_API_URL + '/system/dict-data/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询字典数据列表
 */
export async function listDictData(params: DictDataParam) {
  const res = await request.get<ApiResult<DictData[]>>(
    SERVER_API_URL + '/system/dict-data',
    { params }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加字典数据
 */
export async function addDictData(data: DictData) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict-data',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改字典数据
 */
export async function updateDictData(data: DictData) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict-data',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除字典数据
 */
export async function removeDictData(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict-data/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除字典数据
 */
export async function removeDictDataBatch(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/dict-data/batch',
    { data }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}
