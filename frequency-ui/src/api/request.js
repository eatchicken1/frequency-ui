import axios from 'axios';
import Cookies from 'js-cookie';
import { refreshToken } from '../utils/tokenCheck';

let refreshSubscribers = [];

const onRefreshed = (token) => {
    refreshSubscribers.forEach((cb) => cb(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb) => {
    refreshSubscribers.push(cb);
};

// 创建统一的 Axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    timeout: 30000
});

// 请求拦截器
request.interceptors.request.use(config => {
    const token = Cookies.get('access_token');
    if (token && !config.headers['skipToken']) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

// 响应拦截器
request.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (refreshToken.refreshLock) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(request(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;

            try {
                // 使用tokenCheck.ts中的refreshToken函数
                // 设置forceLogoutOnFailure为false，避免在未对接后端时强制退出登录
                const response = await refreshToken({ forceLogoutOnFailure: false });
                const { access_token } = response;

                onRefreshed(access_token);

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return request(originalRequest);
            } catch (refreshError) {
                // tokenCheck.ts中已经处理了token清除和跳转
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default request;
