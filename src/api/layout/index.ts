import request from '@/utils/request';
import type { ApiResult } from '@/api';
import type { User } from '@/api/system/user/model';
import type { UpdatePasswordParam, NoticeResult } from './model';
import {MODULES_API_URL, SERVER_API_URL} from '@/config/setting';
import { Company } from '@/api/system/company/model';
import { CmsWebsite } from '@/api/cms/cmsWebsite/model';
import {Menu} from "@/api/system/menu/model";
import {getLang} from "@/utils/common";

/**
 * 获取当前登录的用户信息、菜单、权限、角色
 */
export async function getTenantInfo(): Promise<Company> {
  const res = await request.get<ApiResult<Company>>(
    SERVER_API_URL + '/auth/tenant'
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取网站信息 https://cms-api.websoft.top/api
 */
export async function getSiteInfo() {
  const res = await request.get<ApiResult<CmsWebsite>>(
    MODULES_API_URL + '/cms/cms-website/getSiteInfo',
    {
      params: {
        lang: getLang()
      }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取当前登录的用户信息、菜单、权限、角色
 */
export async function getUserInfo(): Promise<User> {
  const res = await request.get<ApiResult<User>>(SERVER_API_URL + '/auth/user');
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改当前登录用户信息
 */
export async function updateLoginUser(data: User) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/auth/user',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取服务器时间(实时)
 * @return
 */
export async function getServerTime() {
  const res = await request.get<ApiResult<any>>(
    MODULES_API_URL + '/cms/website/getServerTime'
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 获取未来7天的日期
 * @return
 */
export async function getNext7day() {
  const res = await request.get<ApiResult<any>>(
    MODULES_API_URL + '/cms/website/getNext7day'
  );
  console.log('res.data.code: ', res.data.code);
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 向子模块传递token
 * @param url
 */
export async function transferToken(url: string): Promise<string> {
  const res = await request.get<ApiResult<unknown>>(url);
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改当前登录的用户密码
 */
export async function updatePassword(
  data: UpdatePasswordParam
): Promise<string> {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/auth/password',
    data
  );
  if (res.data.code === 0) {
    return res.data.message ?? '修改成功';
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 创建完整网站并初始化
 */
export async function createCmsWebSite(data: CmsWebsite){
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/superAdminRegister',data
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

/**
 * 查询未读通知
 */
export async function getUnreadNotice(): Promise<NoticeResult> {
  return {
    notice: [],
    letter: [],
    todo: []
  };
}
