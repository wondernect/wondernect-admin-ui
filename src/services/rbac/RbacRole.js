import request from '../entry';
/**
 * 获取角色类型下拉列表
 */
export async function getRoleList(params) {
  return request(`/v1/community/rbac/role_type/list`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 获取角色列表
 */
export async function getRolePage(params) {
  return request(`/v1/community/rbac/role/page`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加角色
 */
export async function createRole(params) {
  return request(`/v1/community/rbac/role/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除角色
 */
export async function deleteRole(params) {
  return request(`/v1/community/rbac/role/${params}/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取角色详情
 */
export async function detailRole(params) {
  return request(`/v1/community/rbac/role/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新角色
 */
export async function updateRole(params) {
  return request(`/v1/community/rbac/role/${params.id}/update`, {
    method: 'POST',
    data: params.saveRoleRequestDTO,
  });
}

// 角色-菜单管理
/**
 * 角色对应菜单树形结构
 */
export async function roleMenuTree(params) {
  return request(
    `/v1/community/rbac/role_menu/tree?role_code=${params.role_code}&menu_code=${params.menu_code}`,
    {
      method: 'GET',
    },
  );
}
/**
 * 勾选菜单
 */
export async function addRoleMenu(params) {
  return request(`/v1/community/rbac/role_menu/add`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 取消勾选菜单
 */
export async function deleteRoleMenu(params) {
  return request(`/v1/community/rbac/role_menu/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 菜单编辑
 */
export async function editRoleMenu(params) {
  return request(`/v1/community/rbac/role_menu/edit`, {
    method: 'POST',
    data: params,
  });
}
// 角色-菜单-操作管理

/**
 * 角色对应菜单树形结构
 */
export async function roleOperaPage(params) {
  return request(`/v1/community/rbac/role_menu_operation/page`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 勾选菜单
 */
export async function addroleOpera(params) {
  return request(`/v1/community/rbac/role_menu_operation/add`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 取消勾选菜单
 */
export async function deleteroleOpera(params) {
  return request(`/v1/community/rbac/role_menu_operation/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 菜单编辑
 */
export async function editroleOpera(params) {
  return request(`/v1/community/rbac/role_menu_operation/edit`, {
    method: 'POST',
    data: params,
  });
}
