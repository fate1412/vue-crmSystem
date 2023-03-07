import request from '@/utils/request'
import ta from "element-ui/src/locale/lang/ta";

export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getMainListByPage(tableName,thisPage,pageSize) {
  return request({
    url: '/'+ tableName + '/page/select',
    method: 'get',
    params: {
      'thisPage': thisPage,
      'pageSize': pageSize
    }
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

export function deleteMainTable(tableName,id) {
  return request({
    url: '/'+ tableName + '/delete',
    method: 'delete',
    data: {
      id: id
    }
  })
}

export function getTables() {
  return request({
    url: '/custom/tables',
    method: 'get'
  })
}

export function getTableColumns(tableName) {
  return request({
    url: '/custom/tableColumns',
    method: 'get',
    params: {
      'tableName': tableName
    }
  })
}

export function getOptions(params) {
  return request({
    url: '/'+ params.tableName + '/getOptions',
    method: 'get',
    params: params
  })
}
