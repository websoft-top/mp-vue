/**
 * token 操作封装
 */
import { APP_SECRET, TOKEN_STORE_NAME } from '@/config/setting';
import md5 from 'js-md5';

/**
 * 获取缓存的 token
 */
export function getToken(): string | null {
  const token = localStorage.getItem(TOKEN_STORE_NAME);
  if (!token) {
    return sessionStorage.getItem(TOKEN_STORE_NAME);
  }
  return token;
}

/**
 * 缓存 token
 * @param token token
 * @param remember 是否永久存储
 */
export function setToken(token?: string, remember?: boolean) {
  removeToken();
  if (token) {
    if (remember) {
      localStorage.setItem(TOKEN_STORE_NAME, token);
    } else {
      sessionStorage.setItem(TOKEN_STORE_NAME, token);
    }
  }
}

/**
 * 移除 token
 */
export function removeToken() {
  localStorage.removeItem(TOKEN_STORE_NAME);
  sessionStorage.removeItem(TOKEN_STORE_NAME);
  localStorage.clear();
}

// 封装签名
export function getSign(form) {
  if (form == null) {
    return false;
  }
  let sign = '';
  form.timestamp = new Date().getTime();
  form.version = 'v3';
  const arr = objKeySort(form);
  Object.keys(arr).forEach((k) => {
    if (form[k] != null && form[k] != '') {
      sign = sign.concat(form[k]).concat('-');
    }
  });
  sign = sign.concat(APP_SECRET);
  return md5(sign);
}
// 参数按照字母顺序排序
export const objKeySort = (obj) => {
  //排序的函数
  const newkey = Object.keys(obj).sort();
  //先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  const newObj = {}; //创建一个新的对象，用于存放排好序的键值对
  for (let i = 0; i < newkey.length; i++) {
    //遍历newkey数组
    newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
  }
  return newObj; //返回排好序的新对象
};
