import axios from 'axios';

// 创建统一的 Axios 实例
const request = axios.create({
    baseURL: '/api', // 基础URL
    timeout: 30000 // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(config => {
    // 从本地存储获取 token
    const token = localStorage.getItem('access_token');
    // 如果 token 存在且没有设置 skipToken，添加到请求头
    if (token && !config.headers['skipToken']) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    // 处理请求错误
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(response => {
    // 直接返回响应数据
    return response;
}, error => {
    // 处理响应错误
    console.error('API 请求错误:', error);
    // 可以在这里添加统一的错误处理逻辑
    // 比如 token 过期时跳转到登录页
    if (error.response && error.response.status === 401) {
        // 清除本地存储的 token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('username');
        // 跳转到登录页
        window.location.href = '/';
    }
    return Promise.reject(error);
});

export default request;
