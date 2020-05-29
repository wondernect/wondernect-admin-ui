import request from './entry';

// 获取平台配置
export async function platformConfig(params) {
  return request('/v1/community/platform/config/list', {
    method: 'POST',
    data: params,
  });
}
