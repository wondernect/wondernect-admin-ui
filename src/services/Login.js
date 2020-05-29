import request, { requestWithoutCode } from './entry';

/**
 * 登录
 */
export async function login(params) {
  return requestWithoutCode('/v1/community/session/login', {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取分校列表
 */
export async function getSchoolList(params) {
  return requestWithoutCode('/v1/community/school/list', {
    method: 'POST',
    data: params,
  });
}
/**
 * 退出
 */
export async function logout() {
  return request('/v1/community/session/logout', {
    method: 'POST',
  });
}
