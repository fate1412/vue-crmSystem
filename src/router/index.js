import Vue from 'vue'
import Router from 'vue-router'
import { getTables } from '@/api/customTable'
import { getInfo } from '@/api/login'
import { isPermission } from '@/utils/validate'
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import ta from "element-ui/src/locale/lang/ta";

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
export let constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
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
    redirect: '/work/index',
    name: 'Index',
    hidden: true
  },
  {
    path: '/work',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Work',
        component: () => import('@/views/table/work'),
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
      }
    ]
  },
  { path: '/404', component: () => import('@/views/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]

//设置 部分路由
const sysUser = {
  path: '/user',
  name: 'sysUser',
  component: () => import('@/views/table/setting/sysUser'),
  meta: { title: '用户管理', icon: 'table' }
}

const sysRole = {
  path: '/role',
  name: 'sysRole',
  component: () => import('@/views/table/setting/sysRole'),
  meta: { title: '角色管理', icon: 'table' }
}

const custom = {
  path: '/custom',
  name: 'custom',
  component: () => import('@/views/table/setting/custom'),
  meta: { title: '定制化管理', icon: 'table' }
}

const flow = {
  path: '/flow',
  name: 'sysFlow',
  component: () => import('@/views/table/setting/flow'),
  meta: { title: '流程管理', icon: 'table' }
}


const router = new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: getRoutes()
})

export function resetRoutes() {
  let customTable = {
    path: 'customTable',
    name: 'CustomTable',
    alwaysShow: true,
    component: () => import('@/views/table/custom'),
    meta: { title: '定制表' },
    children: []
  }
  getTables().then(res => {
    const dataList = res.data
    console.log(dataList)
    let routes = []
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i]
      const route = {
        path: data.tableName,
        name: data.tableName,
        component: () => import('@/views/table/custom'),
        meta: { title: data.showName, icon: 'table' }
      }
      // CRM下的定制下
      routes.push(route)
    }
      constantRouterMap[4].children[1].children = routes
      router.addRoutes([constantRouterMap[4]])
  })
}

//通过权限组装路由
export function addSettingRoutes(user) {
  //设置
  //至少需要查看权限
  const settingRoutes = {
    path: '/setting',
    component: Layout,
    name: 'setting',
    alwaysShow: true,
    meta: { title: '设置', icon: 'setting' },
    children: []
  }
  let routes = []
  if (isPermission('SysUser_Select', user)) {
    routes.push(sysUser)
  }
  if (isPermission('SysRole_Select', user)) {
    routes.push(sysRole)
  }
  if (isPermission('TableDict_Select', user)) {
    routes.push(custom)
  }
  if (isPermission('SysFlow_Select', user)) {
    routes.push(flow)
  }
  settingRoutes.children = routes
  if (routes.length > 0) {
    constantRouterMap.push(settingRoutes)
    router.addRoutes([settingRoutes])
  }
}

export function addSetting(fuc) {
  let user = {}
  //通过获取登录信息的权限组装路由
  getInfo().then(response => {
    const data = response.data
    user.permissionCodeList = data.permissions
    addSettingRoutes(user)
    if (fuc !== undefined) {
      fuc()
    }
  })

}

//构建定制表路由
export function getRoutes(fuc) {
  let routerMap = constantRouterMap

  let customTable = {
    path: 'customTable',
    name: 'CustomTable',
    alwaysShow: true,
    component: () => import('@/views/table/custom'),
    meta: { title: '定制表' },
    children: []
  }
  getTables().then(res => {
    const dataList = res.data
    let routes = []
    for (let i = 0; i < dataList.length; i++) {
      let data = dataList[i]
      const route = {
        path: data.tableName,
        name: data.tableName,
        component: () => import('@/views/table/custom'),
        meta: { title: data.showName, icon: 'table' }
      }
      // CRM下的定制下
      routes.push(route)
    }
    if (routes.length > 0) {
      customTable.children = routes
      routerMap[4].children[1] = customTable
      router.addRoutes([routerMap[4]])
    }
    if (fuc !== undefined) {
      fuc()
    }
  })
  return constantRouterMap
}

//定义变量判断是否已经动态添加过，如果刷新后load永远为 0
let load = 0
//导航守卫
router.beforeEach((to, from, next) => {
  console.log("路由守卫")
  //如果路由不存在，则重新加载一次路由
  if (to.name === undefined && load === 0) {

    getRoutes(function () {
      addSetting(function () {
        next({ path: to.redirectedFrom })
      })
    })
    load++
  }
  next()
})

export default router

