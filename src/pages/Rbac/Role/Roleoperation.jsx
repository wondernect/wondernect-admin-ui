import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Table, Checkbox } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import moment from 'moment';
import produce from 'immer';
import OperaEdit from './OperaEdit';

const { confirm } = Modal;
@connect(({ rbacRole }) => ({
    rbacRole,
}))
@Form.create()
class Roleoperation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            loading: true,
            roleData: null,
            data: [],
            menuCode: null,
            operationData: null,
            pagination: {
                size: 10,
                current: 1,
            },
        };
    }

    componentDidMount() {
        this.getRoleList();
    }

    // 获取角色类型详情
    getRoleList() {
        const { location, dispatch } = this.props;
        const roleId = location.query.id;
        this.setState({
            menuCode: location.query.code,
        });
        dispatch({
            type: 'rbacRole/detailRole',
            payload: roleId,
        }).then(res => {
            this.setState(
                {
                    roleData: res.data,
                },
                () => {
                    this.roleOperaPage();
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
            operationData: code,
        });
    };

    // 删除
    delete = data => {
        const { dispatch } = this.props;
        const { roleData, menuCode } = this.state;
        const confirmTitle = `您确定删除${data.name}吗?`;
        const $this = this;
        const submitData = {
            menu_code: menuCode,
            role_code: roleData.code,
            operation_code: data.code,
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
                        type: 'rbacRole/deleteroleOpera',
                        payload: submitData,
                    }).then(res => {
                        if (res.code === 'SUCCESS') {
                            message.success('删除成功！');
                            $this.roleOperaPage();
                        }
                    });
                },
            });
        } else {
            dispatch({
                type: 'rbacRole/addroleOpera',
                payload: submitData,
            }).then(res => {
                if (res.code === 'SUCCESS') {
                    message.success('添加成功！');
                    $this.roleOperaPage();
                }
            });
        }
    };

    // 重新获取列表
    reGetList = () => {
        this.toggleModal('isShow', false);
        this.roleOperaPage();
    };

    // 显示弹窗
    toggleModal = (name, isShow) => {
        this.setState({
            [name]: isShow,
        });
    };

    // 返回上一页
    handleGoback = () => {
        router.goBack();
    };

    // 分页发生变化
    changePage = current => {
        this.setState(
            produce(draft => {
                draft.loading = true;
                draft.pagination.current = current;
            }),
            () => {
                this.roleOperaPage();
            },
        );
    };

    // 操作管理列表
    roleOperaPage() {
        const { location, dispatch } = this.props;
        const { pagination, roleData } = this.state;
        const pageData = {
            role_code: roleData.code,
            menu_code: location.query.code,
            page_request_data: {
                page: pagination.current - 1,
                size: pagination.size,
            },
        };
        dispatch({
            type: 'rbacRole/roleOperaPage',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: res.data,
            });
        });
    }

    render() {
        const { isShow, data, loading, roleData, menuCode, pagination, operationData } = this.state;
        const { location } = this.props;
        const menuName = location.query.name;
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
                    </div>
                ),
            },
        ];
        return (
            <PageHeaderWrapper>
                <Card>
                    {!loading && (
                        <div className="head-operation">
                            <Button type="cancel" onClick={this.handleGoback}>
                                返回
              </Button>
                            <div className="rolename">角色：{roleData.name}</div>
                            <div className="rolename">菜单：{menuName}</div>
                        </div>
                    )}
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
                {/* 编辑角色菜单 */}
                {isShow && (
                    <OperaEdit
                        onCancel={this.cancelModal}
                        onSuccessSubmit={this.reGetList}
                        roleCode={this.state.roleData.code}
                        menuCode={menuCode}
                        operationData={operationData}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default Roleoperation;
