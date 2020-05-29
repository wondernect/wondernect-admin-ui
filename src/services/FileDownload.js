import request from './entry';

/**
 * 上传文件
 */
export const fileUploadUrl = '/v1/community/file/local/upload';

/**
 * 保存文件
 */
export async function createFlie(params) {
  return request('/v1/community/business/file_center/create', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取文件分页列表
 */
export async function getFliePage(params) {
  return request('/v1/community/business/file_center/page', {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除文件
 */
export async function deleteFile(params) {
  return request(`/v1/community/business/file_center/${params}/delete`, {
    method: 'POST',
  });
}

/**
 * 获取文件详情
 */
export async function detailFile(params) {
  return request(`/v1/community/business/file_center/${params}/detail`, {
    method: 'GET',
  });
}

/**
 * 置顶
 */
export async function enableTop(params) {
  return request(`/v1/community/business/file_center/${params}/enable_top`, {
    method: 'POST',
  });
}

/**
 * 取消置顶
 */
export async function disableTop(params) {
  return request(`/v1/community/business/file_center/${params}/disable_top`, {
    method: 'POST',
  });
}
