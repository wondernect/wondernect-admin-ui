import React from 'react';
import classNames from 'classnames';
import { Icon } from 'antd';
// import moment from 'moment';
import styles from './index.less';

const GlobalFooter = ({ className }) => {
  const clsString = classNames(styles.globalFooter, className);
  return (
    <footer className={clsString}>
      {/* copyright <Icon type="copyright" /> 2014-{moment().format('YYYY')} All Rights Reserved
      <br />
      西安广播电视大学现代教育技术处{' '}
      <a href="http://beian.miit.gov.cn" target="_blank">
        陕ICP备10001194号-6
      </a> */}
      <Icon type="copyright" /> 版权所有 西安广播电视大学现代教育技术处
    </footer>
  );
};

export default GlobalFooter;
