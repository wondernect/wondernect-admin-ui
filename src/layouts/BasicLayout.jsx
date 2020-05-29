import ProLayout from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link } from 'umi';
import { connect } from 'dva';
import { Result, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import GlobalFooter from '@/components/GlobalFooter';
import { getAuthorityFromRouter } from '@/utils/utils';

const noMatch = (
  <Result
    status="403"
    title="403"
    subTitle="抱歉！您没有权限访问这个页面！"
    extra={
      <Button type="primary">
        <Link to="/login">Go Login</Link>
      </Button>
    }
  />
);

const BasicLayout = props => {
  const {
    dispatch,
    route: { routes, path, authority },
    children,
    settings,
    location = {
      pathname: '/',
    },
    menuData,
  } = props;
  /**
   * constructor
   */
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'menu/getMenuData',
        payload: { routes, path, authority },
      });
    }
  }, []);
  /**
   * init variables
   */

  const handleMenuCollapse = payload => {
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; // get children authority

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  return (
    <ProLayout
      menuHeaderRender={(logoDom, titleDom) => <Link to="/">{titleDom}</Link>}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => {
        if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
          return defaultDom;
        }
        return <Link to={menuItemProps.path}>{defaultDom}</Link>;
      }}
      breadcrumbRender={(routers = []) => [
        {
          path: '/',
          breadcrumbName: formatMessage({
            id: 'menu.home',
            defaultMessage: 'Home',
          }),
        },
        ...routers,
      ]}
      itemRender={(route, params, paths) => {
        const first = routes.indexOf(route) === 0;
        return first ? (
          <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
        ) : (
          <span>{route.breadcrumbName}</span>
        );
      }}
      footerRender={() => <GlobalFooter />}
      menuDataRender={() => menuData}
      formatMessage={formatMessage}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
      <Authorized authority={authorized.authority} noMatch={noMatch}>
        {children}
      </Authorized>
    </ProLayout>
  );
};

export default connect(({ global, settings, menu: menuModel }) => ({
  collapsed: global.collapsed,
  menuData: menuModel.menuData,
  settings,
}))(BasicLayout);
