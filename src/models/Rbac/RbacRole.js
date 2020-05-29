import * as rbacService from '@/services/rbac/RbacRole';

export default {
  namespace: 'rbacRole',
  state: {
    roleLists: [],
  },
  effects: {
    // 获取角色类型列表
    *getRoleList({ payload }, { call, put }) {
      const resp = yield call(rbacService.getRoleList, payload);
      yield put({
        type: 'saveRoleLists',
        payload: resp.data,
      });
      return resp;
    },
    // 获取角色列表
    *getRolePage({ payload }, { call }) {
      const resp = yield call(rbacService.getRolePage, payload);
      return resp;
    },
    // 添加角色
    *createRole({ payload }, { call }) {
      const resp = yield call(rbacService.createRole, payload);
      return resp;
    },
    // 删除角色
    *deleteRole({ payload }, { call }) {
      const resp = yield call(rbacService.deleteRole, payload);
      return resp;
    },
    // 角色详情
    *detailRole({ payload }, { call }) {
      const resp = yield call(rbacService.detailRole, payload);
      return resp;
    },
    // 更新角色
    *updateRole({ payload }, { call }) {
      const resp = yield call(rbacService.updateRole, payload);
      return resp;
    },
    // 角色对应菜单树形结构
    *roleMenuTree({ payload }, { call }) {
      const resp = yield call(rbacService.roleMenuTree, payload);
      return resp;
    },
    // 勾选菜单
    *addRoleMenu({ payload }, { call }) {
      const resp = yield call(rbacService.addRoleMenu, payload);
      return resp;
    },
    // 取消勾选菜单
    *deleteRoleMenu({ payload }, { call }) {
      const resp = yield call(rbacService.deleteRoleMenu, payload);
      return resp;
    },
    // 菜单编辑
    *editRoleMenu({ payload }, { call }) {
      const resp = yield call(rbacService.editRoleMenu, payload);
      return resp;
    },
    // 操作管理列表
    *roleOperaPage({ payload }, { call }) {
      const resp = yield call(rbacService.roleOperaPage, payload);
      return resp;
    },
    // 勾选操作管理
    *addroleOpera({ payload }, { call }) {
      const resp = yield call(rbacService.addroleOpera, payload);
      return resp;
    },
    // 取消勾选操作管理
    *deleteroleOpera({ payload }, { call }) {
      const resp = yield call(rbacService.deleteroleOpera, payload);
      return resp;
    },
    // 操作管理编辑
    *editroleOpera({ payload }, { call }) {
      const resp = yield call(rbacService.editroleOpera, payload);
      return resp;
    },
  },

  reducers: {
    saveRoleLists(state, action) {
      return {
        ...state,
        roleLists: action.payload,
      };
    },
  },
};
