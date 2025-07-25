import OSS from 'ali-oss';
const baseUrl = 'http://oss-aishangjia.oss-cn-shenzhen.aliyuncs.com';
export const uploadAliOss = async (file, options) => {
  // 构建上传文件参数

  // 获取上传文件所需要的STS Token
  // 直接通过node.js上传
  // console.log(token)
  const client = new OSS({
    region: 'oss-cn-shenzhen',
    accessKeyId: process.env.VUE_APP_OSS_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.VUE_APP_OSS_ACCESS_KEY_SECRET || '',
    bucket: 'oss-aishangjia',
    secure: true
  });

  const headers = {
    // 指定该Object被下载时的网页缓存行为。
    'Cache-Control': 'no-cache',
    // 指定该Object被下载时的名称。
    // 指定该Object被下载时的内容编码格式。
    'Content-Encoding': 'utf-8',
    // 指定过期时间，单位为毫秒。
    Expires: '1000',
    // 指定Object的存储类型。
    'x-oss-storage-class': 'Standard',
    // 指定初始化分片上传时是否覆盖同名Object。此处设置为true，表示禁止覆盖同名Object。
    'x-oss-forbid-overwrite': 'true'
  };

  const suffix = file.name.substring(file.name.lastIndexOf('.')); // .txt
  const objectName = Date.now() + suffix;

  // object-name可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
  const result = await client.multipartUpload(objectName, file, {
    ...options,
    parallel: 4,
    partSize: 1024 * 1024 * 5
  });

  result.url = `${baseUrl}/${result.name}`;
  return Promise.resolve(result);
};
