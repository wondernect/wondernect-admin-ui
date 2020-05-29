import request from './entry';

// 获取当前学年学期
export async function getCurrentYear() {
  return request('/v1/community/platform/year_term/current', {
    method: 'GET',
  });
}
