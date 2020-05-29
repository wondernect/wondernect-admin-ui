import store from 'store';
import { message } from 'antd';
import router from 'umi/router';
import request from '@/utils/request';
import { setAuthority } from '@/utils/authority';

// CODE_SESSION_NOT_FOUND: 过期，重新登录

// 接口有分两种，带code和不带code的

// 带code的
export default function defRequest(url, params) {
  const newOption = {
    ...params,
    headers: {
      Authorization: store.get('code'),
    },
  };
  return request(url, newOption)
    .then(res => {
      if (res.code === 'CODE_SESSION_NOT_FOUND' && url !== '/v1/community/code/auth') {
        setAuthority('guest');
        store.remove('user');
        store.remove('code');
        store.remove('menu');
        if (window.location.pathname !== '/login') {
          router.push({
            pathname: '/login',
          });
        }
      }
      return Promise.resolve(res);
    })
    .then(res => {
      if (res.code === 'UNKNOWN_ERROR') {
        message.error('接口问题');
      } else if (res.code !== 'SUCCESS' && url !== '/v1/community/code/auth') {
        message.error(res.message);
      }
      return Promise.resolve(res);
    });
}

// 不带code的
export function requestWithoutCode(url, params) {
  return request(url, params).then(res => {
    if (res.code === 'UNKNOWN_ERROR') {
      message.error('接口问题');
    } else if (res.code !== 'SUCCESS') {
      message.error(res.message);
    }
    return Promise.resolve(res);
  });
}
// 处理文件下载的
export function fileRequest(url, params) {
  const newOption = {
    ...params,
    responseType: 'blob',
    getResponse: true,
    headers: {
      Authorization: store.get('code'),
    },
  };
  return request(url, newOption);
}
