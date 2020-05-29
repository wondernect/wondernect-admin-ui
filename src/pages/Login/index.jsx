import React, { Component } from 'react';
import { Form, Select, Input, Button, message } from 'antd';
import { connect } from 'dva';
import store from 'store';
import { router } from 'umi';
import styles from './index.less';
import { setAuthority } from '@/utils/authority';
import AddModal from '@/pages/User/Add';

const FormItem = Form.Item;
const { Option } = Select;
@connect(({ login }) => ({
    schoolList: login.schoolLists,
}))
@Form.create()
class Login extends Component {
    state = {
        addModalState: {
            visible: false,
            id: null,
        }, // 强制修改用户信息的弹窗
    };

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'login/getSchoolList',
            payload: {},
        });
    }

    // 表单提交
    handleSubmit = e => {
        const { form, dispatch } = this.props;
        e.preventDefault();
        form.validateFields((err, values) => {
            if (!err) {
                const hide = message.loading('正在登录');
                // 登录
                dispatch({
                    type: 'login/login',
                    payload: values,
                }).then(response => {
                    hide();
                    if (response.code === 'SUCCESS') {
                        setAuthority(response.data.role.code);
                        store.set('user', response.data.user);
                        store.set('menu', response.data.role.menu_list);
                        store.set('code', response.data.code.code);
                        this.checkForceUpdatePassword(response.data);
                    }
                });
            }
        });
    };

    // 判断是否需要强制修改个人信息
    checkForceUpdatePassword = data => {
        if (data.force_modify_password) {
            message.warn('您的信息需要修改！');
            this.setState({
                addModalState: {
                    visible: true,
                    id: data.user.id,
                },
            });
        } else {
            router.push('/');
        }
    };

    cancelModal = submitted => {
        this.setState({
            addModalState: {
                visible: false,
                id: null,
            },
        });
        if (submitted) {
            router.push('/');
        }
    };

    render() {
        const { form, schoolList } = this.props;
        const { getFieldDecorator } = form;
        const { addModalState } = this.state;
        return (
            <div className={styles.main}>
                <h2 className={styles.title}>社区大学管理系统</h2>
                <div className={styles.loginContent}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem>
                            {getFieldDecorator('username', {
                                rules: [{ required: true, message: '请输入用户名' }],
                            })(
                                <Input
                                    size="large"
                                    prefix={<div className="icon-user" />}
                                    placeholder="请输入用户名"
                                />,
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: '请输入密码' }],
                            })(
                                <Input.Password
                                    size="large"
                                    prefix={<div className="icon-pwd" />}
                                    placeholder="请输入密码"
                                />,
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('school_code', {
                                rules: [{ required: false, message: '请选择分校' }],
                            })(
                                <Select
                                    placeholder="请选择分校"
                                    prefix={<div className="icon-school" />}
                                    allowClear
                                >
                                    {schoolList.map(item => (
                                        <Option value={item.name} key={item.id}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                            )}
                        </FormItem>
                        <FormItem className={styles.loginButton}>
                            <Button type="primary" primary="true" htmlType="submit">
                                立即登录
              </Button>
                        </FormItem>
                    </Form>
                    <div className="tit" style={{ color: '#dc0e19' }}>
                        温馨提示：仅辅导员需选择分校，其他用户请勿选择分校
                </div>
                </div>
                {/* 编辑用户信息 */}
                {addModalState.visible && (
                    <AddModal onCancel={this.cancelModal} modifyId={addModalState.id} type="user" />
                )}
            </div>
        );
    }
}

export default Login;
