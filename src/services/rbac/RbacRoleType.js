import request from '../entry';

/**
 * 获取角色类型列表
 */
export async function getRoleTypePage(params) {
  return request(`/v1/community/rbac/role_type/page`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加角色类型
 */
export async function createRoleType(params) {
  return request(`/v1/community/rbac/role_type/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除角色类型
 */
export async function deleteRoleType(params) {
  return request(`/v1/community/rbac/role_type/${params}/delete`, {
    method: 'POST',
  });
}
/**
 * 获取角色类型详情
 */
export async function detailRoleType(params) {
  return request(`/v1/community/rbac/role_type/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新角色类型
 */
export async function updateRoleType(params) {
  return request(`/v1/community/rbac/role_type/${params.id}/update`, {
    method: 'POST',
    data: params.saveRoleTypeRequestDTO,
  });
}
