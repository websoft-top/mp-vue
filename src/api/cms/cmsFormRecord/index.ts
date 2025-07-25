import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsFormRecord, CmsFormRecordParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询表单数据记录表
 */
export async function pageCmsFormRecord(params: CmsFormRecordParam) {
  const res = await request.get<ApiResult<PageResult<CmsFormRecord>>>(
    MODULES_API_URL + '/cms/cms-form-record/page',
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
 * 查询表单数据记录表列表
 */
export async function listCmsFormRecord(params?: CmsFormRecordParam) {
  const res = await request.get<ApiResult<CmsFormRecord[]>>(
    MODULES_API_URL + '/cms/cms-form-record',
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
 * 添加表单数据记录表
 */
export async function addCmsFormRecord(data: CmsFormRecord) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改表单数据记录表
 */
export async function updateCmsFormRecord(data: CmsFormRecord) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除表单数据记录表
 */
export async function removeCmsFormRecord(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form-record/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除表单数据记录表
 */
export async function removeBatchCmsFormRecord(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-form-record/batch',
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
 * 根据id查询表单数据记录表
 */
export async function getCmsFormRecord(id: number) {
  const res = await request.get<ApiResult<CmsFormRecord>>(
    MODULES_API_URL + '/cms/cms-form-record/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
