import request from '../entry';

/**
 * 获取分页
 */
export async function getYearTermPage(params) {
  return request(`/v1/community/platform/year_term/page`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 添加
 */
export async function createYearTerm(params) {
  return request(`/v1/community/platform/year_term/create`, {
    method: 'POST',
    data: params,
  });
}

/**
 * 删除
 */
export async function deleteYearTerm(params) {
  return request(`/v1/community/platform/year_term/${params}/delete`, {
    method: 'POST',
  });
}
/**
 * 设置当前学年学期
 */
export async function setCurrent(params) {
  return request(`/v1/community/platform/year_term/${params}/set_current`, {
    method: 'POST',
  });
}
/**
 * 设置上一学年学期
 */
export async function setLast(params) {
  return request(`/v1/community/platform/year_term/${params}/set_last`, {
    method: 'POST',
  });
}
/**
 * 设为论文撰写学年学期
 */
export async function setStudentGet(params) {
  return request(`/v1/community/platform/year_term/${params}/set_student_get`, {
    method: 'POST',
  });
}
/**
 * 获取学期列表
 */
export async function termList() {
  return request(`/v1/rtvu/education/term/list`, {
    method: 'GET',
  });
}
/**
 * 获取学年列表
 */
export async function yearList() {
  return request(`/v1/rtvu/education/year/list?start_year=2015`, {
    method: 'GET',
  });
}
