/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        layout: false,
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: 'register-result',
        icon: 'smile',
        path: '/user/register-result',
        component: './user/register-result',
      },
      {
        name: 'register',
        icon: 'smile',
        path: '/user/register',
        component: './user/register',
      },
      {
        component: '404',
        path: '/user/*',
      },
    ],
  },
  // 1. 控制台
  {
    path: '/console',
    name: 'console',
    icon: 'dashboard',
    component: './console',
  },
  // 2. 线索管理
  {
    path: '/clue',
    name: 'clue',
    icon: 'bulb',
    component: './clue',
  },
  // 3. 课题管理
  {
    path: '/topic',
    name: 'topic',
    icon: 'book',
    component: './topic',
  },
  // 4. 工程管理
  {
    path: '/project',
    name: 'project',
    icon: 'project',
    routes: [
      {
        path: '/project',
        redirect: '/project/list',
      },
      {
        path: '/project/list',
        name: 'list',
        component: './project/list',
      },
      {
        path: '/project/suggestion',
        name: 'suggestion',
        component: './project/suggestion',
      },
      {
        path: '/project/requirement',
        name: 'requirement',
        component: './project/requirement',
      },
      {
        path: '/project/prompt',
        name: 'prompt',
        component: './project/prompt',
      },
    ],
  },
  // 5. 工作备忘
  {
    path: '/work-memo',
    name: 'work-memo',
    icon: 'schedule',
    routes: [
      {
        path: '/work-memo',
        redirect: '/work-memo/task',
      },
      {
        path: '/work-memo/task',
        name: 'task',
        component: './work-memo/task',
      },
      {
        path: '/work-memo/note',
        name: 'note',
        component: './work-memo/note',
      },
    ],
  },
  // 6. 财务管理
  {
    path: '/finance',
    name: 'finance',
    icon: 'moneyCollect',
    routes: [
      {
        path: '/finance',
        redirect: '/finance/budget',
      },
      {
        path: '/finance/budget',
        name: 'budget',
        component: './finance/budget',
      },
      {
        path: '/finance/reimbursement',
        name: 'reimbursement',
        component: './finance/reimbursement',
      },
    ],
  },
  // 7. 合同管理
  {
    path: '/contract',
    name: 'contract',
    icon: 'fileDone',
    routes: [
      {
        path: '/contract',
        redirect: '/contract/receipt',
      },
      {
        path: '/contract/receipt',
        name: 'receipt',
        component: './contract/receipt',
      },
      {
        path: '/contract/outsourcing',
        name: 'outsourcing',
        component: './contract/outsourcing',
      },
    ],
  },
  // 8. 团队管理
  {
    path: '/team',
    name: 'team',
    icon: 'team',
    routes: [
      {
        path: '/team',
        redirect: '/team/list',
      },
      {
        path: '/team/list',
        name: 'list',
        component: './team/list',
      },
      {
        path: '/team/member',
        name: 'member',
        component: './team/member',
      },
      {
        path: '/team/member-task',
        name: 'member-task',
        component: './team/member-task',
      },
    ],
  },
  // 9. 知识产权管理
  {
    path: '/intellectual-property',
    name: 'intellectual-property',
    icon: 'trademark',
    routes: [
      {
        path: '/intellectual-property',
        redirect: '/intellectual-property/patent',
      },
      {
        path: '/intellectual-property/patent',
        name: 'patent',
        component: './intellectual-property/patent',
      },
      {
        path: '/intellectual-property/software',
        name: 'software',
        component: './intellectual-property/software',
      },
      {
        path: '/intellectual-property/article',
        name: 'article',
        component: './intellectual-property/article',
      },
      {
        path: '/intellectual-property/library',
        name: 'library',
        component: './intellectual-property/library',
      },
    ],
  },
  // 10. 组会管理
  {
    path: '/meeting',
    name: 'meeting',
    icon: 'calendar',
    component: './meeting',
  },
  // 11. 联系人管理
  {
    path: '/contact',
    name: 'contact',
    icon: 'contacts',
    component: './contact',
  },
  // 12. 调研管理
  {
    path: '/research',
    name: 'research',
    icon: 'search',
    component: './research',
  },
  // 13. 资料管理
  {
    path: '/document',
    name: 'document',
    icon: 'folderOpen',
    routes: [
      {
        path: '/document',
        redirect: '/document/file',
      },
      {
        path: '/document/file',
        name: 'file',
        component: './document/file',
      },
      {
        path: '/document/resume',
        name: 'resume',
        component: './document/resume',
      },
    ],
  },
  // 14. 个人中心
  {
    path: '/account',
    name: 'account',
    icon: 'user',
    component: './account/center',
  },
  {
    path: '/',
    redirect: '/console',
  },
  {
    component: '404',
    path: '/*',
  },
];
