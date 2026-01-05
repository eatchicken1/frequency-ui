import axios from 'axios';
import Cookies from 'js-cookie';

let isRefreshing = false;
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
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(request(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = Cookies.get('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL || '/api'}/auth/refresh`,
                    { refreshToken },
                    { skipToken: true }
                );

                const { access_token, refresh_token: newRefreshToken } = response.data;

                Cookies.set('access_token', access_token, { expires: 7 });
                if (newRefreshToken) {
                    Cookies.set('refresh_token', newRefreshToken, { expires: 30 });
                }

                onRefreshed(access_token);
                isRefreshing = false;

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return request(originalRequest);
            } catch (refreshError) {
                isRefreshing = false;
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                Cookies.remove('tenant_id');
                Cookies.remove('username');
                window.location.href = '/';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default request;
