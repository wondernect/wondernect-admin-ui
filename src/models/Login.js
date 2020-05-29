import { routerRedux } from 'dva';
import store from 'store';
import { login, logout, getSchoolList } from '@/services/Login';
import { getPageQuery } from '@/utils/utils';
import { setAuthority } from '@/utils/authority';

export default {
  namespace: 'login',
  state: {
    currentUser: {},
    schoolLists: [],
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
      });
      return response;
    },
    *logout(_, { call, put }) {
      yield call(logout);
      setAuthority('guest');
      store.remove('user');
      store.remove('code');
      store.remove('menu');
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/login',
          }),
        );
      }
    },
    *getSchoolList({ payload }, { call, put }) {
      const response = yield call(getSchoolList, payload);
      yield put({
        type: 'saveSchoolList',
        payload: response.data,
      });
      return response;
    },
  },
  reducers: {
    saveCurrentUser(state, action) {
      return { ...state, currentUser: action.payload };
    },
    saveSchoolList(state, action) {
      return {
        ...state,
        schoolLists: action.payload,
      };
    },
  },
};
