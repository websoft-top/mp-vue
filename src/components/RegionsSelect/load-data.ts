import request from '@/utils/request';
import type { RegionsData } from './types';
const BASE_URL = import.meta.env.BASE_URL;
let reqPromise: Promise<RegionsData[]>;

/**
 * 获取省市区数据
 */
export function getRegionsData() {
  if (!reqPromise) {
    reqPromise = new Promise<RegionsData[]>((resolve, reject) => {
      request
        .get<RegionsData[]>(BASE_URL + 'json/regions-data.json', {
          baseURL: ''
        })
        .then((res) => {
          resolve(res.data ?? []);
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
  return reqPromise;
}
