<template>
  <div class="min-h-screen flex overflow-hidden">
    <!-- 左侧渐变区域 -->
    <div class="hidden md:flex md:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
      <!-- 动态波形效果 -->
      <div class="absolute inset-0 overflow-hidden opacity-20">
        <div class="absolute top-0 left-0 right-0 h-full flex items-center justify-center">
          <svg viewBox="0 0 1200 800" class="w-full h-full" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.3" />
                <stop offset="50%" style="stop-color:#ffffff;stop-opacity:0.1" />
                <stop offset="100%" style="stop-color:#ffffff;stop-opacity:0.3" />
              </linearGradient>
            </defs>
            <!-- 主波形 -->
            <path d="M0,400 C300,300 300,500 600,400 C900,300 900,500 1200,400 L1200,800 L0,800 Z" fill="url(#waveGradient)" />
            <!-- 高频波形装饰 -->
            <path d="M0,350 Q100,380 200,350 T400,350 T600,350 T800,350 T1000,350 T1200,350 L1200,355 L0,355 Z" fill="white" opacity="0.4" />
            <path d="M0,450 Q100,480 200,450 T400,450 T600,450 T800,450 T1000,450 T1200,450 L1200,455 L0,455 Z" fill="white" opacity="0.4" />
          </svg>
        </div>
      </div>
      
      <!-- 左侧品牌内容 -->
      <div class="relative z-10 flex flex-col justify-center items-center p-12 text-white text-center">
        <div class="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-8 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-12 h-12 animate-pulse">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9l-1.5-1.5m0 0L12 10.5m3.75 3.75L12 18m-3.75-3.75l1.5-1.5m0 0L12 13.5M9.75 9.75l1.5-1.5M14.25 14.25l1.5-1.5M9.75 14.25l1.5 1.5M14.25 9.75l1.5 1.5" />
          </svg>
        </div>
        
        <h1 class="text-6xl font-extrabold mb-4 tracking-tight">FREQUENCY</h1>
        <h2 class="text-4xl font-semibold mb-6 text-white/90">同频</h2>
        <p class="text-2xl mb-8 max-w-md text-white/90">AI 高校社交引力场</p>
        <p class="text-lg max-w-md text-white/80 leading-relaxed">在这里，找到属于你的高校同频者，开启全新的社交体验</p>
        
        <!-- 装饰性频率线 -->
        <div class="mt-12 flex space-x-2">
          <div class="w-8 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 0ms;"></div>
          <div class="w-8 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 100ms;"></div>
          <div class="w-12 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 200ms;"></div>
          <div class="w-8 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 300ms;"></div>
          <div class="w-8 h-1 bg-white rounded-full animate-pulse" style="animation-delay: 400ms;"></div>
        </div>
      </div>
    </div>
    
    <!-- 右侧登录表单区域 -->
    <div class="w-full md:w-1/2 flex items-center justify-center p-8 bg-gray-50">
      <div class="w-full max-w-md">
        <!-- 移动端Logo -->
        <div class="md:hidden flex items-center justify-center mb-10">
          <div class="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-8 h-8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v18m9-9l-1.5-1.5m0 0L12 10.5m3.75 3.75L12 18m-3.75-3.75l1.5-1.5m0 0L12 13.5M9.75 9.75l1.5-1.5M14.25 14.25l1.5-1.5M9.75 14.25l1.5 1.5M14.25 9.75l1.5 1.5" />
            </svg>
          </div>
          <h1 class="ml-3 text-3xl font-bold text-gray-900">FREQUENCY</h1>
        </div>
        
        <!-- 表单容器 -->
        <div class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300">
          <div class="p-10">
            <div class="text-center mb-10">
              <h3 class="text-3xl font-bold text-gray-900 mb-2">{{ isRegisterMode ? '创建账号' : '登录' }}</h3>
              <p class="text-sm text-gray-500">{{ isRegisterMode ? '加入 Frequency，开始同频社交' : '欢迎回来，请登录您的账号' }}</p>
            </div>
            
            <form class="space-y-6">
              <!-- 用户名输入框 -->
              <div class="relative group">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                </div>
                <input 
                  v-model="form.username" 
                  type="text" 
                  class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-sm"
                  placeholder="学号 / 用户名"
                />
              </div>
              
              <!-- 注册模式下显示邮箱输入 -->
              <div v-if="isRegisterMode" class="relative group">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                  </svg>
                </div>
                <input 
                  v-model="form.email" 
                  type="email" 
                  class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-sm"
                  placeholder="邮箱"
                />
              </div>
              
              <!-- 密码输入框 -->
              <div class="relative group">
                <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
                  </svg>
                </div>
                <input 
                  v-model="form.password" 
                  type="password" 
                  class="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-900 placeholder-gray-400 hover:border-gray-300 hover:shadow-sm"
                  placeholder="密码"
                />
              </div>
              
              <!-- 提交按钮 -->
              <button 
                @click.prevent="isRegisterMode ? handleRegister : handleLogin" 
                :disabled="loading"
                class="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-3 rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
              >
                <span v-if="!loading">{{ isRegisterMode ? '完成注册' : '进入同频引力场' }}</span>
                <span v-else>正在处理...</span>
              </button>
            </form>
            
            <!-- 切换登录/注册模式 -->
            <div class="mt-8 text-center">
              <button 
                @click="toggleMode" 
                class="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300"
              >
                {{ isRegisterMode ? '已有账号？点击登录' : '没有账号？点击注册' }}
              </button>
            </div>
          </div>
        </div>
        
        <div class="mt-10 text-center">
          <p class="text-xs text-gray-400">© 2025 Frequency. 连接每一个同频的你</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login, register } from '../api/auth';

const router = useRouter();
const loading = ref(false);
const isRegisterMode = ref(false);

const form = reactive({
  username: '',
  password: '',
  email: ''
});

const handleLogin = async () => {
  if (!form.username || !form.password) return;
  loading.value = true;
  try {
    const res = await login(form.username, form.password);
    localStorage.setItem('access_token', res.data.access_token);
    router.push('/dashboard');
  } catch (error) {
    alert('账号或密码错误');
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  if (!form.username || !form.password || !form.email) return;
  loading.value = true;
  try {
    await register(form.username, form.password, form.email);
    alert('注册成功，请登录');
    isRegisterMode.value = false;
    form.username = '';
    form.password = '';
    form.email = '';
  } catch (error) {
    alert('注册失败，请重试');
  } finally {
    loading.value = false;
  }
};

const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value;
};
</script>

<style scoped>
/* 确保背景色在所有设备上正确显示 */
body {
  background-color: #f9fafb !important;
}

/* 动画效果增强 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>