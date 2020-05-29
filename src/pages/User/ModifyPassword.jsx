import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@Form.create()
@connect(({ user }) => ({
  user,
}))
export default class ModifyPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      data: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/detailuser',
      payload: this.props.passwordId,
    }).then(resp => {
      this.setState({
        title: '修改密码',
        data: {
          id: resp.data.id,
          username: resp.data.username,
          password: resp.data.password,
        },
      });
    });
  }

  // 保存
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccessSubmit, passwordId } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const editData = {
          id: passwordId,
          modifyPasswordRequestDTO: values,
        };
        dispatch({
          type: `user/modifyPassword`,
          payload: editData,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            message.success('密码修改成功');
            if (typeof onSuccessSubmit === 'function') {
              onSuccessSubmit();
            }
          }
        });
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { data, title } = this.state;
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal visible title={title} width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="用户名">
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                  message: '请输入用户名',
                },
              ],
              initialValue: data.username,
            })(<Input disabled placeholder="请输入用户名" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: '请输入密码',
                },
              ],
              initialValue: data.password,
            })(<Input.Password placeholder="请输入密码" />)}
          </FormItem>
          <div className="modal-footer">
            <Button type="primary" htmlType="submit">
              保存
            </Button>
            <Button type="cancel" onClick={this.onCancel}>
              取消
            </Button>
          </div>
        </Form>
      </Modal>
    );
  }
}
