import React, { PureComponent } from 'react';
import { Modal, Button, Form, Input, Select, message } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;
@Form.create()
@connect(({ YearTermConfig }) => ({
  termList: YearTermConfig.termList,
  yearList: YearTermConfig.yearList,
}))
export default class AddModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'YearTermConfig/termList',
    });
    dispatch({
      type: 'YearTermConfig/yearList',
    });
  }

  // 保存
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch, onSuccessSubmit } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: `YearTermConfig/createYearTerm`,
          payload: values,
        }).then(res => {
          if (res.code === 'SUCCESS') {
            message.success(`添加成功`);
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

  render() {
    const {
      form: { getFieldDecorator },
      termList,
      yearList,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Modal visible title="学年学期添加" width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} label="年度">
            {getFieldDecorator('year', {
              rules: [
                {
                  required: true,
                  message: '请选择年度',
                },
              ],
            })(
              <Select placeholder="请选择年度" allowClear>
                {yearList.map(item => (
                  <Option value={item.year} key={item.year}>
                    {item.year}
                  </Option>
                ))}
              </Select>,
            )}
          </FormItem>
          <FormItem {...formItemLayout} label="学期">
            {getFieldDecorator('term', {
              rules: [
                {
                  required: true,
                  message: '请选择学期',
                },
              ],
            })(
              <Select placeholder="请选择学期" allowClear>
                {termList.map(item => (
                  <Option value={item.code} key={item.code}>
                    {item.name}
                  </Option>
                ))}
              </Select>,
            )}
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
