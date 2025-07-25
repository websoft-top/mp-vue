import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDesignRecord, CmsDesignRecordParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询页面组件表
 */
export async function pageCmsDesignRecord(params: CmsDesignRecordParam) {
  const res = await request.get<ApiResult<PageResult<CmsDesignRecord>>>(
    MODULES_API_URL + '/cms/cms-design-record/page',
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
 * 查询页面组件表列表
 */
export async function listCmsDesignRecord(params?: CmsDesignRecordParam) {
  const res = await request.get<ApiResult<CmsDesignRecord[]>>(
    MODULES_API_URL + '/cms/cms-design-record',
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
 * 添加页面组件表
 */
export async function addCmsDesignRecord(data: CmsDesignRecord) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改页面组件表
 */
export async function updateCmsDesignRecord(data: CmsDesignRecord) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-record',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除页面组件表
 */
export async function removeCmsDesignRecord(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-record/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除页面组件表
 */
export async function removeBatchCmsDesignRecord(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-record/batch',
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
 * 根据id查询页面组件表
 */
export async function getCmsDesignRecord(id: number) {
  const res = await request.get<ApiResult<CmsDesignRecord>>(
    MODULES_API_URL + '/cms/cms-design-record/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
