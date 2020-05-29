import React, { PureComponent } from 'react';
import { Modal, Button, Checkbox, Form, Input, TreeSelect, message } from 'antd';
import { connect } from 'dva';
import { isEmpty, getFormInitialValue } from '@/utils/form';

const FormItem = Form.Item;
const { TreeNode } = TreeSelect;
@Form.create()
@connect(({ rbacMenu, rbacOperation }) => ({
  menuTreeLists: rbacMenu.treeLists,
  rbacOperation,
}))
export default class AddModal extends PureComponent {
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
        type: 'rbacOperation/detailOperation',
        payload: this.props.modifyId,
      }).then(resp => {
        this.setState({
          title: '操作编辑',
          isEdit: true,
          data: resp.data,
        });
      });
    } else {
      this.setState({
        title: '操作添加',
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
        const dispatchType = isEdit ? 'updateOperation' : 'createOperation';
        const editData = {
          id: modifyId,
          saveOperationRequestDTO: values,
        };
        const submitData = isEdit ? editData : values;
        dispatch({
          type: `rbacOperation/${dispatchType}`,
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

  // 取消
  onCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  renderTreeNodes = data =>
    data.map(item => {
      if (item.child_list) {
        return (
          <TreeNode title={item.name} key={item.id} value={item.code} dataRef={item}>
            {this.renderTreeNodes(item.child_list)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });

  render() {
    const {
      form: { getFieldDecorator },
      menuTreeLists,
    } = this.props;
    const { data, isEdit, title } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Modal visible title={title} width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="所属菜单">
            {getFieldDecorator('menu_code', {
              rules: [
                {
                  required: true,
                  message: '请选择所属菜单',
                },
              ],
              initialValue: getFormInitialValue(data.menu_code, isEdit),
            })(
              <TreeSelect
                style={{ width: '100%' }}
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                placeholder="请选择所属菜单"
                allowClear
                treeDefaultExpandAll
              >
                {this.renderTreeNodes([menuTreeLists])}
              </TreeSelect>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="名称">
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入菜单名称',
                },
              ],
              initialValue: getFormInitialValue(data.name, isEdit),
            })(<Input placeholder="请输入菜单名称" />)}
          </FormItem>
          <FormItem {...formItemLayout} label="代码">
            {getFieldDecorator('code', {
              rules: [
                {
                  required: true,
                  message: '请输入菜单代码',
                },
              ],
              initialValue: getFormInitialValue(data.code, isEdit),
            })(<Input disabled={isEdit} placeholder="请输入菜单代码" />)}
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
