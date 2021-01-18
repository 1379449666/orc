
/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/distinguish/index'),
    redirect: '/distinguish',
    meta: {
      title: '广告文案违规内容识别Beta1.0',
      keepAlive: false
    },
    children: [
      {
        path: '/distinguish',
        name: 'Distinguish',
        component: () => import('@/views/distinguish/index'),
        meta: { title: '广告文案违规内容识别Beta1.0', keepAlive: true }
      }
    ]
  }
]
