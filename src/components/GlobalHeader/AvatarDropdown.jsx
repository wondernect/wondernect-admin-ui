import { Avatar, Icon, Menu } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import React from 'react';
import { connect } from 'dva';
import store from 'store';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import avatar from '../../assets/avatar.png';
import AddModal from '@/pages/User/Add';

class AvatarDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      currentUser: store.get('user'),
      modifyId: store.get('user').id,
    };
  }

  componentDidMount() {
    this.getRoleList();
  }

  onMenuClick = event => {
    const { key } = event;
    if (key === 'logout') {
      const { dispatch } = this.props;
      if (dispatch) {
        dispatch({
          type: 'login/logout',
        });
      }
    }
    if (key === 'modify') {
      this.toggleModal('isShow', true);
    }
  };

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

  render() {
    const { isShow, currentUser } = this.state;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="modify">
          <Icon type="edit" />
          个人信息
        </Menu.Item>
        <Menu.Item key="logout">
          <Icon type="logout" />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
      </Menu>
    );
    return (
      <div>
        <HeaderDropdown overlay={menuHeaderDropdown}>
          <span className={`${styles.action} ${styles.account}`}>
            <Avatar size="small" className={styles.avatar} src={avatar} alt="avatar" />
            <span className={styles.name}>
              {currentUser.name ? currentUser.name : currentUser.username}
            </span>
          </span>
        </HeaderDropdown>
        {/* 添加或编辑 */}
        {isShow && (
          <AddModal onCancel={this.cancelModal} modifyId={this.state.modifyId} type="user" />
        )}
      </div>
    );
  }
}

export default connect(({ login, user, rbacRole }) => ({
  currentUser: login.currentUser,
  roleLists: user.roleLists,
  roleTypeLists: rbacRole.roleLists,
}))(AvatarDropdown);
