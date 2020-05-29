export default [
  {
    path: '/login',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/login',
        component: './login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        routes: [
          {
            path: '/',
            icon: 'home',
            name: '首页',
            component: './Home',
          },
          {
            path: '/user',
            code: 'user_management',
            name: '用户管理',
            icon: 'team',
            component: './User',
          },
          {
            path: '/platformconfig',
            icon: 'setting',
            code: 'platform_config',
            name: '平台配置',
            routes: [
              {
                code: 'year_term_config',
                path: '/platformconfig/year_term',
                name: '学期学年配置',
                component: './PlatformConfig/YearTermConfig',
              },
            ],
          },
          {
            path: '/rbac',
            icon: 'unlock',
            code: 'user_privilege',
            name: '权限管理',
            routes: [
              {
                code: 'role_type',
                path: '/rbac/type',
                name: '角色类型',
                component: './Rbac/Type',
              },
              {
                code: 'menu',
                path: '/rbac/menu',
                name: '菜单',
                component: './Rbac/Menu',
              },
              {
                code: 'operation',
                path: '/rbac/operation',
                name: '操作',
                component: './Rbac/Operation',
              },
              {
                code: 'role',
                path: '/rbac/role',
                name: '角色',
                hideChildrenInMenu: true,
                routes: [
                  {
                    path: '/rbac/role',
                    name: '角色',
                    component: './Rbac/Role',
                  },
                  {
                    path: '/rbac/role/menu',
                    name: '菜单管理',
                    component: './Rbac/Role/RoleMenu',
                  },
                  {
                    path: '/rbac/role/operation',
                    name: '操作管理',
                    component: './Rbac/Role/RoleOperation',
                  },
                ],
              },
            ],
          },
          {
            path: '/branchcampus',
            code: 'branchCampus',
            name: '分校管理',
            icon: 'bank',
            component: './BranchCampus',
          },
          {
            path: '/exception/404',
            component: './Exception/404',
          },
          {
            path: '/exception/403',
            component: './Exception/403',
          },
        ],
      },
    ],
  },
  {
    component: './Exception/404',
  },
];
