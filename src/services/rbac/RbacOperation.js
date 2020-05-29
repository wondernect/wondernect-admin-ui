import request from '../entry';

/**
 * 获取操作列表
 */
export async function getOperationPage(params) {
  return request(`/v1/community/rbac/operation/page`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加操作
 */
export async function createOperation(params) {
  return request(`/v1/community/rbac/operation/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除操作
 */
export async function deleteOperation(params) {
  return request(`/v1/community/rbac/operation/${params}/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取操作详情
 */
export async function detailOperation(params) {
  return request(`/v1/community/rbac/operation/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新操作
 */
export async function updateOperation(params) {
  return request(`/v1/community/rbac/operation/${params.id}/update`, {
    method: 'POST',
    data: params.saveOperationRequestDTO,
  });
}
