import axios, { AxiosInstance } from 'axios';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Session } from "./storage";
import qs from 'qs';

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
	baseURL: import.meta.env.VITE_API_URL,
	timeout: 50000,
	headers: { 'Content-Type': 'application/json' },
	paramsSerializer: {
		serialize: (params) => {
			return qs.stringify(params, { arrayFormat: 'repeat' });
		},
	},
});

// 添加请求拦截器
service.interceptors.request.use(
	(config) => {
		// ========================================================================
		// [核心修复] 针对登录接口 (/oauth2/token) 自动注入 Basic Auth
		// 后端必须校验 Client ID/Secret 才能放行
		// ========================================================================
		if (config.url && config.url.indexOf('/oauth2/token') !== -1) {
			const clientId = import.meta.env.VITE_APP_CLIENT_ID || 'pig';
			const clientSecret = import.meta.env.VITE_APP_CLIENT_SECRET || 'pig';
			config.headers.Authorization = 'Basic ' + window.btoa(`${clientId}:${clientSecret}`);
		}

		// 处理统一的 Token (非登录接口)
		const token = Session.get('token');
		// 检查是否需要跳过Token处理
		const skipToken = (config.headers as any).skipToken === true;
		if (token && !config.headers.Authorization && !skipToken) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		// 处理租户ID
		const tenantId = Session.get('tenantId');
		if (tenantId) {
			config.headers['TENANT-ID'] = tenantId;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// 添加响应拦截器
service.interceptors.response.use(
	(response) => {
		const res = response.data;
		// OAuth2 接口返回可能没有 code 字段，直接返回 data
		if (res.access_token || res.code === 0 || res.code === 200) {
			return res;
		}
		
		// 处理二进制流 (下载文件)
		if (response.request.responseType === 'blob' || response.request.responseType === 'arraybuffer') {
			return response.data;
		}

		// 业务逻辑错误处理
		if (res.code && res.code !== 0) {
			const msg = res.msg || '服务器开小差了';
			ElMessage.error(msg);
			return Promise.reject(new Error(msg));
		}
		
		return res;
	},
	(error) => {
		// 处理 HTTP 状态码错误
		if (error.response) {
			const status = error.response.status;
			const data = error.response.data;
			
			if (status === 401) {
				ElMessageBox.confirm('登录状态已过期，请重新登录', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning',
				}).then(() => {
					Session.clear(); // 清除缓存
					window.location.href = '/'; // 刷新页面跳转登录
				});
			} else if (status === 424) {
				ElMessage.error('令牌状态异常，请重新登录');
			} else {
				// 优先显示后端返回的具体错误信息
				const errorMsg = data.msg || data.error_description || '请求处理失败';
				
				// 针对本次问题的特殊提示
				if(errorMsg.includes('Client信息为空')) {
					console.error('前端 .env 缺少 VITE_APP_CLIENT_ID 配置');
				}
				ElMessage.error(errorMsg);
			}
		} else {
			ElMessage.error('网络连接异常，请检查网络');
		}
		return Promise.reject(error);
	}
);

export default service;