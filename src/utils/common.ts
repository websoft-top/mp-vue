import { message, SelectProps } from 'ant-design-vue';
import { isExternalLink, random, toDateString } from 'ele-admin-pro';
import router from '@/router';
import { listDictionaryData } from '@/api/system/dictionary-data';
import { ref, unref } from 'vue';
import { APP_SECRET, FILE_SERVER } from '@/config/setting';
import { useUserStore } from '@/store/modules/user';
import CryptoJS from 'crypto-js';
// import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import {getSiteDomain, getTenantId} from '@/utils/domain';
import { uuid } from 'ele-admin-pro';
import mitt from 'mitt';
import {ChatMessage} from "@/api/system/chat/model";
type Events = {
  message: ChatMessage;
};
export const emitter = mitt<Events>();
/**
 * 常用函数封装
 */

// 生成编号
export function createCode(): string {
  const data = new Date();
  const code = `${data.getFullYear()}${data.getMonth()}${data.getDate()}${data.getHours()}${data.getMilliseconds()}`;
  return code.slice(0);
}

// 生成商户编号
export function createMerchantCode(): string {
  const data = new Date();
  const code = `${data.getFullYear()}${data.getMonth()}${data.getDate()}${data.getSeconds()}`;
  return code.slice(3);
}

// 生成订单编号
export function createOrderNo(): string {
  const data = new Date();
  const code = `${data.getFullYear()}${data.getMonth()}${data.getDate()}${data.getHours()}${data.getMilliseconds()}${random(
    8000,
    12000
  )}`;
  return code.slice(0);
}

// 跳转页面函数
export function openUrl(url: string, params?: any): void {
  const isExternal = isExternalLink(url);
  if (isExternal) {
    window.open(url);
  } else {
    if (params) {
      router.push({ path: url, query: params });
    } else {
      router.push(url);
    }
  }
}

/**
 * 跳转页面函数
 * 携带用于统计用户行为的参数
 * @param path /product/detail.html
 * @param id 128
 * @param d 项目数据
 * 拼接规则： {域名}{path}?spm={模型}.{租户ID}.{商户ID}.{父栏目ID}.{栏目ID}.{详情页ID}.{用户ID}.{timestamp}&token={token}
 * @return https:///websoft.top/product/detail/128.html?spm=c.5.3057.10005.undefined&token=DDkr1PpE9DouIVMjLEMt9733QsgG7oNV
 */
export function openSpmUrl(path?: string, d?: any, id = 0): void {
  // const domain = getSiteDomain();
  let domain = localStorage.getItem('Domain');
  let spm = '';
  let tid = d?.tenantId || 0;
  let mid = localStorage.getItem('MerchantId') || 0;
  let pid = d?.parentId || 0;
  let cid = d?.categoryId || 0;
  let uid = localStorage.getItem('UserId') || 0;
  let timestamp = ref(Date.now() / 1000);

  if(d?.navigationId > 0){
    cid = d.navigationId;
  }
  if(d?.itemId > 0){
    id = d.itemId;
  }

  // TODO 封装租户ID和店铺ID
  spm = `?spm=${d?.model}.${tid}.${mid}.${pid}.${cid}.${id}.${uid}.${
    timestamp.value
  }&token=${uuid()}`;

  // TODO 含http直接跳转
  if (path?.startsWith('http')) {
    window.open(`${path}`);
    return;
  }

  // TODO 开发环境
  if (import.meta.env.DEV) {
    console.log('开发环境',getTenantId());
    window.open(`http://localhost:${getTenantId()}${path}${spm}`);
    return;
  }

  // TODO 跳转网站预览地址
  if (domain && domain.length > 0) {
    window.open(`https://${domain}${path}${spm}`);
    return;
  }
}

/**
 * 获取SpmUrl
 * 拼接规则： {域名}{path}?spm={模型}.{租户ID}.{商户ID}.{父栏目ID}.{栏目ID}.{详情页ID}.{用户ID}.{timestamp}&token={token}
 * @param d
 */
