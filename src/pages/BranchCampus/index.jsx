import React, { Component } from 'react';
import { Form, Card, Button, Modal, message, Input, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import produce from 'immer';
import AddModal from './Add';
import ModifyModal from './Modify';
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
      isShowModify: false,
      modifyId: null,
      loading: true,
      data: [],
      pagination: {
        size: 10,
        current: 1,
      },
      searchValue: '',
    };
  }

  componentDidMount() {
    this.getEduSchooPage();
  }

  // 获取分校列表
  getEduSchooPage() {
    const { dispatch } = this.props;
    const { pagination, searchValue } = this.state;
    const pageData = {
      page_request_data: {
        page: pagination.current - 1,
        size: pagination.size,
      },
      search_text: searchValue,
    };
    dispatch({
      type: 'branchCampus/getEduSchooPage',
      payload: pageData,
    }).then(res => {
      if (res.code === 'SUCCESS') {
        this.setState({
          loading: false,
          data: res.data,
        });
      }
    });
  }

  // 查询分校列表
  search = value => {
    this.setState(
      produce(draft => {
        draft.loading = true;
        draft.searchValue = value;
        draft.pagination.current = 1;
      }),
      () => {
        this.getEduSchooPage();
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
        this.getEduSchooPage();
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
    this.toggleModal('isShowModify', false);
  };

  // 打开弹窗
  openModal = () => {
    this.toggleModal('isShow', true);
  };

  // 打开弹窗
  openModify = id => {
    this.toggleModal('isShowModify', true);
    this.setState({
      modifyId: id,
    });
  };

  // 删除
  delete = (id, name) => {
    const { dispatch } = this.props;
    const confirmTitle = `您确定删除${name}分校吗?`;
    const $this = this;
    confirm({
      title: confirmTitle,
      content: '',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        dispatch({
          type: 'branchCampus/deleteSchool',
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
    this.toggleModal('isShowModify', false);
    this.setState(
      produce(draft => {
        draft.loading = true;
        draft.pagination.current = 1;
      }),
      () => {
        this.getEduSchooPage();
      },
    );
  };

  render() {
    const { isShow, isShowModify, pagination, data, loading } = this.state;
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
            {getAuth('branchCampus').includes('edit') && (
              <Button
                type="primary"
                onClick={() => {
                  this.openModify(record.id);
                }}
              >
                编辑
              </Button>
            )}
            {getAuth('branchCampus').includes('delete') && (
              <Button
                type="danger"
                onClick={() => {
                  this.delete(record.id, record.name);
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
            <Search
              placeholder="输入关键字进行查询"
              enterButton="查询"
              onSearch={value => this.search(value)}
            />
            {getAuth('branchCampus').includes('add') && (
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
        {/* 添加分校 */}
        {isShow && <AddModal onCancel={this.cancelModal} onSuccessSubmit={this.reGetList} />}
        {/* 编辑分校 */}
        {isShowModify && (
          <ModifyModal
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
