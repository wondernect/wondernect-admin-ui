import * as rbacService from '@/services/rbac/RbacRoleType';

export default {
  namespace: 'rbacRoleType',
  state: {},
  effects: {
    // 获取角色类型列表
    *getRoleTypePage({ payload }, { call }) {
      const resp = yield call(rbacService.getRoleTypePage, payload);
      return resp;
    },
    // 添加角色类型
    *createRoleType({ payload }, { call }) {
      const resp = yield call(rbacService.createRoleType, payload);
      return resp;
    },
    // 删除角色类型
    *deleteRoleType({ payload }, { call }) {
      const resp = yield call(rbacService.deleteRoleType, payload);
      return resp;
    },
    // 角色类型详情
    *detailRoleType({ payload }, { call }) {
      const resp = yield call(rbacService.detailRoleType, payload);
      return resp;
    },
    // 更新角色类型
    *updateRoleType({ payload }, { call }) {
      const resp = yield call(rbacService.updateRoleType, payload);
      return resp;
    },
  },

  reducers: {},
};
