import * as campusService from '@/services/BranchCampus';

export default {
  namespace: 'branchCampus',
  state: {
    eduSchoolList: [],
  },
  effects: {
    // 获取教学点列表
    *getEduSchoolist({ payload }, { call, put }) {
      const resp = yield call(campusService.getEduSchoolist, payload);
      yield put({
        type: 'saveSchoolList',
        payload: resp.data,
      });
      return resp;
    },
    // 添加分校
    *createschool({ payload }, { call }) {
      const resp = yield call(campusService.createschool, payload);
      return resp;
    },
    // 获取分校分页
    *getEduSchooPage({ payload }, { call }) {
      const resp = yield call(campusService.getEduSchooPage, payload);
      return resp;
    },
    // 删除分校
    *deleteSchool({ payload }, { call }) {
      const resp = yield call(campusService.deleteSchool, payload);
      return resp;
    },
    // 分校详情
    *detailSchool({ payload }, { call }) {
      const resp = yield call(campusService.detailSchool, payload);
      return resp;
    },
    // 更新分校
    *updateSchool({ payload }, { call }) {
      const resp = yield call(campusService.updateSchool, payload);
      return resp;
    },
  },

  reducers: {
    saveSchoolList(state, action) {
      return {
        ...state,
        eduSchoolList: action.payload,
      };
    },
  },
};
