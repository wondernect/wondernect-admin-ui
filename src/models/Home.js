import * as Service from '@/services/Home';

export default {
  namespace: 'home',
  state: {
    currentYear: {},
  },
  effects: {
    // 获取当前学年学期
    *getCurrentYear({ payload }, { call, put }) {
      const resp = yield call(Service.getCurrentYear, payload);
      yield put({
        type: 'currentYear',
        payload: resp.data,
      });
      return resp;
    },
  },

  reducers: {
    currentYear(state, action) {
      return {
        ...state,
        currentYear: action.payload,
      };
    },
  },
};
