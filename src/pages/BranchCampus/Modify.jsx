import React, { PureComponent } from 'react';
import { Modal, Button, message, Form, Input } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
@Form.create()
@connect()
export default class ModifyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'branchCampus/detailSchool',
      payload: this.props.modifyId,
    }).then(resp => {
      this.setState({
        data: resp.data,
      });
    });
  }

  onCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  // 保存修改
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccessSubmit, modifyId } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        const submitData = {
          id: modifyId,
          saveSchoolRequestDTO: values,
        };
        dispatch({
          type: `branchCampus/updateSchool`,
          payload: submitData,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            message.success(`编辑成功`);
            if (typeof onSuccessSubmit === 'function') {
              onSuccessSubmit();
            }
          }
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    const { data } = this.state;
    return (
      <Modal visible title="编辑分校" width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="分校名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入分校名称',
                },
              ],
              initialValue: data.name,
            })(<Input placeholder="请输入分校名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="分校代码">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入分校代码',
                },
              ],
              initialValue: data.code,
            })(<Input placeholder="请输入分校代码" />)}
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
