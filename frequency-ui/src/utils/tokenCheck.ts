// src/utils/tokenCheck.ts
import Cookies from 'js-cookie';
import axios from 'axios';
import { Session } from './storage';

// 刷新锁，防止并发刷新
export let refreshLock = false;

/**
 * 检查token是否存在且未过期
 */
export function checkTokenValidity(): boolean {
  const token = Cookies.get('access_token');
  if (!token) {
    return false;
  }
  
  // 简单检查token格式
  if (!token.includes('.')) {
    return false;
  }
  
  try {
    // 解析token payload获取过期时间
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) {
      return true; // 如果没有过期时间，认为有效
    }
    
    // 检查是否过期
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch (error) {
    console.error('Token parsing error:', error);
    return false;
  }
}

/**
 * 刷新token
 * @param options 配置项
 * @param options.forceLogoutOnFailure 是否在刷新失败时强制退出登录（默认true）
 */
export async function refreshToken(options: { forceLogoutOnFailure?: boolean } = {}) {
  const { forceLogoutOnFailure = true } = options;
  
  if (refreshLock) {
    return Promise.reject('Refresh in progress');
  }
  
  refreshLock = true;
  
  try {
    const refreshToken = Cookies.get('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }
    
    const response = await axios.post(
      `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
      { refreshToken },
      { headers: { skipToken: true } }
    );
    
    const { access_token, refresh_token: newRefreshToken } = response.data;
    
    // 存储新的token
    Cookies.set('access_token', access_token, { expires: 7 });
    if (newRefreshToken) {
      Cookies.set('refresh_token', newRefreshToken, { expires: 30 });
    }
    
    refreshLock = false;
    return { access_token, refresh_token: newRefreshToken };
  } catch (error) {
    refreshLock = false;
    
    console.error('Token refresh failed:', error);
    
    // 只在配置为true且确实是网络请求失败时才清除token和跳转
    // 如果是本地开发环境或未对接后端，可以设置为false
    if (forceLogoutOnFailure) {
      // token刷新失败，清除所有token
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('tenant_id');
      Session.clear();
      // 跳转到登录页
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
}

/**
 * 定期检查token状态
 * @param options 配置项
 * @param options.autoRefresh 是否自动刷新token（默认true）
 * @param options.onError 错误处理函数
 */
export function startTokenCheck(options: { 
  autoRefresh?: boolean;
  onError?: (error: any) => void;
} = {}) {
  const { 
    autoRefresh = true,
    onError = (error) => console.error('Token check error:', error)
  } = options;
  
  // 每分钟检查一次token
  const interval = setInterval(() => {
    const isValid = checkTokenValidity();
    
    if (!isValid && autoRefresh) {
      // token无效，尝试刷新
      // 设置forceLogoutOnFailure为false，避免在未对接后端时强制退出登录
      refreshToken({ forceLogoutOnFailure: false })
        .then(() => {
          console.log('Token refreshed successfully');
        })
        .catch(onError);
    }
  }, 60000);
  
  return interval;
}
