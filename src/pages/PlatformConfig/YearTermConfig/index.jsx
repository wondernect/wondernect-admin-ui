import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import AddModal from './Add';
import { getAuth } from '@/utils/utils';

const { confirm } = Modal;
@connect()
@Form.create()
class YearTermConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShow: false,
            loading: false,
            data: [],
            pagination: {
                size: 10,
                current: 1,
            },
        };
    }

    componentDidMount() {
        this.getYearTermPage();
    }

    // 获取列表
    getYearTermPage() {
        const { dispatch } = this.props;
        const { pagination } = this.state;
        const pageData = {
            page_request_data: {
                page: pagination.current - 1,
                size: pagination.size,
            },
        };
        dispatch({
            type: 'YearTermConfig/getYearTermPage',
            payload: pageData,
        }).then(res => {
            this.setState({
                loading: false,
                data: res.data,
            });
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
                this.getYearTermPage();
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
    openModal = () => {
        this.toggleModal('isShow', true);
    };

    // 删除
    delete = record => {
        const { dispatch } = this.props;
        const confirmTitle = `您确定删除${record.year} ${record.term}学年学期吗?`;
        const $this = this;
        confirm({
            title: confirmTitle,
            content: '',
            okText: '确认',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                dispatch({
                    type: 'YearTermConfig/deleteYearTerm',
                    payload: record.id,
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
                this.getYearTermPage();
            },
        );
    };

    // 设置当前学年学期
    setCurrent = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'YearTermConfig/setCurrent',
            payload: id,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                message.success('设置成功！');
                this.reGetList();
            }
        });
    };

    // 设置上一学年学期
    setLast = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'YearTermConfig/setLast',
            payload: id,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                message.success('设置成功！');
                this.reGetList();
            }
        });
    };

    // 设为论文撰写学年学期
    setStudentGet = id => {
        const { dispatch } = this.props;
        dispatch({
            type: 'YearTermConfig/setStudentGet',
            payload: id,
        }).then(res => {
            if (res.code === 'SUCCESS') {
                message.success('设置成功！');
                this.reGetList();
            }
        });
    };

    render() {
        const { isShow, pagination, data, loading } = this.state;
        const columns = [
            {
                title: '年度',
                dataIndex: 'year',
                key: 'year',
            },
            {
                title: '学期',
                dataIndex: 'term',
                key: 'term',
            },
            {
                title: '是否当前学年学期',
                dataIndex: 'current_year_term',
                key: 'current_year_term',
                // eslint-disable-next-line @typescript-eslint/camelcase
                render: current_year_term => (current_year_term ? <span>是</span> : <span>否</span>),
            },
            {
                title: '是否上一学年学期',
                dataIndex: 'last_year_term',
                key: 'last_year_term',
                // eslint-disable-next-line @typescript-eslint/camelcase
                render: last_year_term => (last_year_term ? <span>是</span> : <span>否</span>),
            },
            {
                title: '是否论文撰写学年学期',
                dataIndex: 'student_get_year_term',
                key: 'student_get_year_term',
                // eslint-disable-next-line @typescript-eslint/camelcase
                render: student_get_year_term =>
                    // eslint-disable-next-line @typescript-eslint/camelcase
                    student_get_year_term ? <span>是</span> : <span>否</span>,
            },
            {
                title: '管理',
                key: 'action',
                render: (_, record) => (
                    <div>
                        {getAuth('year_term_config').includes('set_current') && (
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    this.setCurrent(record.id);
                                }}
                                disabled={record.current_year_term}
                            >
                                设为当前学年学期
                            </Button>
                        )}
                        {getAuth('year_term_config').includes('set_last') && (
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    this.setLast(record.id);
                                }}
                                disabled={record.last_year_term}
                            >
                                设为上一学年学期
                            </Button>
                        )}
                        {getAuth('year_term_config').includes('set_student_get') && (
                            <Button
                                size="small"
                                type="primary"
                                onClick={() => {
                                    this.setStudentGet(record.id);
                                }}
                                disabled={record.student_get_year_term}
                            >
                                设为论文撰写学年学期
                            </Button>
                        )}
                        {getAuth('year_term_config').includes('delete') && (
                            <Button
                                size="small"
                                type="danger"
                                onClick={() => {
                                    this.delete(record);
                                }}
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
                        {getAuth('year_term_config').includes('add') && (
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

export default YearTermConfig;
