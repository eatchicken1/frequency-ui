import request from '@/utils/request' // 改回使用Vite代理的axios实例，解决CORS问题
import qs from 'qs' // 必须使用 qs 序列化为表单格式
import { encryption } from '@/utils/encryption' // 导入加密工具

// 1. 定义 OAuth2 要求的 Content-Type
const FORM_CONTENT_TYPE = 'application/x-www-form-urlencoded'

// 2. 使用环境变量获取 Basic Auth，动态生成 Base64 编码
const getBasicAuth = () => {
  return 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT || 'frequency:frequency_secret');
}

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

/**
 * 登录接口
 */
export const login = (username, password, code, randomStr) => {
  const grant_type = 'password'
  const scope = 'server'
  
  // 获取 Basic Auth
  const basicAuth = getBasicAuth();
  
  // 3. 构造参数对象
  let encPassword = password;
  // 密码加密
  if (import.meta.env.VITE_PWD_ENC_KEY) {
      encPassword = encryption(password, import.meta.env.VITE_PWD_ENC_KEY);
  }
  
  const data = {
    username,
    password: encPassword, // 使用加密后的密码
    code,
    randomStr,
    grant_type,
    scope
  }

  return request({
    url: '/auth/oauth2/token',
    method: 'post',
    // 4. 使用 qs.stringify 转换为表单格式
    data: qs.stringify(data), 
    headers: {
      // 5. 设置请求头
      'Content-Type': FORM_CONTENT_TYPE,
      'Authorization': basicAuth,
      'skipToken': true, // 绕过token检查
      'isToken': false   // 兼容原有配置
    }
  })
}