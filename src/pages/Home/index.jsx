import React, { PureComponent, Fragment } from 'react';
import { Card } from 'antd';
import { connect } from 'dva';
import store from 'store';
import styles from './index.less';
@connect(({ home }) => ({
    currentYear: home.currentYear,
}))
export default class Home extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentUser: store.get('user')
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'home/getCurrentYear',
        });
    }

    render() {
        const { currentYear } = this.props;
        const { currentUser } = this.state;
        return (
            <Fragment>
                <Card>
                    <div className={styles.home}>
                        <div className={styles.item}>
                            <span>欢迎您：</span>
                            {currentUser.name ? currentUser.name : currentUser.username}
                        </div>
                        <div className={styles.item}>
                            <span>当前角色：</span>
                            {currentUser.role_name}
                        </div>
                        <div className={styles.item}>
                            <span>当前学年：</span>
                            {currentYear.year}
                        </div>
                        <div className={styles.item}>
                            <span>当前学期：</span>
                            {currentYear.term === '03' ? '春季' : '秋季'}
                        </div>
                    </div>
                </Card>
            </Fragment>
        );
    }
}
