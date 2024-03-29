import request from '@/utils/request'

export function login(username , password) {
  return request({
    url: '/sysUser/login',
    method: 'post',
    data: {
      username: username,
      password: password
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/sysUser/getInfo',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
