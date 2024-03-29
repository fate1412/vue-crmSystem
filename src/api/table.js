import request from '@/utils/request'
import ta from "element-ui/src/locale/lang/ta";

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getMainListByPage(tableName,data) {
  return request({
    url: '/'+ tableName + '/page/select',
    method: 'post',
    data: data
  })
}

export function getColumns(tableName) {
  return request({
    url: '/'+ tableName + '/getColumns',
    method: 'get'
  })
}

export function getMainTableById(tableName,id) {
  return request({
    url: '/'+ tableName + '/select',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function addMainTable(tableName,data) {
  return request({
    url: '/'+ tableName + '/add',
    method: 'put',
    data
  })
}

export function updateMainTable(tableName,data) {
  return request({
    url: '/'+ tableName + '/update',
    method: 'post',
    data
  })
}

export function deleteMainTable(tableName,data) {
  return request({
    url: '/'+ tableName + '/delete',
    method: 'delete',
    data: data
  })
}

export function getOptions(params) {
  return request({
    url: '/'+ params.tableName + '/getOptions',
    method: 'get',
    params: params
  })
}

export function getRoles(id) {
  return request({
    url: '/sysUser/getRoles',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function updateRoles(id,userRolesList) {
  return request({
    url: '/sysUser/updateRoles',
    method: 'post',
    data: {
      'id': id,
      'userRolesList': userRolesList
    }
  })
}

export function getPermissions(id) {
  return request({
    url: '/sysRole/getPermissions',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function updatePermissions(id,RolePermissionsList) {
  return request({
    url: '/sysRole/updatePermissions',
    method: 'post',
    data: {
      'id': id,
      'RolePermissionsList': RolePermissionsList
    }
  })
}

export function getPermissionsOptions(params) {
  return request({
    url: '/sysRole/getPermissionsOptions',
    method: 'get',
    params: params
  })
}

export function resetPasswd(userId,passwd) {
  return request({
    url: '/sysUser/resetPasswd',
    method: 'post',
    data: {
      userId: userId,
      password: passwd
    }
  })
}

export function getFlowPoints(id) {
  return request({
    url: '/sysFlow/getFlowPoints',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function updateFlowPoints(data) {
  return request({
    url: '/sysFlow/updateFlowPoints',
    method: 'post',
    data: data
  })
}

export function approve(data) {
  return request({
    url: '/sysFlowSession/approve',
    method: 'post',
    data: data
  })
}

export function invoice(id) {
  return request({
    url: '/invoice/invoice',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function stockUp(id) {
  return request({
    url: '/stockList/stockUp',
    method: 'get',
    params: {
      'id': id
    }
  })
}

export function userLock(id) {
  return request({
    url: '/sysUser/lock',
    method: 'get',
    params: {
      'id': id
    }
  })
}


