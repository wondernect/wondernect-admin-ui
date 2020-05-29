import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Table, Checkbox, Spin } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Link from 'umi/link';
import router from 'umi/router';
import moment from 'moment';
import MenuEdit from './MenuEdit';

const { confirm } = Modal;
@connect(({ rbacRole }) => ({
    rbacRole,
}))
@Form.create()
class RoleMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            loading: true,
            roleData: null,
            data: [],
            menuData: null,
        };
    }

    componentDidMount() {
        this.getRoleList();
    }

    // 获取角色类型详情
    getRoleList() {
        const { location, dispatch } = this.props;
        const roleId = location.query.id;
        dispatch({
            type: 'rbacRole/detailRole',
            payload: roleId,
        }).then(res => {
            this.setState(
                {
                    roleData: res.data,
                },
                () => {
                    this.roleMenuTree();
                },
            );
        });
    }

    // 关闭弹窗
    cancelModal = () => {
        this.toggleModal('isShow', false);
    };

    // 打开弹窗
    openModal = code => {
        this.toggleModal('isShow', true);
        this.setState({
            menuData: code,
        });
    };

    // 删除
    delete = data => {
        const { dispatch } = this.props;
        const { roleData } = this.state;
        const confirmTitle = `您确定删除${data.name}吗?`;
        const $this = this;
        const submitData = {
            menu_code: data.code,
            role_code: roleData.code,
        };
        if (data.visible) {
            confirm({
                title: confirmTitle,
                content: '',
                okText: '确认',
                okType: 'danger',
                cancelText: '取消',
                onOk() {
                    dispatch({
                        type: 'rbacRole/deleteRoleMenu',
                        payload: submitData,
                    }).then(res => {
                        if (res.code === 'SUCCESS') {
                            message.success('删除成功！');
                            $this.roleMenuTree();
                        }
                    });
                },
            });
        } else {
            dispatch({
                type: 'rbacRole/addRoleMenu',
                payload: submitData,
            }).then(res => {
                if (res.code === 'SUCCESS') {
                    message.success('添加成功！');
                    $this.roleMenuTree();
                }
            });
        }
    };

    // 重新获取列表
    reGetList = () => {
        this.toggleModal('isShow', false);
        this.roleMenuTree();
    };

    // 显示弹窗
    toggleModal = (name, isShow) => {
        this.setState({
            [name]: isShow,
        });
    };

    // 移除无子节点的children属性
    transformOriginData = data => {
        data.forEach(item => {
            if (Array.isArray(item.child_list)) {
                if (item.child_list.length) {
                    this.transformOriginData(item.child_list);
                } else {
                    // eslint-disable-next-line no-param-reassign
                    delete item.child_list;
                }
            }
        });
    };

    // 返回上一页
    handleGoback = () => {
        router.goBack();
    };

    // 角色对应菜单树形结构
    roleMenuTree() {
        const { dispatch } = this.props;
        const { roleData } = this.state;
        const pageData = {
            role_code: roleData.code,
            menu_code: 'community_education',
        };
        dispatch({
            type: 'rbacRole/roleMenuTree',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: Array.isArray(res.data) ? res.data : [res.data],
            });
        });
    }

    render() {
        const { isShow, data, loading, roleData, menuData } = this.state;
        this.transformOriginData(data);
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
                title: '可见时间',
                key: 'limitable',
                render: (_, record) =>
                    record.limitable ? (
                        <span>
                            {moment(record.start_time).format('YYYY-MM-DD HH:mm')}至
                            {moment(record.endTime).format('YYYY-MM-DD HH:mm')}
                        </span>
                    ) : (
                            <span>无限制</span>
                        ),
            },
            {
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        <Checkbox
                            checked={record.visible}
                            className="operationCheck"
                            onChange={() => {
                                this.delete(record);
                            }}
                        ></Checkbox>
                        <Button
                            type="primary"
                            onClick={() => {
                                this.openModal(record);
                            }}
                            disabled={!record.visible}
                        >
                            编辑
            </Button>
                        <Link
                            to={`/rbac/role/operation?id=${roleData.id}&name=${record.name}&code=${record.code}`}
                        >
                            <Button type="primary" disabled={!record.visible}>
                                操作管理
              </Button>
                        </Link>
                    </div>
                ),
            },
        ];
        return (
            <PageHeaderWrapper>
                <Spin spinning={loading} tip="菜单加载中，请稍等...">
                    {!loading && (
                        <Card>
                            <div className="head-operation">
                                <Button type="cancel" onClick={this.handleGoback}>
                                    返回
                </Button>
                                <div className="rolename">角色：{roleData.name}</div>
                            </div>
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered
                                rowKey={record => `${record.code}${record.name}`}
                                loading={loading}
                                pagination={false}
                                childrenColumnName="child_list"
                                defaultExpandAllRows
                            />
                        </Card>
                    )}
                </Spin>
                {/* 编辑角色菜单 */}
                {isShow && (
                    <MenuEdit
                        onCancel={this.cancelModal}
                        onSuccessSubmit={this.reGetList}
                        roleCode={this.state.roleData.code}
                        menuData={menuData}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default RoleMenu;
