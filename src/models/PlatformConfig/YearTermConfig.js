import * as configService from '@/services/PlatformConfig/YearTermConfig';

export default {
  namespace: 'YearTermConfig',
  state: {
    termList: [],
    yearList: [],
  },
  effects: {
    // 获取列表
    *getYearTermPage({ payload }, { call }) {
      const resp = yield call(configService.getYearTermPage, payload);
      return resp;
    },
    // 添加
    *createYearTerm({ payload }, { call }) {
      const resp = yield call(configService.createYearTerm, payload);
      return resp;
    },
    // 删除
    *deleteYearTerm({ payload }, { call }) {
      const resp = yield call(configService.deleteYearTerm, payload);
      return resp;
    },
    // 设置当前学年学期
    *setCurrent({ payload }, { call }) {
      const resp = yield call(configService.setCurrent, payload);
      return resp;
    },
    // 设置上一学年学期
    *setLast({ payload }, { call }) {
      const resp = yield call(configService.setLast, payload);
      return resp;
    },
    // 设为论文撰写学年学期
    *setStudentGet({ payload }, { call }) {
      const resp = yield call(configService.setStudentGet, payload);
      return resp;
    },
    // 获取学期列表
    *termList({ payload }, { call, put }) {
      const resp = yield call(configService.termList, payload);
      yield put({
        type: 'savetermList',
        payload: resp.data,
      });
      return resp;
    },
    // 获取学年列表
    *yearList({ payload }, { call, put }) {
      const resp = yield call(configService.yearList, payload);
      yield put({
        type: 'saveyearList',
        payload: resp.data,
      });
      return resp;
    },
  },

  reducers: {
    savetermList(state, action) {
      return {
        ...state,
        termList: action.payload,
      };
    },
    saveyearList(state, action) {
      return {
        ...state,
        yearList: action.payload,
      };
    },
  },
};
