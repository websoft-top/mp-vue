/**
 * axios 实例
 */
import axios from 'axios';
import type { AxiosResponse } from 'axios';
import { unref } from 'vue';
import router from '@/router';
import { Modal } from 'ant-design-vue';
import { API_BASE_URL, TOKEN_HEADER_NAME, LAYOUT_PATH } from '@/config/setting';
import { getToken, setToken } from './token-util';
import { logout } from './page-tab-util';
import type { ApiResult } from '@/api';
import { getHostname, getTenantId } from '@/utils/domain';
import { getMerchantId } from "@/utils/merchant";

const service = axios.create({
  baseURL: API_BASE_URL
});

/**
 * 添加请求拦截器
 */
service.interceptors.request.use(
  (config) => {
    const TENANT_ID = getTenantId();
    const token = getToken();
    // 添加 token 到 header
    if (token && config.headers) {
      config.headers.common[TOKEN_HEADER_NAME] = token;
    }
    // 获取租户ID
    if (config.headers) {
      // 附加企业ID
      const companyId = localStorage.getItem('CompanyId');
      if (companyId) {
        config.headers.common['CompanyId'] = companyId;
      }
      // 附加商户ID
      if (getMerchantId()) {
        config.headers.common['MerchantId'] = getMerchantId();
      }
      // 通过网站域名获取租户ID
      if (getHostname()) {
        config.headers.common['Domain'] = getHostname();
      }
      // 解析二级域名获取租户ID
      if (getTenantId()) {
        config.headers.common['TenantId'] = getTenantId();
        return config;
      }
      if (TENANT_ID) {
        config.headers.common['TenantId'] = TENANT_ID;
        return config;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 添加响应拦截器
 */
service.interceptors.response.use(
  (res: AxiosResponse<ApiResult<unknown>>) => {
    // 登录过期处理
    if (res.data?.code === 401) {
      const currentPath = unref(router.currentRoute).path;
      if (currentPath == LAYOUT_PATH) {
        logout(true);
      } else {
        Modal.destroyAll();
        Modal.info({
          title: '系统提示',
          content: '登录状态已过期, 请退出重新登录!',
          okText: '重新登录',
          onOk: () => {
            logout(false, currentPath);
          }
        });
      }
      return Promise.reject(new Error(res.data.message));
    }
    // token 自动续期
    const token = res.headers[TOKEN_HEADER_NAME.toLowerCase()];
    if (token) {
      setToken(token);
    }
    return res;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
