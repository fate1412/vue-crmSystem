import request from '@/utils/request'


export function isCustomTable(tableName) {
  const mainTables = [
    "customer",
    "invoice",
    "invoiceProduct",
    "orderProduct",
    "product",
    "salesOrder",
    "stockList",
    "stockListProduct",
    "sysUser",
    "sysRole",
    "sysFlow",
    "tableDict"
  ]
  return !mainTables.find(table => table === tableName)
}

export function getTables() {
  return request({
    url: '/custom/tables',
    method: 'get'
  })
}

export function getCustomColumns(tableName) {
  return request({
    url: '/custom/tableColumns',
    method: 'get',
    params: {
      "tableName": tableName
    }
  })
}

export function getCustomListByPage(data) {
  return request({
    url: '/custom/page/select',
    method: 'post',
    data: data
  })
}

export function getCustomTableById(tableName,id) {
  return request({
    url: '/custom/select',
    method: 'get',
    params: {
      'tableName': tableName,
      'id': id
    }
  })
}

export function addCustomTable(data) {
  return request({
    url: "/custom/add",
    method: 'put',
    data: data
  })
}

export function updateCustomTable(data) {
  return request({
    url: "/custom/update",
    method: 'post',
    data: data
  })
}

export function deleteCustomTable(tableName,id) {
  return request({
    url: '/custom/delete',
    method: 'delete',
    data: {
      tableName: tableName,
      id: id
    }
  })
}

export function getCustomOptions(params) {
  return request({
    url: '/custom/getOptions',
    method: 'get',
    params
  })
}
