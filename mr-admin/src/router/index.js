import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/carousel',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Carousel',
      component: () => import('@/views/carousel/index'),
      meta: { title: '首页轮播图管理', icon: 'el-icon-picture-outline' }
    }]
  },

  {
    path: '/product',
    component: Layout,
    children: [{
      path: 'index',
      name: 'Product',
      component: () => import('@/views/product/index'),
      meta: { title: '商品管理', icon: 'el-icon-s-shop' }
    }, {
      path: 'productDetail/:id',
      name: 'ProductDetail',
      hidden: true,
      component: () => import('@/views/product/productDetail'),
      meta: { title: '商品详情编辑', icon: 'el-icon-s-shop', props: true }
    }]
  },

  {
    path: '/user',
    component: Layout,
    children: [{
      path: 'index',
      name: 'user',
      component: () => import('@/views/user/index'),
      meta: { title: '用户管理', icon: 'el-icon-user' }
    }]
  },

  {
    path: '/order',
    component: Layout,
    children: [{
      path: 'index',
      name: 'order',
      component: () => import('@/views/order/index'),
      meta: { title: '订单管理', icon: 'el-icon-tickets' }
    }]
  },

  {
    path: '/category',
    component: Layout,
    children: [{
      path: 'index',
      name: 'category',
      component: () => import('@/views/category/index'),
      meta: { title: '商品分类管理', icon: 'el-icon-s-grid' }
    }]
  },

  {
    path: '/system',
    component: Layout,
    redirect: '/system/menu2',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'el-icon-setting'
    },
    children: [
      {
        path: 'admin',
        component: () => import('@/views/system/admin/index'),
        name: 'Admin',
        meta: { title: '管理员管理', icon: 'el-icon-s-custom' }
      },
      {
        path: 'role',
        component: () => import('@/views/system/role/index'),
        name: 'Role',
        meta: { title: '角色管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'menu',
        component: () => import('@/views/system/menu/index'),
        name: 'Menu',
        meta: { title: '菜单管理', icon: 'el-icon-menu' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter () {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
