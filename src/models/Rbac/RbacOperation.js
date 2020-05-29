import * as rbacService from '@/services/rbac/RbacOperation';

export default {
  namespace: 'rbacOperation',
  state: {},
  effects: {
    // 获取操作列表
    *getOperationPage({ payload }, { call }) {
      const resp = yield call(rbacService.getOperationPage, payload);
      return resp;
    },
    // 添加操作
    *createOperation({ payload }, { call }) {
      const resp = yield call(rbacService.createOperation, payload);
      return resp;
    },
    // 删除操作
    *deleteOperation({ payload }, { call }) {
      const resp = yield call(rbacService.deleteOperation, payload);
      return resp;
    },
    // 操作详情
    *detailOperation({ payload }, { call }) {
      const resp = yield call(rbacService.detailOperation, payload);
      return resp;
    },
    // 更新操作
    *updateOperation({ payload }, { call }) {
      const resp = yield call(rbacService.updateOperation, payload);
      return resp;
    },
  },

  reducers: {},
};
