import React, { PureComponent } from 'react';
import { Modal, Button, Checkbox, Form, Input, message } from 'antd';
import { connect } from 'dva';
import { isEmpty, getFormInitialValue } from '@/utils/form';

const FormItem = Form.Item;
@Form.create()
@connect()
export default class ModifyModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      isEdit: false,
      data: {},
    };
  }

  componentDidMount() {
    if (!isEmpty(this.props.modifyId)) {
      const { dispatch } = this.props;
      dispatch({
        type: 'rbacRoleType/detailRoleType',
        payload: this.props.modifyId,
      }).then(resp => {
        this.setState({
          title: '编辑角色类型',
          isEdit: true,
          data: resp.data,
        });
      });
    } else {
      this.setState({
        title: '添加角色类型',
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { dispatch, form, onSuccessSubmit, modifyId } = this.props;
    const { isEdit } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const dispatchType = isEdit ? 'updateRoleType' : 'createRoleType';
        const editData = {
          id: modifyId,
          saveRoleTypeRequestDTO: values,
        };
        const submitData = isEdit ? editData : values;
        dispatch({
          type: `rbacRoleType/${dispatchType}`,
          payload: submitData,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            message.success(`${isEdit ? '编辑' : '添加'}成功`);
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
    const { getFieldDecorator } = this.props.form;
    const { data, isEdit, title } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Modal visible title={title} width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入角色类型代码',
                },
              ],
              initialValue: getFormInitialValue(data.code, isEdit),
            })(<Input disabled={isEdit} placeholder="请输入角色类型代码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入角色类型名称',
                },
              ],
              initialValue: getFormInitialValue(data.name, isEdit),
            })(<Input placeholder="请输入角色类型名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可编辑">
            {getFieldDecorator('editable', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox></Checkbox>)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可删除">
            {getFieldDecorator('deletable', {
              valuePropName: 'checked',
              initialValue: true,
            })(<Checkbox></Checkbox>)}
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
