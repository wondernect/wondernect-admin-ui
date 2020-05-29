import React, { PureComponent } from 'react';
import { Modal, Button, Checkbox, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';
import { isEmpty, getFormInitialValue } from '@/utils/form';

const { Option } = Select;
const FormItem = Form.Item;
@Form.create()
@connect(({ rbacRole }) => ({
  roleLists: rbacRole.roleLists,
}))
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
        type: 'rbacRole/detailRole',
        payload: this.props.modifyId,
      }).then(resp => {
        this.setState({
          title: '编辑角色',
          isEdit: true,
          data: resp.data,
        });
      });
    } else {
      this.setState({
        title: '添加角色',
      });
    }
  }

  // 保存
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccessSubmit, modifyId } = this.props;
    const { isEdit } = this.state;
    form.validateFields((err, values) => {
      if (!err) {
        const dispatchType = isEdit ? 'updateRole' : 'createRole';
        const editData = {
          id: modifyId,
          saveRoleRequestDTO: values,
        };
        const submitData = isEdit ? editData : values;
        dispatch({
          type: `rbacRole/${dispatchType}`,
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
    const {
      form: { getFieldDecorator },
      roleLists,
    } = this.props;
    const { data, isEdit, title } = this.state;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
    return (
      <Modal visible title={title} width={600} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="所属角色类型">
            {getFieldDecorator('role_type', {
              rules: [
                {
                  required: true,
                  message: '请选所属角色类型',
                },
              ],
              initialValue: getFormInitialValue(data.role_type, isEdit),
            })(
              <Select placeholder="请选择所属角色类型">
                {roleLists.map(item => (
                  <Option key={item.id} value={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入角色代码',
                },
              ],
              initialValue: getFormInitialValue(data.code, isEdit),
            })(<Input disabled={isEdit} placeholder="请输入角色代码" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入角色名称',
                },
              ],
              initialValue: getFormInitialValue(data.name, isEdit),
            })(<Input placeholder="请输入角色名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可编辑">
            {getFieldDecorator('editable', {
              valuePropName: 'checked',
              initialValue: isEdit ? data.editable : true,
            })(<Checkbox></Checkbox>)}
          </FormItem>
          <FormItem {...formItemLayout} label="是否可删除">
            {getFieldDecorator('deletable', {
              valuePropName: 'checked',
              initialValue: isEdit ? data.deletable : true,
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
