import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { CmsDesignSignUp, CmsDesignSignUpParam } from './model';
import { MODULES_API_URL } from '@/config/setting';

/**
 * 分页查询设计征集报名
 */
export async function pageCmsDesignSignUp(params: CmsDesignSignUpParam) {
  const res = await request.get<ApiResult<PageResult<CmsDesignSignUp>>>(
    MODULES_API_URL + '/cms/cms-design-sign-up/page',
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
 * 查询设计征集报名列表
 */
export async function listCmsDesignSignUp(params?: CmsDesignSignUpParam) {
  const res = await request.get<ApiResult<CmsDesignSignUp[]>>(
    MODULES_API_URL + '/cms/cms-design-sign-up',
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
 * 添加设计征集报名
 */
export async function addCmsDesignSignUp(data: CmsDesignSignUp) {
  const res = await request.post<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-sign-up',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改设计征集报名
 */
export async function updateCmsDesignSignUp(data: CmsDesignSignUp) {
  const res = await request.put<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-sign-up',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除设计征集报名
 */
export async function removeCmsDesignSignUp(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-sign-up/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除设计征集报名
 */
export async function removeBatchCmsDesignSignUp(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    MODULES_API_URL + '/cms/cms-design-sign-up/batch',
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
 * 根据id查询设计征集报名
 */
export async function getCmsDesignSignUp(id: number) {
  const res = await request.get<ApiResult<CmsDesignSignUp>>(
    MODULES_API_URL + '/cms/cms-design-sign-up/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
