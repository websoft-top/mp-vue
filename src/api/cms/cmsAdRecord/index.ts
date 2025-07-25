import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsAdRecord, CmsAdRecordParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询广告图片
 */
export async function pageCmsAdRecord(params: CmsAdRecordParam) {
  const res = await request.get<ApiResult<PageResult<CmsAdRecord>>>(
    MODULES_API_URL + '/cms/cms-ad-record/page',
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
 * 查询广告图片列表
 */
export async function listCmsAdRecord(params?: CmsAdRecordParam) {
  const res = await request.get<ApiResult<CmsAdRecord[]>>(
    MODULES_API_URL + '/cms/cms-ad-record',
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
 * 添加广告图片
 */
export async function addCmsAdRecord(data: CmsAdRecord) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改广告图片
 */
export async function updateCmsAdRecord(data: CmsAdRecord) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除广告图片
 */
export async function removeCmsAdRecord(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad-record/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除广告图片
 */
export async function removeBatchCmsAdRecord(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-ad-record/batch',
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
 * 根据id查询广告图片
 */
export async function getCmsAdRecord(id: number) {
  const res = await request.get<ApiResult<CmsAdRecord>>(
    MODULES_API_URL + '/cms/cms-ad-record/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
