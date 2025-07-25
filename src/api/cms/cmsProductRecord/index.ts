import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsProductRecord, CmsProductRecordParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询插件安装明细
 */
export async function pageCmsProductRecord(params: CmsProductRecordParam) {
  const res = await request.get<ApiResult<PageResult<CmsProductRecord>>>(
    MODULES_API_URL + '/cms/cms-product-record/page',
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
 * 查询插件安装明细列表
 */
export async function listCmsProductRecord(params?: CmsProductRecordParam) {
  const res = await request.get<ApiResult<CmsProductRecord[]>>(
    MODULES_API_URL + '/cms/cms-product-record',
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
 * 添加插件安装明细
 */
export async function addCmsProductRecord(data: CmsProductRecord) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改插件安装明细
 */
export async function updateCmsProductRecord(data: CmsProductRecord) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除插件安装明细
 */
export async function removeCmsProductRecord(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-record/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除插件安装明细
 */
export async function removeBatchCmsProductRecord(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-product-record/batch',
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
 * 根据id查询插件安装明细
 */
export async function getCmsProductRecord(id: number) {
  const res = await request.get<ApiResult<CmsProductRecord>>(
    MODULES_API_URL + '/cms/cms-product-record/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
