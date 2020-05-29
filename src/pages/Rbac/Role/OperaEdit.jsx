import React, { PureComponent } from 'react';
import { Modal, Button, DatePicker, Form, Radio, message } from 'antd';
import { connect } from 'dva';
import moment from 'moment';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;
@Form.create()
@connect(({ rbacRole }) => ({
  rbacRole,
}))
export default class operaEdit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      endTime: null,
    };
  }

  componentDidMount() {
    const { operationData } = this.props;
    this.setState({
      startTime: operationData.start_time,
      endTime: operationData.endTime,
    });
  }

  // 保存
  handleSubmit = e => {
    e.preventDefault();
    const { form, menuCode, roleCode, operationData } = this.props;
    const { startTime, endTime } = this.state;
    let editData = '';
    form.validateFields((err, values) => {
      if (!err) {
        if (values.limitable) {
          if (startTime && endTime) {
            editData = {
              menu_code: menuCode,
              role_code: roleCode,
              operation_code: operationData.code,
              endTime,
              limitable: true,
              start_time: startTime,
            };
            this.onSave(editData);
          } else {
            message.warning(`请选择限制时间范围`);
          }
        } else {
          editData = {
            menu_code: menuCode,
            role_code: roleCode,
            operation_code: operationData.code,
            endTime: null,
            limitable: values.limitable,
            start_time: null,
          };
          this.onSave(editData);
        }
      }
    });
  };

  //   保存
  onSave = data => {
    const { dispatch, onSuccessSubmit } = this.props;
    dispatch({
      type: `rbacRole/editroleOpera`,
      payload: data,
    }).then(res => {
      if (res.code === 'SUCCESS') {
        message.success(`编辑成功`);
        if (typeof onSuccessSubmit === 'function') {
          onSuccessSubmit();
        }
      }
    });
  };

  onCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  timeChange = (value, dateString) => {
    this.setState({
      startTime: new Date(dateString[0]).getTime(),
      endTime: new Date(dateString[1]).getTime(),
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      operationData,
    } = this.props;
    const formItemLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 20 },
    };
    const dateFormat = 'YYYY-MM-DD HH:mm';
    const defaultStartTime = operationData.start_time
      ? moment(operationData.start_time).format('YYYY-MM-DD HH:mm')
      : null;
    const defaultendTime = operationData.endTime
      ? moment(operationData.endTime).format('YYYY-MM-DD HH:mm')
      : null;
    const defaultRange = operationData.limitable
      ? [moment(defaultStartTime, dateFormat), moment(defaultendTime, dateFormat)]
      : [];
    return (
      <Modal visible title="操作编辑" width={500} onCancel={this.onCancel} footer={null}>
        <Form onSubmit={this.handleSubmit}>
          <FormItem {...formItemLayout} name="radio-group" label="可见时间设置">
            {getFieldDecorator('limitable', {
              initialValue: operationData.limitable,
            })(
              <Radio.Group className="limitabletime">
                <Radio value={false}>无限制</Radio>
                <Radio value>
                  <RangePicker
                    defaultValue={defaultRange}
                    showTime={{ format: 'HH:mm' }}
                    format="YYYY-MM-DD HH:mm"
                    onChange={this.timeChange}
                  />
                </Radio>
              </Radio.Group>,
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
