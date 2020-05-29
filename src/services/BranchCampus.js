import request from './entry';

/**
 * 获取分校列表
 */
export async function getEduSchoolist(params) {
  return request(`/v1/rtvu/education/school/list?school_code_length=7&search_text=${params}`, {
    method: 'GET',
  });
}

/**
 * 添加分校
 */
export async function createschool(params) {
  return request(`/v1/community/school/add`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取已添加分校分页
 */
export async function getEduSchooPage(params) {
  return request(`/v1/community/school/page`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 删除分校
 */
export async function deleteSchool(params) {
  return request(`/v1/community/school/${params}/delete`, {
    method: 'POST',
    data: params,
  });
}
/**
 * 获取分校详情
 */
export async function detailSchool(params) {
  return request(`/v1/community/school/${params}/detail`, {
    method: 'GET',
  });
}
/**
 * 更新分校
 */
export async function updateSchool(params) {
  return request(`/v1/community/school/${params.id}/update`, {
    method: 'POST',
    data: params.saveSchoolRequestDTO,
  });
}