export function getSpmUrl(d?: any): string {
  let domain = localStorage.getItem('Domain');
  let path = d?.model;
  let tid = d?.tenantId || 0;
  let mid = d?.merchantId || 0;
  let pid = d?.parentId || 0;
  let cid = d?.navigationId;
  let id = d?.itemId;
  let uid = localStorage.getItem('UserId') || 0;
  let timestamp = ref(Date.now() / 1000);

  // TODO 配置cid
  if(!cid){
    cid = d?.categoryId;
  }
  if(!id){
    id = d?.articleId || 0;
  }
  path = d?.model + '/' + d?.navigationId;
  // TODO 首页
  if(d?.model == 'index'){
    path = '';
  }
  if(!domain?.startsWith('https:')){
    domain = `https://${domain}`
  }
    // 开发环境
  if (import.meta.env.DEV) {
    domain = `http://localhost:${getTenantId()}`
  }

  // TODO 顶级栏目则默认跳转到第一个子栏目
  if(d?.parentId == 0 && d?.children && d?.children.length > 0){
    cid = d?.children?.[0]?.navigationId;
  }

  // 文章后缀
  if(d?.suffix){
    path = path + d?.suffix;
  }

  // TODO 封装spm
  return `${domain}/${path}?spm=${d?.model}.${tid}.${mid}.${pid}.${cid}.${id}.${uid}.${timestamp.value}`;
}



// export function getSpmUrl(path: string, d?: any, id = 0): string {
//   let domain = localStorage.getItem('Domain');
//   let spm = '';
//   let tid = localStorage.getItem('TenantId') || 0;
//   let mid = localStorage.getItem('MerchantId') || 0;
//   let pid = d?.parentId || 0;
//   let cid = d?.navigationId || d?.categoryId;
//   let uid = localStorage.getItem('UserId') || 0;
//   let timestamp = ref(Date.now() / 1000);
//
//   // 跳转网站预览地址
//   if(d?.model == 'links'){
//     return d?.path;
//   }
//   // 详情ID
//   if(d?.itemId > 0){
//     id = d?.itemId;
//   }
//   // 顶级栏目则默认跳转到第一个子栏目
//   if(d?.children && d?.children.length > 0){
//     id = d?.children[0]?.navigationId;
//   }
//   // TODO 封装spm
//   spm = `?spm=${d?.model}.${tid}.${mid}.${pid}.${cid}.${id}.${uid}.${timestamp.value}`;
//
//   // 开发环境
//   if (import.meta.env.DEV) {
//     return `http://localhost:10317${path}${spm}`;
//   }
//   return `https://${domain}${path}${spm}`
// }


/**
 * 弹出新窗口
 * @param url
 * @constructor
 */
export function openNew(url: string) {
  if (url.slice(0, 4) == 'http') {
    return window.open(url);
  }
  window.open(`http://${url}`);
}

/**
 * 预览地址
 * @param url
 * @constructor
 */
export function openPreview(url: string) {
  if (url.slice(0, 4) == 'http') {
    return window.open(url);
  }
  return window.open(`${getSiteDomain()}${url}`);
}
/**
 * 获取网站域名
 * @param path
 */
export const getDomainPath = (path: string) => {
  const domain = localStorage.getItem('Domain');
  return domain + path;
};

export const getLang = () => {
  if(localStorage.getItem('i18n-lang')){
    return `${localStorage.getItem('i18n-lang')}`
  }
  // const { locale } = useI18n();
  // return `${locale.value}`;
}
// 预览云存储文件
export function getUrl(url: string) {
  const isExternal = isExternalLink(url);
  // const uploadMethod = localStorage.getItem('UploadMethod');
  // const bucketDomain = localStorage.getItem('BucketDomain');
  // if (uploadMethod == 'oss') {
  //   return bucketDomain + url;
  // }
  if (!isExternal) {
    return FILE_SERVER + url;
  }
  return url;
}

