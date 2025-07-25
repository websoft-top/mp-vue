import request from '@/utils/request';
import type { ApiResult, PageResult } from '@/api';
import type { FileRecord, FileRecordParam } from './model';
import { SERVER_API_URL } from '@/config/setting';
import { FILE_SERVER } from '@/config/setting';

/**
 * 上传文件
 */
export async function uploadFileLocal(file: File, AppId: number) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    FILE_SERVER + '/api/file/upload',
    formData,
    {
      headers: { AppId }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传文件
 */
export async function uploadFileLocalByCompany(file: File, CompanyId: number) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    FILE_SERVER + '/api/file/upload',
    formData,
    {
      headers: { CompanyId }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传文件
 */
export async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/oss/upload',
    formData
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传 base64 文件
 * @param base64 文件数据
 * @param fileName 文件名称
 */
export async function uploadBase64File(base64: string, fileName?: string) {
  const formData = new FormData();
  formData.append('base64', base64);
  if (fileName) {
    formData.append('fileName', fileName);
  }
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/file/upload/base64',
    formData
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传证书
 */
export async function uploadCert(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/file/upload',
    formData
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 分页查询文件上传记录
 */
export async function pageFiles(params: FileRecordParam) {
  const res = await request.get<ApiResult<PageResult<FileRecord>>>(
    SERVER_API_URL + '/file/page',
    { params }
  );
  if (res.data.code === 0) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 根据id查询文件
 */
export async function getFile(id: number) {
  const res = await request.get<ApiResult<FileRecord>>(
    SERVER_API_URL + '/file/' + id
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 删除文件
 */
export async function removeFile(id?: number) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/file/remove/' + id
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 批量删除文件
 */
export async function removeFiles(data: (number | undefined)[]) {
  const res = await request.delete<ApiResult<unknown>>(
    SERVER_API_URL + '/file/remove/batch',
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
 * 添加文件
 */
export async function addFiles(data: FileRecord) {
  const res = await request.post<ApiResult<unknown>>(
    SERVER_API_URL + '/file',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 修改文件
 */
export async function updateFiles(data: FileRecord) {
  const res = await request.put<ApiResult<unknown>>(
    SERVER_API_URL + '/file',
    data
  );
  if (res.data.code === 0) {
    return res.data.message;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传阿里云OSS
 */
export async function uploadOss(file: File) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/oss/upload',
    formData
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传阿里云OSS
 */
export async function uploadOssAvatar(file: File, fileName: string) {
  const formData = new FormData();
  formData.append('file', file, fileName);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/oss/upload',
    formData
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传阿里云OSS
 */
export async function uploadOssByGroupId(file: File, GroupId: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/oss/upload',
    formData,
    {
      headers: { GroupId }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}

/**
 * 上传阿里云OSS
 */
export async function uploadOssByAppId(file: File, appId: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await request.post<ApiResult<FileRecord>>(
    SERVER_API_URL + '/oss/upload',
    formData,
    {
      headers: { appId }
    }
  );
  if (res.data.code === 0 && res.data.data) {
    return res.data.data;
  }
  return Promise.reject(new Error(res.data.message));
}
