import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDesignCollect, CmsDesignCollectParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询设计征集
 */
export async function pageCmsDesignCollect(params: CmsDesignCollectParam) {
  const res = await request.get<ApiResult<PageResult<CmsDesignCollect>>>(
    MODULES_API_URL + '/cms/cms-design-collect/page',
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
 * 查询设计征集列表
 */
export async function listCmsDesignCollect(params?: CmsDesignCollectParam) {
  const res = await request.get<ApiResult<CmsDesignCollect[]>>(
    MODULES_API_URL + '/cms/cms-design-collect',
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
 * 添加设计征集
 */
export async function addCmsDesignCollect(data: CmsDesignCollect) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-collect',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改设计征集
 */
export async function updateCmsDesignCollect(data: CmsDesignCollect) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-collect',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除设计征集
 */
export async function removeCmsDesignCollect(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-collect/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除设计征集
 */
export async function removeBatchCmsDesignCollect(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-collect/batch',
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
 * 根据id查询设计征集
 */
export async function getCmsDesignCollect(id: number) {
  const res = await request.get<ApiResult<CmsDesignCollect>>(
    MODULES_API_URL + '/cms/cms-design-collect/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
