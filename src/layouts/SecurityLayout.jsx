import React from 'react';
import { connect } from 'dva';
import { PageLoading } from '@ant-design/pro-layout';
import router from 'umi/router';
import store from 'store';

class SecurityLayout extends React.Component {
    state = {
        isReady: false,
        isLogin: false,
    };

    componentDidMount() {
        const { dispatch } = this.props;
        if (dispatch) {
            // 验证当前是否登录
            dispatch({
                type: 'user/checkAuth',
                payload: {
                    code: store.get('code'),
                },
            }).then(res => {
                if (res.code === 'SUCCESS' && res.data.user_id) {
                    this.setState({
                        isReady: true,
                        isLogin: true,
                    });
                } else {
                    this.setState({
                        isReady: true,
                        isLogin: false,
                    });
                }
            });
        }
    }

    render() {
        const { isReady, isLogin } = this.state;
        const { children, loading } = this.props;
        if ((!isLogin && loading) || !isReady) {
            return <PageLoading />;
        }

        if (!isLogin) {
            router.push({
                pathname: '/login',
            });
        }

        return children;
    }
}

export default connect(({ user, loading }) => ({
    currentUser: user.currentUser.data,
    loading: loading.models.user,
}))(SecurityLayout);
