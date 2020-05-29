import * as rbacService from '@/services/rbac/RbacMenu';

export default {
  namespace: 'rbacMenu',
  state: {
    treeLists: [],
  },
  effects: {
    // 获取菜单分页
    *getMenuPage({ payload }, { call }) {
      const resp = yield call(rbacService.getMenuPage, payload);
      return resp;
    },
    // 获取树形菜单
    *getMenuTree({ payload }, { call, put }) {
      const resp = yield call(rbacService.getMenuTree, payload);
      yield put({
        type: 'saveTreeLists',
        payload: resp.data,
      });
      return resp;
    },
    // 添加菜单
    *createMenu({ payload }, { call }) {
      const resp = yield call(rbacService.createMenu, payload);
      return resp;
    },
    // 删除菜单
    *deleteMenu({ payload }, { call }) {
      const resp = yield call(rbacService.deleteMenu, payload);
      return resp;
    },
    // 菜单详情
    *detailMenu({ payload }, { call }) {
      const resp = yield call(rbacService.detailMenu, payload);
      return resp;
    },
    // 更新菜单
    *updateMenu({ payload }, { call }) {
      const resp = yield call(rbacService.updateMenu, payload);
      return resp;
    },
  },

  reducers: {
    saveTreeLists(state, action) {
      return {
        ...state,
        treeLists: action.payload,
      };
    },
  },
};
