import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Select, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import Link from 'umi/link';
import AddModal from './Add';
import { getAuth } from '@/utils/utils';

const { Option } = Select;
const { confirm } = Modal;
@connect(({ rbacRole }) => ({
    roleLists: rbacRole.roleLists,
}))
@Form.create()
class Role extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            modifyId: null,
            loading: false,
            data: [],
            pagination: {
                size: 10,
                current: 1,
            },
            searchValue: '',
        };
    }

    componentDidMount() {
        this.getRolePage();
        this.getRoleList();
    }

    // 获取角色类型列表
    getRolePage() {
        const { dispatch } = this.props;
        const { pagination, searchValue } = this.state;
        const pageData = {
            page_request_data: {
                page: pagination.current - 1,
                size: pagination.size,
            },
            role_type: searchValue,
        };
        dispatch({
            type: 'rbacRole/getRolePage',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: res.data,
            });
        });
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
    }

    // 分页发生变化
    changePage = current => {
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = current;
            }),
            () => {
                this.getOperationPage();
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

    // 删除
    delete = (id, name, menu) => {
        const { dispatch } = this.props;
        const confirmTitle = `您确定删除${menu} ${name}吗?`;
        const $this = this;
        confirm({
            title: confirmTitle,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'rbacRole/deleteRole',
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
        this.toggleModal('isShow', false);
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = 1;
            }),
            () => {
                this.getRolePage();
            },
        );
    };

    onChange = value => {
        this.setState({
            searchValue: value,
        });
    };

    // 查询角色类型列表
    search = () => {
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = 1;
            }),
            () => {
                this.getRolePage();
            },
        );
    };

    render() {
        const { roleLists } = this.props;
        const { isShow, pagination, data, loading } = this.state;
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '代码',
                dataIndex: 'code',
                key: 'code',
            },
            {
                title: '所属角色类型',
                dataIndex: 'role_type_name',
                key: 'role_type_name',
            },
            {
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        {getAuth('role').includes('edit') && (
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
                        {getAuth('role').includes('delete') && (
                            <Button
                                type="danger"
                                onClick={() => {
                                    this.delete(record.id, record.name, record.role_type_name);
                                }}
                                disabled={!record.deletable}
                            >
                                删除
                            </Button>
                        )}
                        {getAuth('role').includes('menu_manage') && (
                            <Link to={`/rbac/role/menu?id=${record.id}`}>
                                <Button type="primary">菜单管理</Button>
                            </Link>
                        )}
                    </div>
                ),
            },
        ];
        return (
            <PageHeaderWrapper>
                <Card>
                    <div className="head-operation">
                        <Select placeholder="请选择角色类型" onChange={this.onChange} allowClear>
                            {roleLists.map(item => (
                                <Option value={item.code} key={item.id}>
                                    {item.name}
                                </Option>
                            ))}
                        </Select>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.search();
                            }}
                        >
                            查询
            </Button>
                        {getAuth('role').includes('add') && (
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
                {/* 添加或编辑角色类型 */}
                {isShow && (
                    <AddModal
                        onCancel={this.cancelModal}
                        onSuccessSubmit={this.reGetList}
                        modifyId={this.state.modifyId}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default Role;
