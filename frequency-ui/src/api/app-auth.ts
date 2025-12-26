import request from '@/utils/request'
import qs from 'qs' // 必须引入 qs

// 定义表单头
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

// 客户端认证 pig:pig 的 Base64
const BASIC_AUTH = 'Basic cGlnOnBpZw=='

/**
 * 登录接口
 * @param username 用户名
 * @param password 密文 (注意：这里接收的必须已经是加密过的字符串)
 * @param code 验证码
 * @param randomStr 随机串
 */
export const login = (username: string, password: string, code: string, randomStr: string) => {
  // 构造参数
  const data = {
    username,
    password, // 这里的 password 必须是 encrypt() 后的产物
    code,
    randomStr,
    grant_type: 'password',
    scope: 'server'
  }

  return request({
    url: '/auth/oauth2/token',
    method: 'post',
    // 关键：Pig 后端要求 form-data 格式，必须序列化
    data: qs.stringify(data), 
    headers: {
      'Content-Type': FORM_CONTENT_TYPE,
      'Authorization': BASIC_AUTH,
      // 告诉拦截器跳过 Token 校验 (Pig-UI 用的是 skipToken)
      'skipToken': true 
    }
  })
}

/**
 * 获取验证码
 */
export function getCodeImg(randomStr) {
  return request({
    // 【修改点】路径修正为您提供的地址
    url: '/auth/code/image', 
    method: 'get',
    responseType: 'blob',
    params: { randomStr },
    headers: {
      'skipToken': true // 绕过token检查
    }
  })
}