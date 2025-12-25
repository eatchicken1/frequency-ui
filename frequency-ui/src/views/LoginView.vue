<template>
  <div class="min-h-screen w-full flex bg-white font-sans selection:bg-indigo-100 selection:text-indigo-600">
    
    <!-- ================= 左侧：视觉引力场 (60%) ================= -->
    <div class="hidden lg:flex w-3/5 bg-slate-50 relative overflow-hidden items-center justify-center">
      
      <!-- 动态背景纹理 -->
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <!-- 核心巧思：CSS 液态流体 (模拟 AI 回响) -->
      <!-- class "breathing" 是呼吸动画，"trembling" 是输入时的颤动 -->
      <div class="echo-fluid relative z-10" :class="{ 'trembling': isTyping }">
        <div class="fluid-blob bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
        <div class="fluid-blob blur-layer bg-indigo-400"></div>
      </div>

      <!-- Slogan 浮层 -->
      <div class="absolute bottom-20 left-12 z-20">
        <h2 class="text-3xl font-bold text-slate-800 tracking-tight mb-2">Let our Echoes meet first.</h2>
        <p class="text-slate-500 text-sm tracking-wide">让回响先相遇 · 全校互联 · AI 替身社交</p>
      </div>

      <!-- 装饰性代码元素 -->
      <div class="absolute top-12 right-12 font-mono text-xs text-slate-300 opacity-50 select-none">
        <div>> INITIALIZING NEURAL LINK...</div>
        <div>> SYNC_RATE: 100%</div>
        <div>> ECHO_ID: UNDEFINED</div>
      </div>
    </div>

    <!-- ================= 右侧：登录控制台 (40%) ================= -->
    <div class="w-full lg:w-2/5 bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative shadow-2xl lg:shadow-none">
      
      <div class="w-full max-w-sm space-y-8">
        
        <!-- 头部欢迎语 -->
        <div class="text-center lg:text-left">
          <div class="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
              <path fill-rule="evenodd" d="M9.315 7.584C12.195 3.883 16.695 1.5 21.75 1.5a.75.75 0 01.75.75c0 5.056-2.383 9.555-6.084 12.436h.671A3.375 3.375 0 0120.462 18.09l-.916 2.75a.75.75 0 01-1.424-.474l.916-2.75a1.875 1.875 0 00-1.775-2.466H9.75a3.75 3.75 0 01-3.75-3.75V3.75a.75.75 0 01.75-.75h.671c2.88.001 5.464 2.14 7.894 4.584zM6 19.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd" />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-slate-900">欢迎回到 Frequency</h1>
          <p class="mt-2 text-sm text-slate-500">登录以激活您的 Echo 数字分身</p>
        </div>

        <!-- 表单区域 -->
        <div class="space-y-6">
          
          <!-- 账号输入 -->
          <div class="group">
            <label for="username" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 ml-1">
              学号 / ID
            </label>
            <div class="relative">
              <input 
                id="username"
                v-model="form.username" 
                type="text" 
                @input="handleTyping"
                class="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                placeholder="请输入您的学号"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="group">
            <div class="flex items-center justify-between mb-2 ml-1">
              <label for="password" class="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                密码
              </label>
              <a href="#" class="text-xs font-medium text-indigo-600 hover:text-indigo-500">忘记密码?</a>
            </div>
            <div class="relative">
              <input 
                id="password"
                v-model="form.password" 
                type="password" 
                @input="handleTyping"
                @keyup.enter="handleLogin"
                class="block w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                placeholder="••••••••"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-400">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
            </div>
          </div>

          <!-- 登录按钮 -->
          <button 
            @click="handleLogin" 
            :disabled="loading"
            class="w-full relative overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-semibold py-4 rounded-xl shadow-lg shadow-slate-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
          >
            <span class="relative z-10 flex items-center justify-center gap-2">
              <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span v-if="!loading">登录 Frequency</span>
              <span v-else>正在同步数据...</span>
              
              <svg v-if="!loading" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 group-hover:translate-x-1 transition-transform">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </span>
            <!-- 按钮背景流光效果 -->
            <div class="absolute inset-0 -translate-x-full group-hover:translate-x-0 bg-gradient-to-r from-indigo-600 to-purple-600 transition-transform duration-500 ease-out z-0"></div>
          </button>

        </div>

        <!-- 底部版权 -->
        <div class="mt-8 text-center border-t border-slate-100 pt-6">
          <p class="text-xs text-slate-400">
            © 2025 Frequency Labs · 
            <span class="hover:text-indigo-500 cursor-pointer transition-colors">隐私协议</span> · 
            <span class="hover:text-indigo-500 cursor-pointer transition-colors">关于我们</span>
          </p>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';

const router = useRouter();
const loading = ref(false);
const isTyping = ref(false);
let typingTimer = null;

const form = reactive({
  username: '',
  password: ''
});

// 处理打字时的视觉反馈
const handleTyping = () => {
  isTyping.value = true;
  if (typingTimer) clearTimeout(typingTimer);
  typingTimer = setTimeout(() => {
    isTyping.value = false;
  }, 300); // 停止打字300ms后恢复平静
};

const handleLogin = async () => {
  if (!form.username || !form.password) return;
  loading.value = true;
  try {
    const res = await login(form.username, form.password);
    localStorage.setItem('access_token', res.data.access_token);
    router.push('/dashboard');
  } catch (error) {
    // 这里可以用更优雅的 Toast 提示
    alert('账号或密码错误');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 定义左侧流体动画 */
.echo-fluid {
  width: 400px;
  height: 400px;
  position: relative;
  /* 呼吸动画：模拟 AI 待机 */
  animation: float 8s ease-in-out infinite;
}

/* 颤动状态：模拟数据输入 */
.echo-fluid.trembling {
  animation: tremble 0.1s linear infinite;
}

.fluid-blob {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  /* 形状变换动画 */
  animation: morph 12s linear infinite alternate;
  will-change: border-radius, transform;
}

.blur-layer {
  filter: blur(40px);
  opacity: 0.6;
  z-index: -1;
  transform: scale(1.1);
}

@keyframes morph {
  0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
  33% { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  66% { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
  100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%; }
}

@keyframes float {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-20px) scale(1.05); }
}

@keyframes tremble {
  0% { transform: translate(1px, 1px); }
  25% { transform: translate(-1px, -1px); }
  50% { transform: translate(-1px, 1px); }
  75% { transform: translate(1px, -1px); }
  100% { transform: translate(1px, 1px); }
}
</style>