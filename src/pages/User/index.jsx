import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Input, Select, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import AddModal from './Add';
import ModifyPassword from './ModifyPassword';
import { getAuth } from '@/utils/utils';

const { Option } = Select;
const { confirm } = Modal;
const FormItem = Form.Item;
@connect(({ user, rbacRole }) => ({
    roleLists: user.roleLists,
    roleTypeLists: rbacRole.roleLists,
}))
@Form.create()
class User extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            isShowPassword: false,
            modifyId: null,
            passwordId: null,
            loading: false,
            data: [],
            pagination: {
                size: 10,
                current: 1,
            },
            searchValue: '',
            enable: '',
            role: '',
            roleType: '',
        };
    }

    componentDidMount() {
        this.getuserPage();
        this.getRoleList();
    }

    // 获取角色类型下拉列表
    getRoleList() {
        const { dispatch } = this.props;
        dispatch({
            type: 'rbacRole/getRoleList',
            payload: {
                value: '',
            },
        });
        dispatch({
            type: 'user/getRoleList',
            payload: {
                value: '',
            },
        });
    }

    // 获取用户列表
    getuserPage() {
        const { dispatch } = this.props;
        const { pagination, enable, searchValue, role, roleType } = this.state;
        const pageData = {
            page_request_data: {
                page: pagination.current - 1,
                size: pagination.size,
            },
            role,
            enable,
            role_type: roleType,
            username: searchValue,
        };
        dispatch({
            type: 'user/getuserPage',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: res.data,
            });
        });
    }

    // 查询角色类型列表
    search = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, values) => {
            if (!err) {
                this.setState(
                    produce(draft => {
                        // eslint-disable-next-line no-param-reassign
                        draft.loading = true;
                        draft.searchValue = values.username;
                        draft.enable = values.enable;
                        draft.role = values.role;
                        draft.roleType = values.role_type;
                        draft.pagination.current = 1;
                    }),
                    () => {
                        this.getuserPage();
                    },
                );
            }
        });
    };

    // 分页发生变化
    changePage = current => {
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = current;
            }),
            () => {
                this.getuserPage();
            },
        );
    };

    // 显示弹窗
    toggleModal = (name, isShow) => {
        this.setState({
            [name]: isShow,
        });
    };

    // 关闭弹窗
    cancelModal = () => {
        this.toggleModal('isShow', false);
    };

    // 打开弹窗
    openModal = id => {
        this.toggleModal('isShow', true);
        this.setState({
            modifyId: id,
        });
    };

    // 打开修改密码弹窗
    openModifyPassword = id => {
        this.toggleModal('isShowPassword', true);
        this.setState({
            passwordId: id,
        });
    };

    // 关闭弹窗
    cancelPassword = () => {
        this.toggleModal('isShowPassword', false);
    };

    // 删除
    delete = (id, name) => {
        const { dispatch } = this.props;
        const confirmTitle = `您确定删除${name}用户吗?`;
        const $this = this;
        confirm({
            title: confirmTitle,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'user/deleteuser',
                    payload: id,
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        message.success('删除成功！');
                        $this.reGetList();
                    }
                });
            },
        });
    };

    // 重新获取列表
    reGetList = () => {
        this.toggleModal('isShowPassword', false);
        this.toggleModal('isShow', false);
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = 1;
            }),
            () => {
                this.getuserPage();
            },
        );
    };

    //   启用、禁用
    enable = (id, type) => {
        const { dispatch } = this.props;
        const dispatchType = type === 'enable' ? 'enableUser' : 'disableUser';
        const tit = type === 'enable' ? '启用' : '禁用';
        dispatch({
            type: `user/${dispatchType}`,
            payload: id,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                message.success(`${tit}成功！`);
                this.reGetList();
            }
        });
    };

    render() {
        const {
            roleTypeLists,
            roleLists,
            form: { getFieldDecorator },
        } = this.props;
        const { isShow, isShowPassword, pagination, data, loading } = this.state;
        const columns = [
            {
                title: '用户名',
                dataIndex: 'username',
                key: 'username',
            },
            {
                title: '角色类型',
                dataIndex: 'role_type_name',
                key: 'role_type_name',
            },
            {
                title: '角色',
                dataIndex: 'role_name',
                key: 'role_name',
            },
            {
                title: '姓名',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '所属学校',
                dataIndex: 'school_name',
                key: 'school_name',
            },
            {
                title: '是否可用',
                dataIndex: 'enable',
                key: 'enable',
                render: enable => (enable ? <span>是</span> : <span>否</span>),
            },
            {
                title: '是否可编辑',
                dataIndex: 'editable',
                key: 'editable',
                render: editable => (editable ? <span>是</span> : <span>否</span>),
            },
            {
                title: '是否删除',
                dataIndex: 'deletable',
                key: 'deletable',
                render: deletable => (deletable ? <span>是</span> : <span>否</span>),
            },
            {
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        {getAuth('user_management').includes('modify') && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.openModifyPassword(record.id);
                                }}
                            >
                                修改密码
                            </Button>
                        )}
                        {getAuth('user_management').includes('edit') && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.openModal(record.id);
                                }}
                                disabled={!record.editable}
                            >
                                编辑
                            </Button>
                        )}
                        {record.enable && getAuth('user_management').includes('disable') && (
                            <Button
                                type="danger"
                                onClick={() => {
                                    this.enable(record.id, 'disable');
                                }}
                            >
                                禁用
                            </Button>
                        )}
                        {!record.enable && getAuth('user_management').includes('enable') && (
                            <Button
                                type="primary"
                                onClick={() => {
                                    this.enable(record.id, 'enable');
                                }}
                            >
                                启用
                            </Button>
                        )}
                        {getAuth('user_management').includes('delete') && (
                            <Button
                                type="danger"
                                onClick={() => {
                                    this.delete(record.id, record.username);
                                }}
                                disabled={!record.deletable}
                            >
                                删除
                            </Button>
                        )}
                    </div>
                ),
            },
        ];
        return (
            <PageHeaderWrapper>
                <Card>
                    <div className="head-operation">
                        <Form onSubmit={this.search} layout="inline">
                            <FormItem>
                                {getFieldDecorator(
                                    'role_type',
                                    {},
                                )(
                                    <Select placeholder="请选择角色类型" allowClear style={{ width: 200 }}>
                                        {roleTypeLists.map(item => (
                                            <Option value={item.code} key={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator(
                                    'role',
                                    {},
                                )(
                                    <Select placeholder="请选择角色" allowClear style={{ width: 200 }}>
                                        {roleLists.map(item => (
                                            <Option value={item.code} key={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>,
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator(
                                    'enable',
                                    {},
                                )(
                                    <Select placeholder="状态" allowClear style={{ width: 120 }}>
                                        <Option value="true">启用</Option>
                                        <Option value="false">禁用</Option>
                                    </Select>,
                                )}
                            </FormItem>
                            <FormItem>
                                {getFieldDecorator('username', {})(<Input placeholder="请输入用户名" />)}
                            </FormItem>
                            <Button type="primary" htmlType="submit">
                                查询
              </Button>
                        </Form>
                        {getAuth('user_management').includes('add') && (
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => {
                                    this.openModal();
                                }}
                            >
                                添加
                            </Button>
                        )}
                    </div>
                    <Table
                        rowKey="id"
                        columns={columns}
                        dataSource={data.data_list}
                        loading={loading}
                        bordered
                        pagination={{
                            total: data.total_elements,
                            showTotal: total => `共有 ${total} 条记录`,
                            pageSize: pagination.size,
                            showQuickJumper: true,
                            onChange: this.changePage,
                            current: pagination.current,
                            defaultCurrent: pagination.current,
                        }}
                    />
                </Card>
                {/* 添加或编辑 */}
                {isShow && (
                    <AddModal
                        onCancel={this.cancelModal}
                        onSuccessSubmit={this.reGetList}
                        modifyId={this.state.modifyId}
                    />
                )}
                {/* 修改密码 */}
                {isShowPassword && (
                    <ModifyPassword
                        onCancel={this.cancelPassword}
                        onSuccessSubmit={this.reGetList}
                        passwordId={this.state.passwordId}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default User;
