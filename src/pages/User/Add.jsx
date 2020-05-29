import React, { PureComponent } from 'react';
import { Modal, Button, Checkbox, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { isEmpty, getFormInitialValue } from '@/utils/form';

const { Option } = Select;
const FormItem = Form.Item;
@Form.create()
@connect(({ user, rbacRole, login }) => ({
  roleLists: user.roleLists,
  roleTypeLists: rbacRole.roleLists,
  schoolList: login.schoolLists,
}))
export default class ModifyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isEdit: false,
      data: {},
      isUser: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    if (!isEmpty(this.props.modifyId) && this.props.type) {
      dispatch({
        type: 'user/detailuser',
        payload: this.props.modifyId,
      }).then(resp => {
        this.setState({
          title: '个人信息修改',
          isEdit: true,
          isUser: true,
          data: resp.data,
        });
      });
    } else if (!isEmpty(this.props.modifyId)) {
      dispatch({
        type: 'user/detailuser',
        payload: this.props.modifyId,
      }).then(resp => {
        this.setState({
          title: '编辑用户',
          isEdit: true,
          data: resp.data,
        });
      });
    } else {
      this.setState({
        title: '添加用户',
      });
    }
    // 获取学校列表
    dispatch({
      type: 'login/getSchoolList',
      payload: {},
    });
  }

  // 保存
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccessSubmit, modifyId } = this.props;
    const { isEdit, isUser } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const dispatchType = isEdit ? 'updateuser' : 'createuser';
        const editData = {
          id: modifyId,
          saveUserRequestDTO: values,
        };
        const submitData = isEdit ? editData : values;
        dispatch({
          type: `user/${dispatchType}`,
          payload: submitData,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            message.success(`${isEdit ? '编辑' : '添加'}成功`);
            if (isUser) {
              this.onCancel(true);
            } else if (typeof onSuccessSubmit === 'function') {
              onSuccessSubmit();
            }
          }
        });
      }
    });
  };

  onCancel = submitted => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel(submitted);
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
      roleTypeLists,
      roleLists,
      schoolList,
    } = this.props;
    const { data, isEdit, title, isUser } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 14 },
    };
    return (
      <Modal
        visible
        title={title}
        width={800}
        onCancel={() => {this.onCancel()}}
        footer={null}
      >
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="角色类型">
            {getFieldDecorator('role_type', {
              rules: [
                {
                  required: true,
                  message: '请选角色类型',
                },
              ],
              initialValue: getFormInitialValue(data.role_type, isEdit),
            })(
              <Select placeholder="请选择角色类型" disabled={isUser}>
                {roleTypeLists.map(item => (
                  <Option key={item.id} value={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="角色">
            {getFieldDecorator('role', {
              rules: [
                {
                  required: true,
                  message: '请选角色',
                },
              ],
              initialValue: getFormInitialValue(data.role, isEdit),
            })(
              <Select placeholder="请选择角色" disabled={isUser}>
                {roleLists.map(item => (
                  <Option key={item.id} value={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
              ],
              initialValue: getFormInitialValue(data.username, isEdit),
            })(<Input disabled={isEdit} placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码" extra="密码必须为6-20位数字+字母，数字+特殊字符，字母+特殊字符，数字+字母+特殊字符其中一种组合">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
              initialValue: getFormInitialValue(data.password, isEdit),
            })(<Input.Password placeholder="请输入密码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="姓名">
            {getFieldDecorator('name', {
              rules: [{
                required: true,
                message: '请输入姓名'
              }],
              initialValue: getFormInitialValue(data.name, isEdit),
            })(
              <Input
                placeholder="请输入姓名
            "
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="性别">
            {getFieldDecorator('sex', {
              rules: [{
                required: true,
                message: '请选择性别'
              }],
              initialValue: getFormInitialValue(data.sex, isEdit),
            })(
              <Select placeholder="性别" allowClear>
                <Option value={1}>男</Option>
                <Option value={2}>女</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="电话">
            {getFieldDecorator('tel', {
              required: [{
                required: true,
                message: '请输入电话'
              }],
              initialValue: getFormInitialValue(data.tel, isEdit),
            })(
              <Input
                placeholder="请输入电话
            "
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="邮箱">
            {getFieldDecorator('email', {
              initialValue: getFormInitialValue(data.email, isEdit),
            })(
              <Input
                placeholder="请输入邮箱
            "
              />,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属学校">
            {getFieldDecorator('school_id', {
              initialValue: getFormInitialValue(data.school_id, isEdit),
            })(
              <Select placeholder="请选择所属学校" disabled={isUser}>
                {schoolList.map(item => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="所属教学部">
            {getFieldDecorator('department', {
              initialValue: getFormInitialValue(data.department, isEdit),
            })(
              <Select placeholder="教学部" allowClear disabled={isUser}>
                <Option value="文法教学部">文法教学部</Option>
                <Option value="财经教学部">财经教学部</Option>
                <Option value="理工教学部">理工教学部</Option>
                <Option value="校外兼职教师">校外兼职教师</Option>
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可用">
            {getFieldDecorator('enable', {
              valuePropName: 'checked',
              initialValue: isEdit ? data.enable : true,
            })(<Checkbox disabled={isUser}></Checkbox>)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可编辑">
            {getFieldDecorator('editable', {
              valuePropName: 'checked',
              initialValue: isEdit ? data.editable : true,
            })(<Checkbox disabled={isUser}></Checkbox>)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可删除">
            {getFieldDecorator('deletable', {
              valuePropName: 'checked',
              initialValue: isEdit ? data.deletable : true,
            })(<Checkbox disabled={isUser}></Checkbox>)}
          </FormItem>
          <div className="modal-footer">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button type="cancel" onClick={() => {this.onCancel()}}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}
