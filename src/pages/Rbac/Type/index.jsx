import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Input, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import AddModal from './Add';
import { getAuth } from '@/utils/utils';

const { Search } = Input;
const { confirm } = Modal;
@connect()
@Form.create()
class Type extends Component {
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
    this.getRoleTypePage();
  }

  // 获取角色类型列表
  getRoleTypePage() {
    const { dispatch } = this.props;
    const { pagination, searchValue } = this.state;
    const pageData = {
      page_request_data: {
        page: pagination.current - 1,
        size: pagination.size,
      },
      value: searchValue,
    };
    dispatch({
      type: 'rbacRoleType/getRoleTypePage',
      payload: pageData,
    }).then(res => {
      this.setState({
        loading: false,
        data: res.data,
      });
    });
  }

  // 查询角色类型列表
  search = value => {
    this.setState(
      produce(draft => {
        draft.loading = true;
        draft.searchValue = value;
        draft.pagination.current = 1;
      }),
      () => {
        this.getRoleTypePage();
      },
    );
  };

  // 分页发生变化
  changePage = current => {
    this.setState(
      produce(draft => {
        draft.loading = true;
        draft.pagination.current = current;
      }),
      () => {
        this.getRoleTypePage();
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
  delete = (id, name) => {
    const { dispatch } = this.props;
    const confirmTitle = `您确定删除${name}角色类型吗?`;
    const $this = this;
    confirm({
      title: confirmTitle,
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'rbacRoleType/deleteRoleType',
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
        this.getRoleTypePage();
      },
    );
  };

  render() {
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
        title: '管理',
        key: 'action',
        render: (_, record) => (
          <div>
            {getAuth('role_type').includes('edit') && (
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
            {getAuth('role_type').includes('delete') && (
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
    return (
      <PageHeaderWrapper>
        <Card>
          <div className="head-operation">
            <Search
              placeholder="输入关键字进行查询"
              enterButton="查询"
              onSearch={value => this.search(value)}
            />
            {getAuth('role_type').includes('add') && (
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

export default Type;
