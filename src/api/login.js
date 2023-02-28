import request from '@/utils/request'

export function login(loginInfo) {
  return request({
    url: '/user/login',
    method: 'post',
    data: loginInfo,
    headers:{
      'Content-Type':'application/x-www-form-urlencoded'
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
