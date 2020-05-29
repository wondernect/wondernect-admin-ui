import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, TreeSelect, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import AddModal from './Add';
import { getAuth } from '@/utils/utils';

const { TreeNode } = TreeSelect;
const { confirm } = Modal;
@connect(({ rbacMenu, rbacOperation }) => ({
    menuTreeLists: rbacMenu.treeLists,
    rbacOperation,
}))
@Form.create()
class Operation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            modifyId: null,
            loading: false,
            data: [],
            menuCode: 'community_education',
            pagination: {
                size: 10,
                current: 1,
            },
            searchValue: '',
            treeLoading: true,
        };
    }

    componentDidMount() {
        this.getOperationPage();
        this.getMenuTree();
    }

    // 获取角色类型列表
    getOperationPage() {
        const { dispatch } = this.props;
        const { pagination, searchValue } = this.state;
        const pageData = {
            page_request_data: {
                page: pagination.current - 1,
                size: pagination.size,
            },
            menu_code: searchValue,
        };
        dispatch({
            type: 'rbacOperation/getOperationPage',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: res.data,
            });
        });
    }

    // 获取树形菜单
    getMenuTree() {
        const { menuCode } = this.state;
        const { dispatch } = this.props;
        dispatch({
            type: 'rbacMenu/getMenuTree',
            payload: menuCode,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                this.setState({
                    treeLoading: false,
                });
            }
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
        const confirmTitle = `您确定删除${menu} ${name}操作吗?`;
        const $this = this;
        confirm({
            title: confirmTitle,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'rbacOperation/deleteOperation',
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
                this.getOperationPage();
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
                this.getOperationPage();
            },
        );
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
        const { menuTreeLists } = this.props;
        const { isShow, pagination, data, loading, treeLoading } = this.state;
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
                title: '所属菜单',
                dataIndex: 'menu_name',
                key: 'menu_name',
            },
            {
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        {getAuth('operation').includes('edit') && (
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
                        {getAuth('operation').includes('delete') && (
                            <Button
                                type="danger"
                                onClick={() => {
                                    this.delete(record.id, record.name, record.menu_name);
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
                    {!treeLoading && (
                        <div className="head-operation">
                            <TreeSelect
                                dropdownStyle={{ maxHeight: 600, overflow: 'auto' }}
                                placeholder="请选择所属菜单"
                                allowClear
                                treeDefaultExpandAll
                                onChange={this.onChange}
                            >
                                {this.renderTreeNodes([menuTreeLists])}
                            </TreeSelect>

                            <Button
                                type="primary"
                                onClick={() => {
                                    this.search();
                                }}
                            >
                                查询
              </Button>
                            {getAuth('operation').includes('add') && (
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

export default Operation;
