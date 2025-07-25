import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { User, UserParam } from './model';
import { SERVER_API_URL } from '@/config/setting';

/**
 * 分页查询用户
 */
export async function pageUsers(params: UserParam) {
  const res = await request.get<ApiResult<PageResult<User>>>(
    SERVER_API_URL + '/system/user/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 查询用户列表
 */
export async function listUsers(params?: UserParam) {
  const res = await request.get<ApiResult<User[]>>(
    SERVER_API_URL + '/system/user',
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
 * 查询用户列表
 */
export async function getStaffs(params?: UserParam) {
  const res = await request.get<ApiResult<User[]>>(
    SERVER_API_URL + '/system/user',
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
 * 查询用户列表
 */
export async function getCompanyList(params?: UserParam) {
  const res = await request.get<ApiResult<User[]>>(
    SERVER_API_URL + '/system/user',
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
 * 根据id查询用户
 */
export async function getUser(id: number) {
  const res = await request.get<ApiResult<User>>(
    SERVER_API_URL + '/system/user/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 添加用户
 */
export async function addUser(data: User) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改用户
 */
export async function updateUser(data: User) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除用户
 */
export async function removeUser(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除用户
 */
export async function removeUsers(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/batch',
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
 * 修改用户状态
 */
export async function updateUserStatus(userId?: number, status?: number) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/status',
    {
      userId,
      status
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改推荐状态
 */
export async function updateUserRecommend(form) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/recommend',
    form
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 重置用户密码
 */
export async function updateUserPassword(userId?: number, password = '123456') {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/password',
    {
      userId,
      password
    }
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 导入用户
 */
export async function importUsers(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/import',
    formData
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 检查用户是否存在
 */
export async function checkExistence(
  field: string,
  value: string,
  id?: number
) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/existence',
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
 * 统计用户余额
 */
export async function countUserBalance(params?: UserParam) {
  const res = await request.get<ApiResult<unknown>>(
    SERVER_API_URL + '/system/user/countUserBalance',
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
 * 选择管理员账号登录
 * @param params
 */
export async function listAdminsByPhoneAll(params?: UserParam){
  const res = await request.get<ApiResult<User[]>>(
    SERVER_API_URL + '/system/user/listAdminsByPhoneAll',
    {
      params
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
