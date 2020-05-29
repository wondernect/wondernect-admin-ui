import { Button, Result } from 'antd';
import React from 'react';
import { router } from 'umi';

const NoAuthorityPage = () => (
  <Result
    status="403"
    title="403"
    subTitle="抱歉！您没有权限访问这个页面！"
    extra={
      <Button type="primary" onClick={() => router.push('/')}>
        返回首页
      </Button>
    }
  ></Result>
);

export default NoAuthorityPage;
