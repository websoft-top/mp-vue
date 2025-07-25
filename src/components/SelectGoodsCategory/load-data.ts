import request from '@/utils/request';
import type { IndustryData } from './types';
const BASE_URL = import.meta.env.BASE_URL;
let reqPromise: Promise<IndustryData[]>;

/**
 * 获取省市区数据
 */
export function getIndustryData() {
  if (!reqPromise) {
    reqPromise = new Promise<IndustryData[]>((resolve, reject) => {
      request
        .get<IndustryData[]>(BASE_URL + 'json/industry-data.json', {
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
