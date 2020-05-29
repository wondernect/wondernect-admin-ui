import request from '../entry';

/**
 * 获取菜单列表
 */
export async function getMenuPage(params) {
  return request(`/v1/community/rbac/menu/${params}/tree`, {
    method: 'GET',
  });
}
/**
 * 获取菜单树形结构
 */
export async function getMenuTree(params) {
  return request(`/v1/community/rbac/menu/${params}/tree`, {
    method: 'GET',
  });
}

/**
 * 添加菜单
 */
export async function createMenu(params) {
  return request(`/v1/community/rbac/menu/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除菜单
 */
export async function deleteMenu(params) {
  return request(`/v1/community/rbac/menu/${params}/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取菜单详情
 */
export async function detailMenu(params) {
  return request(`/v1/community/rbac/menu/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新菜单
 */
export async function updateMenu(params) {
  return request(`/v1/community/rbac/menu/${params.id}/update`, {
    method: 'POST',
    data: params.saveMenuRequestDTO,
  });
}
