// src\router\index.ts
import {createRouter, RouteRecordRaw, createWebHashHistory, RouterView} from 'vue-router'
import AppLayout from '../layout/AppLayout.vue'
import nProgress from 'nprogress';
import 'nprogress/nprogress.css'
import store from '@/store';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'media',
        name: 'media',
        component: () => import('@/views/Media.vue'),
        meta: {
          title: '媒体'
        }
      },
      {
        path: '/order',
        name: 'order',
        component: RouterView,
        meta: {
          title: '订单'
        },
        children: [
          {
            path: 'list',
            name: 'order-list',
            component: () => import('@/views/order/List.vue'),
            meta: {
              title: '订单列表'
            }
          },
          {
            path: 'offline',
            name: 'order-offline',
            component: () => import('@/views/order/Offline.vue'),
            meta: {
              title: '离线订单'
            }
          }
        ]
      },
      {
        path: 'permission',
        name: 'permission',
        component: RouterView,
        meta: {
          title: '权限'
        },
        children: [
          {
            path: 'role',
            name: 'permission-role',
            component: () => import('@/views/permission/Role.vue'),
            meta: {
              title: '角色'
            }
          },
          {
            path: 'admin',
            name: 'permission-admin',
            component: () => import('@/views/permission/Admin.vue'),
            meta: {
              title: '管理'
            }
          },
          {
            path: 'rule',
            name: 'permission-rule',
            component: () => import('@/views/permission/Rule.vue'),
            meta: {
              title: '规则'
            }
          }
        ]
      },
      {
        path: 'product',
        name: 'product',
        component: RouterView,
        meta: {
          title: '商品'
        },
        children: [
          {
            path: 'list',
            name: 'product-list',
            component: () => import('@/views/product/List.vue'),
            meta: {
              title: '列表'
            }
          },
          {
            path: 'classify',
            name: 'product-classify',
            component: () => import('@/views/product/Classify.vue'),
            meta: {
              title: '分类'
            }
          },
          {
            path: 'attr',
            name: 'product-attr',
            component: () => import('@/views/product/Attr.vue'),
            meta: {
              title: '规格'
            }
          },
          {
            path: 'reply',
            name: 'product-reply',
            component: () => import('@/views/product/Reply.vue'),
            meta: {
              title: '回复'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'login',
      noAuth: true
    },
    component: () => import('../views/login/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      title: '404',
      noAuth: true
    },
    component: () => import('../views/404.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  console.log('beforeEach', to, store.state)
  if (!to.meta.noAuth && !store.state.user) {
    return {
      path: '/login',
      query: {
        redirect: to.fullPath
      }
    }
  }
  nProgress.start()
})
router.afterEach(() => {
  nProgress.done()
})

export default router
