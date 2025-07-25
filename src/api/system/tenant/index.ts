import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { Tenant, TenantParam } from './model';
import { Menu } from '@/api/system/menu/model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询租户
 */
export async function pageTenant(params: TenantParam) {
  // 租户列表查询需要传一个key
  // params.tenantCode = 'ZAcxbdmDQFwUKC3e';
  const res = await request.get<ApiResult<PageResult<Tenant>>>(
    SERVER_API_URL + '/system/tenant/page',
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
 * 查询租户资料
 */
export async function profile(params?: TenantParam) {
  const res = await request.get<ApiResult<Tenant>>(
    SERVER_API_URL + '/system/tenant/profile',
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
 * 查询租户列表
 */
export async function listTenant(params?: TenantParam) {
  const res = await request.get<ApiResult<Tenant[]>>(
    SERVER_API_URL + '/system/tenant',
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
 * 根据id查询
 */
export async function getTenant(id: number) {
  const res = await request.get<ApiResult<Tenant>>(
    SERVER_API_URL + '/system/tenant/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加租户
 */
export async function addTenant(data: Tenant) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改租户
 */
export async function updateTenant(data: Tenant) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除租户
 */
export async function removeTenant(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除租户
 */
export async function removeBatchTenant(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant/batch',
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
 * 重置用户密码
 */
export async function updateTenantPassword(
  tenantId?: number,
  password = 'gxwebsoft.com'
) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant/password',
    {
      tenantId,
      password
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查IP是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/tenant/existence',
    {
      params: { field, value, id }
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 租户初始化
 */
export async function initialization(roleId?: number) {
  const res = await request.get<ApiResult<Menu[]>>(
    SERVER_API_URL + '/system/tenant/role-menu/' + roleId
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
