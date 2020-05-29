import * as userService from '@/services/User';

const UserModel = {
  namespace: 'user',
  state: {
    currentUser: {},
    roleLists: [],
  },
  effects: {
    *checkAuth({ payload }, { call, put }) {
      const response = yield call(userService.checkAuth, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
      return response;
    },
    *getuserPage({ payload }, { call }) {
      const response = yield call(userService.getuserPage, payload);
      return response;
    },
    *createuser({ payload }, { call }) {
      const response = yield call(userService.createuser, payload);
      return response;
    },
    *deleteuser({ payload }, { call }) {
      const response = yield call(userService.deleteuser, payload);
      return response;
    },
    *detailuser({ payload }, { call }) {
      const response = yield call(userService.detailuser, payload);
      return response;
    },
    *updateuser({ payload }, { call }) {
      const response = yield call(userService.updateuser, payload);
      return response;
    },
    *modifyPassword({ payload }, { call }) {
      const response = yield call(userService.modifyPassword, payload);
      return response;
    },
    *enableUser({ payload }, { call }) {
      const response = yield call(userService.enableUser, payload);
      return response;
    },
    *disableUser({ payload }, { call }) {
      const response = yield call(userService.disableUser, payload);
      return response;
    },
    // 获取角色列表
    *getRoleList({ payload }, { call, put }) {
      const resp = yield call(userService.getRoleList, payload);
      yield put({
        type: 'saveRoleLists',
        payload: resp.data,
      });
      return resp;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload || {} };
    },
    saveRoleLists(state, action) {
      return {
        ...state,
        roleLists: action.payload,
      };
    },
  },
};
export default UserModel;
