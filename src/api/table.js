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

export function getMainTableById(tableName,id) {
  return request({
    url: '/'+ tableName + '/select',
    method: 'get',
    params: {
      'id': id
    }
  })
}