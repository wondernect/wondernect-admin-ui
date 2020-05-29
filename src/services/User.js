import request from './entry';

/**
 * 验证令牌
 */
export async function checkAuth(params) {
  return request('/v1/community/code/auth', {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取用户列表
 */
export async function getuserPage(params) {
  return request(`/v1/community/user/page`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加用户
 */
export async function createuser(params) {
  return request(`/v1/community/user/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除用户
 */
export async function deleteuser(params) {
  return request(`/v1/community/user/${params}/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取用户详情
 */
export async function detailuser(params) {
  return request(`/v1/community/user/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新用户
 */
export async function updateuser(params) {
  return request(`/v1/community/user/${params.id}/update`, {
    method: 'POST',
    data: params.saveUserRequestDTO,
  });
}
/**
 * 获取角色下拉列表
 */
export async function getRoleList(params) {
  return request(`/v1/community/rbac/role/list`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 修改密码
 */
export async function modifyPassword(params) {
  return request(`/v1/community/user/${params.id}/modify_password`, {
    method: 'POST',
    data: params.modifyPasswordRequestDTO,
  });
}
/**
 * 启用
 */
export async function enableUser(params) {
  return request(`/v1/community/user/${params}/enable`, {
    method: 'POST',
  });
}
/**
 * 禁用
 */
export async function disableUser(params) {
  return request(`/v1/community/user/${params}/disable`, {
    method: 'POST',
  });
}
