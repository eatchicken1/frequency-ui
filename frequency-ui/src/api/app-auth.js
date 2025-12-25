import request from '@/utils/request'
import { encrypt } from '@/utils/encryption'

const BASIC_AUTHORIZATION = 'Basic cGlnOnBpZw=='

/**
 * 获取验证码
 * 根据您提供的 URL: /api/auth/code/image
 */
export function getCodeImg(randomStr) {
  return request({
    // 【修改点】路径修正为您提供的地址
    url: '/auth/code/image', 
    method: 'get',
    responseType: 'blob',
    params: { randomStr }
  })
}

/**
 * 登录接口
 */
export function login(username, password, code, randomStr) {
  const encryptedPassword = encrypt(password);
  return request({
    url: '/auth/oauth2/token',
    method: 'post',
    headers: {
      'Authorization': BASIC_AUTHORIZATION,
      'TENANT-ID': '1', 
      'isToken': false // @ts-ignore
    },
    params: {
      username,
      password: encryptedPassword,
      code,
      randomStr,
      grant_type: 'password',
      scope: 'server'
    }
  })
}

export function getUserInfo() {
  return request({
    url: '/admin/user/info',
    method: 'get'
  })
}