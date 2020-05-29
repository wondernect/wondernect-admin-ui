import moment from 'moment';

// 判断是否为空（不包含0）
export const isEmpty = value => value === '' || value === null || value === undefined;

// 表单初始值
export const getFormInitialValue = (value, isEdit) =>
  isEdit && !isEmpty(value) ? value : undefined;

// 列表初始值
export const getTableInitialValue = value => (!isEmpty(value) ? value : '无');

// 表单正则
export const formRegExpRules = {
  zip: {
    pattern: /^[0-9]{6}$/,
    message: '邮编格式不正确',
  },
  telephone: {
    pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/,
    message: '手机号码格式不正确',
  },
  email: {
    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: 'email格式不正确',
  },
  fixedTelephone: {
    pattern: /(^(\d{3,4}-)?\d{7,8})$|(^(\d{10,19})$)|(^(\d{5})$)|(^(400-\d{3}-\d{4})$)|^((13[0-9]{9})|(14[0-9]{9})|(15[0-9]{9})|(17[0-9]{9})|(18[0-9]{9}))$/,
    message: '电话格式不正确',
  },
  idCard: {
    pattern: /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$/,
    message: '身份证号码格式不正确',
  },
  fax: {
    pattern: /(^(0[0-9]{2,3}-)?([2-9][0-9]{6,7})+(-[0-9]{1,4})?$)|(^(((d{3}))|(d{3}-))?(1[3578]d{9})$)|(^(400)-(d{3})-(d{4})(.)(d{1,4})$)|(^(400)-(d{3})-(d{4}$))/,
    message: '传真格式不正确',
  },
};

// 日期、时间格式化
export const dateFormat = date => moment(date).format('YYYY-MM-DD');
export const monthFormat = time => moment(time).format('YYYY-MM');
export const timeFormat = time => moment(time).format('YYYY-MM-DD HH:mm');

// layout
export const formLayout = {
  item: {
    // 一行三个，标准的
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 16,
    },
  },
  item2: {
    // 一行两个
    labelCol: {
      span: 4,
    },
    wrapperCol: {
      span: 16,
    },
  },
  item2_1: {
    // 一行三块,一个占两块,一个占一块
    labelCol: {
      span: 3,
    },
    wrapperCol: {
      span: 18,
    },
  },
  oneLine: {
    // 一行一个
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 20,
    },
  },
  tail: {
    // 最后一行，提交
    wrapperCol: {
      offset: 2,
      span: 20,
    },
  },
};