// 跳转页面(不弹窗)
export function navTo(d?: any, path?: string, spm?: boolean): string {
    let domain = localStorage.getItem('Domain');

    if(!domain?.startsWith('https:')){
      domain = `https://${domain}`
    }
    // 开发环境
    if (import.meta.env.DEV) {
      domain = `http://localhost:${getTenantId()}`
    }
    if(d?.model == 'index'){
      return domain + '/';
    }
    if(!path){
      path = d?.path;
    }
    // 国际化配置
    if(getLang()){
      if(getLang() == 'en'){
        path = '/en' + path;
      }
    }
    // 是否移动端
    if(d?.isMobile){
      path = '/m' + path;
    }
    path = domain + path;
    // 是否附加spm参数
    if(spm){
      let uid = localStorage.getItem('UserId') || 0;
      let timestamp = ref(Date.now() / 1000);
      return `${path}?spm=${d?.tenantId||0}.${d?.merchantId||0}.${d?.parentId||0}.${d?.navigationId||d?.categoryId}.${uid}.${timestamp.value}`
    }
    return `${path}`;
}

export function detail(d: any){
  return navTo(d,`/${d.detail}/${d.articleId}.html`);
}

export function push(path: string) {
  router.push(path);
}

// 手机号脱敏
export function getMobile(tel: string) {
  const reg = /^(\d{3})\d{4}(\d{4})$/;
  return tel.replace(reg, '$1****$2');
}

// 复制文本
export const copyText = (text) => {
  // 模拟 输入框
  const cInput = document.createElement('input');
  cInput.value = text;
  document.body.appendChild(cInput);
  cInput.select(); // 选取文本框内容

  // 执行浏览器复制命令
  // 复制命令会将当前选中的内容复制到剪切板中（这里就是创建的input标签）
  // Input要在正常的编辑状态下原生复制方法才会生效
  message.success(`复制成功`);
  document.execCommand('copy');

  // 复制成功后再将构造的标签 移除
  document.body.removeChild(cInput);
};

/**
 * 计算剩余时间
 * @param endTime
 */
export const getEndTime = (endTime) => {
  const setTime = new Date(endTime);
  const nowTime = new Date();
  const restSec = setTime.getTime() - nowTime.getTime();
  // 剩余天数
  const lastDay = parseInt(String(restSec / (60 * 60 * 24 * 1000) + 1));
  // let lastHour = parseInt(String((restSec / (60 * 60 * 1000)) % 24));
  // let lastMinu = parseInt(String((restSec / (60 * 1000)) % 60));
  // let lastSec = parseInt(String((restSec / 1000) % 60));

  // 过期状态
  if (lastDay < 30 && lastDay > 0) {
    return `<div class="ele-text-warning">${toDateString(
      endTime,
      'yyyy-MM-dd'
    )}(${lastDay}天后过期)</div>`;
  }
  if (lastDay < 0) {
    return `<div class="ele-text-danger">${toDateString(
      endTime,
      'yyyy-MM-dd'
    )}(已过期)</div>`;
  }
  return `<div class="ele-text-info">${toDateString(
    endTime,
    'yyyy-MM-dd'
  )}</div>`;
};

/**
 * 判断是否是移动设备
 */
