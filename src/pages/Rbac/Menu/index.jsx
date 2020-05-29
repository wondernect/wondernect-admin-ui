import React, { Component } from 'react';
import { Form, Card, Button, Modal, Table, message, Spin } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import AddModal from './Add';
import { getAuth } from '@/utils/utils';

const { confirm } = Modal;
@connect()
@Form.create()
class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            modifyId: null,
            menuCode: 'community_education',
            loading: true,
            data: [],
        };
    }

    componentDidMount() {
        this.getMenuPage();
    }

    // 获取树形菜单
    getMenuPage() {
        const { menuCode } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'rbacMenu/getMenuPage',
            payload: menuCode,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                this.setState({
                    loading: false,
                    data: Array.isArray(res.data) ? res.data : [res.data],
                });
            }
        });
    }

    // 重新获取列表
    reGetList = () => {
        this.toggleModal('isShow', false);
        this.getMenuPage();
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
    delete = (id, name) => {
        const { dispatch } = this.props;
        const confirmTitle = `您确定删除${name}菜单吗?`;
        const $this = this;
        confirm({
            title: confirmTitle,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'rbacMenu/deleteMenu',
                    payload: id,
                }).then(res => {
                    if (res.code === 'SUCCESS') {
                        message.success('删除成功！');
                        $this.getMenuPage();
                    }
                });
            },
        });
    };

    // 移除无子节点的children属性
    transformOriginData = data => {
        data.forEach(item => {
            if (Array.isArray(item.child_list)) {
                if (item.child_list.length) {
                    this.transformOriginData(item.child_list);
                } else {
                    delete item.child_list;
                }
            }
        });
    };

    render() {
        const { isShow } = this.state;
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
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        {getAuth('menu').includes('edit') && (
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
                        {getAuth('menu').includes('delete') && (
                            <Button
                                type="danger"
                                onClick={() => {
                                    this.delete(record.id, record.name);
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
        const { data, loading } = this.state;
        this.transformOriginData(data);
        return (
            <PageHeaderWrapper>
                <Card>
                    <Spin spinning={loading} tip="菜单加载中，请稍等...">
                        <div className="head-operation">
                            {/* {getAuth('menu').includes('add') && (
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={() => {
                                        this.openModal();
                                    }}
                                >
                                    添加
                                </Button>
                            )} */}
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => {
                                    this.openModal();
                                }}
                            >
                                添加
                                </Button>
                        </div>
                        {!loading && (
                            <Table
                                columns={columns}
                                dataSource={data}
                                bordered
                                rowKey={record => record.id}
                                loading={loading}
                                pagination={false}
                                childrenColumnName="child_list"
                                defaultExpandAllRows
                            />
                        )}
                    </Spin>
                </Card>
                {/* 添加或编辑菜单 */}
                {isShow && (
                    <AddModal
                        onCancel={this.cancelModal}
                        modifyId={this.state.modifyId}
                        onSuccessSubmit={this.reGetList}
                    />
                )}
            </PageHeaderWrapper>
        );
    }
}

export default Menu;
