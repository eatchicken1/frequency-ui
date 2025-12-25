import axios from 'axios'
import Cookies from 'js-cookie'
import { ElMessage } from 'element-plus'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/api', 
  timeout: 30000 
})

// ================= 请求拦截器 =================
service.interceptors.request.use(
  config => {
    // 1. 全局添加租户 ID
    // 【修复点1】使用 (config.headers as any) 绕过类型检查，否则 TS 会报错找不到 TENANT-ID
    (config.headers as any)['TENANT-ID'] = '1';

    // 2. 处理 Token 逻辑
    // 【修复点2】关键错误修复！
    // 原始报错原因：TypeScript 认为 headers 里没有 isToken 这个属性。
    // 解决办法：将 headers 断言为 any 类型，就可以随意读取自定义属性了。
    const isToken = (config.headers as any).isToken === false;
    
    const token = Cookies.get('access_token');

    if (token && !isToken) {
      config.headers['Authorization'] = 'Bearer ' + token;
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
)

// ================= 响应拦截器 =================
service.interceptors.response.use(
  response => {
    const res = response.data;
    const status = response.status;

    // 情况 A: OAuth2 接口直接返回 Token
    if (res.access_token) {
      return res;
    }

    // 情况 B: 业务接口
    if (status === 200) {
      if (res.code === 1) {
         ElMessage.error(res.msg || '操作失败');
         return Promise.reject(new Error(res.msg || 'Error'));
      }
      return res;
    }
    
    return res;
  },
  error => {
    console.error('Request Error:', error);
    
    let msg = '服务器连接异常';
    if (error.response && error.response.data) {
       const errData = error.response.data;
       if (errData.error_description) {
         msg = errData.error_description;
       } else if (errData.msg) {
         msg = errData.msg;
       } else if (errData.error) {
         msg = errData.error;
       }
    }
    
    // 错误信息汉化优化
    if (msg.includes('Bad credentials')) {
      msg = '账号或密码错误';
    } else if (msg.includes('User is disabled')) {
      msg = '账号已被禁用';
    } else if (msg.includes('User account is locked')) {
      msg = '账号已被锁定';
    } else if (msg.includes('Cannot convert access token to JSON')) {
      msg = '登录状态已过期，请重新登录';
    }

    ElMessage.error(msg);
    return Promise.reject(error);
  }
)

export default service;