export function isMobileDevice(): boolean {
  return (typeof window.orientation !== "undefined") || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 获取字典数据作为下拉选项数据
 * @param dictCode
 */
export const getDictionaryOptions = (dictCode) => {
  const dictOptions = ref<SelectProps['options']>([]);
  // const key = dictCode + ':' + localStorage.getItem('TenantId');
  // const storageData = localStorage.getItem(key);

  listDictionaryData({
    dictCode
  })
    .then((list) => {
      // 获取远程字典数据
      if (list.length > 0) {
        dictOptions.value = list.map((d) => {
          return {
            key: d.dictDataCode,
            value: d.dictDataName,
            label: d.dictDataName,
            comments: d.comments
          };
        });
      } else {
        // 未定义则取默认的json数据
        // dictOptions.value = getJson(dictCode);
      }
    })
    .catch((e) => {
      message.error(e.message);
    });

  // if (!storageData) {
  //   listDictionaryData({
  //     dictCode
  //   })
  //     .then((list) => {
  //       // 获取远程字典数据
  //       if (list.length > 0) {
  //         dictOptions.value = list.map((d) => {
  //           return {
  //             value: d.dictDataCode,
  //             label: d.dictDataName,
  //             text: d.dictDataName,
  //             comments: d.comments
  //           };
  //         });
  //         // 写入缓存
  //         localStorage.setItem(key, JSON.stringify(dictOptions.value));
  //       } else {
  //         // 未定义则取默认的json数据
  //         dictOptions.value = getJson(dictCode);
  //       }
  //     })
  //     .catch((e) => {
  //       message.error(e.message);
  //     });
  // } else {
  //   dictOptions.value = JSON.parse(storageData);
  // }
  return <any>dictOptions;
};

// 判断是否为图片
/*
 * @param: fileName - 文件名称
 */
export const isImage = (fileName) => {
  const split = fileName.split('?');
  // 后缀获取
  let suffix = '';
  try {
    const flieArr = split[0].split('.');
    suffix = flieArr[flieArr.length - 1];
  } catch (err) {
    suffix = '';
  }
  const imgList = ['png', 'jpg', 'jpeg', 'bmp', 'gif', 'webp'];
  return imgList.some((item) => {
    return item == suffix;
  });
};

export const getWeek = (text) => {
  const week = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六'
  ];
  return week[text];
};

/**
 * 文件大小转换
 * @param text
 */
export const getFileSize = (text) => {
  if (text < 1024) {
    return text + 'B';
  } else if (text < 1024 * 1024) {
    return (text / 1024).toFixed(1) + 'KB';
  } else if (text < 1024 * 1024 * 1024) {
    return (text / 1024 / 1024).toFixed(1) + 'M';
  } else {
    return (text / 1024 / 1024 / 1024).toFixed(1) + 'G';
  }
};

/* 原图转缩列图 */
export const thumbnail = (url) => {
  if (url.indexOf('/thumbnail') < 0) {
    return url.replace(FILE_SERVER, FILE_SERVER + '/thumbnail');
  }
  return url;
};

/* 缩列转图原图 */
export const original = (url) => {
  if (url.indexOf('/thumbnail') == 0) {
    return url.replace('/thumbnail', '');
  }
  return url;
};

export const getCompanyInfo = () => {
  const user = useUserStore();
  if (user.info?.companyInfo) {
    return user.info?.companyInfo;
  }
  return null;
};

export const getVersion = () => {
  const companyInfo = getCompanyInfo();
  if (companyInfo?.version) {
    return companyInfo?.version;
  }
  return null;
};

// AES加密
export const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, APP_SECRET).toString();
};

// AES解密
export const decrypt = (encrypt) => {
  CryptoJS.AES.decrypt(encrypt, APP_SECRET);
  const bytes = CryptoJS.AES.decrypt(encrypt, APP_SECRET);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 获取商户ID
export const getMerchantId = () => {
  const merchantId = localStorage.getItem('MerchantId');
  if (merchantId) {
    return Number(merchantId);
  }
  return undefined;
};

// 获取当前登录用户ID
export const getUserId = () => {
  let userId = 0;
  const uid = Number(localStorage.getItem('UserId'));
  if (uid) {
    userId = uid;
    return userId;
  }
  return userId;
};

// 获取页签数据
export const getPageTitle = () => {
  const { currentRoute } = useRouter();
  const { meta } = unref(currentRoute);
  const { title } = meta;
  return title;
};

/**
 * 提取传参中的ID
 * param 12334.html
 * return 1234
 * @param index
 */
export const getIdBySpm = (index: number) => {
  console.log('split', router.currentRoute.value.query.spm);
  const split = String(router.currentRoute.value.query.spm).split('.');
  console.log(split);
  return split[index];
};

/**
 * 提取传参中的token
 */
export const getTokenBySpm = () => {
  const token = router.currentRoute.value.query.token;
  if (token) {
    return `${token}`;
  }
};
