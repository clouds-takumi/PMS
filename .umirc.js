
// ref: https://umijs.org/config/
export default {
  treeShaking: true,
  routes: [
    { path: '/login', component: '../pages/login' },
    {
      path: '/',
      component: '../pages/index',
      routes: [
        {
          path: '/',
          component: '../pages/with-auth/index',
          routes: [
            { path: '/', redirect: '/workbench' },
            { path: '/workbench', component: '../pages/with-auth/workbench' },
            { path: '/project', component: '../pages/with-auth/project' },
            { path: '/center', component: '../pages/with-auth/center' },
            {
              path: '/p/:projectId/:type',
              component: '../pages/with-auth/p/index',
              routes: [
                { path: '/p/:projectId/overview', component: '../pages/with-auth/p/overview' },
                { path: '/p/:projectId/iteration', component: '../pages/with-auth/p/iteration' },
                { path: '/p/:projectId/issue', component: '../pages/with-auth/p/issue' },
                { path: '/p/:projectId/backlog', component: '../pages/with-auth/p/backlog' },
                { path: '/p/:projectId/tag', component: '../pages/with-auth/p/tag' },
                { path: '/p/:projectId/user', component: '../pages/with-auth/p/user' },
              ],
            },
          ],
        },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    ['umi-plugin-react', {
      antd: true,
      dva: false,
      dynamicImport: { webpackChunkName: true },
      title: 'frontend',
      dll: true,

      routes: {
        exclude: [
          /components\//,
        ],
      },
    }],
  ],
  theme: {
    'primary-color': '#202d40',
  },
}
