import request from '@/utils/request'

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

export function deleteMainTable(tableName,data) {
  return request({
    url: '/'+ tableName + '/delete',
    method: 'delete',
    data: data
  })
}
