import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  {
    path: '/form',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: 'Form', icon: 'form' }
      }
    ]
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Index',
    hidden: true,
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },
  {
    path: '/work',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Work',
        // component: () => import('@/views/form/index'),
        meta: { title: '待办', icon: 'form' }
      }
    ]
  },
  {
    path: '/crm',
    component: Layout,
    // redirect: '/crm/MainTable/customer',
    name: 'CRM',
    meta: { title: 'CRM', icon: 'example' },
    children: [
      {
        path: 'mainTable',
        name: 'MainTable',
        redirect: '/crm/MainTable/customer',
        component: () => import('@/views/table/maintable/index'),
        meta: { title: '主表' },
        children: [
          {
            path: 'customer',
            name: 'customer',
            component: () => import('@/views/table/maintable/customer'),
            meta: { title: '客户', icon: 'table' }
          },
          {
            path: 'salesOrder',
            name: 'salesOrder',
            component: () => import('@/views/table/maintable/salesOrder'),
            meta: { title: '销售订单', icon: 'table' }
          },
          {
            path: 'orderProduct',
            name: 'orderProduct',
            component: () => import('@/views/table/maintable/orderProduct'),
            meta: { title: '订单产品', icon: 'table' }
          },
          {
            path: 'invoice',
            name: 'invoice',
            component: () => import('@/views/table/maintable/invoice'),
            meta: { title: '发货单', icon: 'table' }
          },
          {
            path: 'invoiceProduct',
            name: 'invoiceProduct',
            component: () => import('@/views/table/maintable/invoiceProduct'),
            meta: { title: '发货单产品', icon: 'table' }
          },
          {
            path: 'product',
            name: 'product',
            component: () => import('@/views/table/maintable/product'),
            meta: { title: '产品', icon: 'table' }
          },
          {
            path: 'stockList',
            name: 'stockList',
            component: () => import('@/views/table/maintable/stockList'),
            meta: { title: '备货单', icon: 'table' }
          },
          {
            path: 'stockListProduct',
            name: 'stockListProduct',
            component: () => import('@/views/table/maintable/stockListProduct'),
            meta: { title: '备货单产品', icon: 'table' }
          }
        ]
      },
      {
        path: 'customTable',
        name: 'customTable',
        component: () => import('@/views/table/index'),
        meta: { title: '定制表' },
        children: [
          {
            path: 'custom1',
            name: 'custom1',
            component: () => import('@/views/table/index?table=custom1'),
            meta: { title: '定制表1', icon: 'table' }
          },
          {
            path: 'custom2',
            name: 'custom2',
            component: () => import('@/views/table/index?table=custom2'),
            meta: { title: '定制表2', icon: 'table' }
          }
        ]
      }
    ]
  },
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  {
    path: '/setting',
    component: Layout,
    name: 'setting',
    meta: { title: '设置', icon: 'example' },
    children: [
      {
        path: '/user',
        name: 'sysUser',
        component: () => import('@/views/table/setting/sysUser'),
        meta: { title: '用户管理', icon: 'table' }
      },
      {
        path: '/role',
        name: 'sysRole',
        component: () => import('@/views/table/setting/sysRole'),
        meta: { title: '角色管理', icon: 'table' }
      },
      {
        path: '/custom',
        name: 'custom',
        // component: () => import('@/views/table/setting/index'),
        component: () => import('@/views/table/suggestion'),
        meta: { title: '定制化管理', icon: 'table' }
      },
      {
        path: '/flow',
        name: 'sysFlow',
        component: () => import('@/views/table/flow'),
        meta: { title: '流程管理', icon: 'table' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

