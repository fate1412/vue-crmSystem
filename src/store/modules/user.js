import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import qs from 'qs'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    permissionCodeList: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_PERMISSIONS: (state, permissionCodeList) => {
      state.permissionCodeList = permissionCodeList
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      // const data = { "token": "admin" }
      // setToken(data.token)
      // commit('SET_TOKEN', data.token)

      return new Promise((resolve, reject) => {
        login(userInfo.username, userInfo.password).then(response => {
          console.log(response)
          const data = response.data
          setToken(data.token)

          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      console.log("获取用户信息")
      // const data = { 'roles': 'admin', 'name': 'admin', 'avatar': 'https://baidu.com' }
      // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
      //   commit('SET_ROLES', data.roles)
      // } else {
      //   reject('getInfo: roles must be a non-null array !')
      // }
      // commit('SET_NAME', data.name)
      // commit('SET_AVATAR', data.avatar)
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const permissions = response.data
          // if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
          //   commit('SET_ROLES', data.roles)
          // } else {
          //   reject('getInfo: roles must be a non-null array !')
          // }
          if (permissions && permissions.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_PERMISSIONS', permissions)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          // commit('SET_NAME', data.name)
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_PERMISSIONS', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
