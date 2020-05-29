import React, { PureComponent } from 'react';
import { Modal, Table, Button, message, Form, Input } from 'antd';
import { connect } from 'dva';

const { Search } = Input;

@Form.create()
@connect(({ branchCampus }) => ({
  eduSchoolList: branchCampus.eduSchoolList,
}))
export default class AddModal extends PureComponent {
  state = {
    selectedRowKeys: [],
    selectData: [],
    loading: true,
    searchval: '',
  };

  componentDidMount() {
    this.getSchoolList();
  }

  // 获取分校列表
  getSchoolList() {
    const { dispatch } = this.props;
    const { searchval } = this.state;
    dispatch({
      type: 'branchCampus/getEduSchoolist',
      payload: searchval,
    }).then(res => {
      if (res.code === 'SUCCESS') {
        this.setState({
          loading: false,
        });
      }
    });
  }

  // 点击添加
  save = () => {
    const { dispatch, onSuccessSubmit } = this.props;
    this.setState({ loading: true });
    const { selectData } = this.state;
    dispatch({
      type: 'branchCampus/createschool',
      payload: selectData,
    }).then(res => {
      if (res.code === 'SUCCESS') {
        this.setState({ loading: false });
        message.success('添加成功！');
        if (typeof onSuccessSubmit === 'function') {
          onSuccessSubmit();
        }
      }
    });
  };

  onSelectChange = (selectedRowKeys, record) => {
    this.setState({
      selectedRowKeys,
      selectData: record,
    });
  };

  // 搜索分校
  search = value => {
    this.setState(
      {
        loading: true,
        searchval: value,
      },
      () => {
        this.getSchoolList();
      },
    );
  };

  // 取消
  onCancel = () => {
    const { onCancel } = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  render() {
    const columns = [
      {
        title: '分校名称',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: '分校代码',
        dataIndex: 'code',
        key: 'code',
      },
    ];
    const { loading, selectedRowKeys } = this.state;
    const { eduSchoolList } = this.props;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
        code: record.code,
      }),
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <Modal visible title="添加分校" width={600} footer={null} onCancel={this.onCancel}>
        <div style={{ marginBottom: 16 }}>
          <Search
            placeholder="输入关键字进行搜索"
            enterButton="搜索"
            style={{ width: 300, marginRight: 20 }}
            onSearch={value => this.search(value)}
          />
          <Button type="primary" onClick={this.save} disabled={!hasSelected} loading={loading}>
            批量添加
          </Button>
          <span style={{ marginLeft: 8 }}>
            {hasSelected ? `您选择了 ${selectedRowKeys.length} 所分校` : ''}
          </span>
        </div>
        <Table
          rowKey={record => record.code}
          rowSelection={rowSelection}
          loading={loading}
          columns={columns}
          bordered
          dataSource={eduSchoolList}
        />
      </Modal>
    );
  }
}
