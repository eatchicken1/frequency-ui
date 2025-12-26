import request from './request';
import { encryption } from '@/utils/encryption'; // 导入加密工具

// 注册方法
export const register = async (username, password, email) => {
    // 模拟注册 - 用于测试，实际环境请删除
    if (import.meta.env.DEV) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { message: '注册成功' } });
            }, 500);
        });
    }
    
    // 真实注册逻辑
    return request.post('/auth/register', {
        username,
        password,
        email
    });
};

// 登录方法
export const login = async (username, password) => {
    // 模拟登录 - 用于测试，实际环境请删除
    if (import.meta.env.DEV) {
        // 任何用户名密码都可以登录
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        access_token: 'mock_access_token',
                        refresh_token: 'mock_refresh_token'
                    }
                });
            }, 500);
        });
    }
    
    // 获取 Basic Auth 头
    const basicAuth = 'Basic ' + window.btoa(import.meta.env.VITE_OAUTH2_PASSWORD_CLIENT || 'frequency:frequency_secret');
    
    // 密码加密
    let encPassword = password;
    if (import.meta.env.VITE_PWD_ENC_KEY) {
        encPassword = encryption(password, import.meta.env.VITE_PWD_ENC_KEY);
    }
    
    // 真实登录逻辑
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', encPassword);
    params.append('grant_type', 'password');
    params.append('scope', 'server');
    // 如果有验证码，还需要 code 和 randomStr

    return request.post('/auth/oauth2/token', params, {
        headers: {
            'Authorization': basicAuth,
            'Content-Type': 'application/x-www-form-urlencoded',
            'skipToken': true
        }
    });
};