<template>
  <div class="min-h-screen flex flex-col md:flex-row bg-gray-50 text-slate-700">
    
    <!-- ================= 左侧：伴侣对话区 (25%) ================= -->
    <aside class="w-full md:w-1/4 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div class="p-4 border-b border-gray-100">
        <h2 class="font-bold text-lg flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          我的 Echo
        </h2>
        <p class="text-xs text-gray-400 mt-1">正在同步思维...</p>
      </div>

      <!-- 聊天记录 -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        <div v-for="(msg, index) in chatHistory" :key="index" 
             class="flex gap-3" 
             :class="msg.role === 'user' ? 'flex-row-reverse' : ''">
          <!-- 头像 -->
          <div class="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden bg-gray-200">
             <img :src="msg.role === 'user' ? 'https://api.dicebear.com/7.x/avataaars/svg?seed=User' : aiAvatarUrl" />
          </div>
          <!-- 气泡 -->
          <div class="max-w-[80%] p-3 rounded-2xl text-sm shadow-sm"
               :class="msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-700 border border-gray-200 rounded-tl-none'">
            {{ msg.content }}
          </div>
        </div>
      </div>

      <!-- 输入框 -->
      <div class="p-4 bg-white border-t border-gray-200">
        <div class="relative">
          <input 
            v-model="inputMsg" 
            @keyup.enter="handleSend"
            type="text" 
            placeholder="和你的分身聊聊..." 
            class="w-full pl-4 pr-10 py-3 rounded-xl bg-gray-100 border-none focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
          />
          <button @click="handleSend" class="absolute right-2 top-2 p-1 text-blue-600 hover:bg-blue-50 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </div>
    </aside>

    <!-- ================= 中间：AI 养成中心 (50%) ================= -->
    <main class="w-full md:w-2/4 flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <!-- 背景装饰 -->
      <div class="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div class="absolute top-10 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div class="absolute top-10 right-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div class="absolute -bottom-8 left-20 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div class="z-10 w-full max-w-md flex flex-col items-center">
        <!-- AI 形象展示 (可点击编辑) -->
        <div class="relative group cursor-pointer mb-8">
          <div class="w-64 h-64 bg-white rounded-full shadow-2xl flex items-center justify-center border-4 border-white overflow-hidden transition-transform transform group-hover:scale-105">
            <img :src="aiAvatarUrl" class="w-full h-full object-cover" />
          </div>
          <div class="absolute bottom-0 right-4 bg-white p-2 rounded-full shadow-lg border border-gray-100 text-gray-500 hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
            </svg>
          </div>
        </div>

        <!-- AI 基础信息 -->
        <div class="text-center mb-8">
          <h1 class="text-3xl font-black text-slate-800 mb-2">{{ profile.nickname || '未命名分身' }}</h1>
          <div class="flex gap-2 justify-center">
            <span class="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">{{ profile.mbti || 'MBTI' }}</span>
            <span class="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">{{ profile.voiceTone || '风格' }}</span>
            <span class="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs cursor-pointer hover:bg-gray-200">+ 添加标签</span>
          </div>
        </div>

        <!-- 养成控制台 -->
        <div class="w-full bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-semibold text-gray-500">知识库同步率</span>
            <span class="text-sm font-bold text-blue-600">42%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div class="bg-blue-600 h-2.5 rounded-full" style="width: 42%"></div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <button @click="handleUpload" class="flex flex-col items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group border border-blue-100">
              <div class="bg-blue-500 text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                </svg>
              </div>
              <span class="text-sm font-bold text-slate-700">投喂知识</span>
              <span class="text-xs text-slate-400 mt-1">PDF / 文档</span>
            </button>

            <button class="flex flex-col items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group border border-purple-100">
              <div class="bg-purple-500 text-white p-2 rounded-lg mb-2 group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
                </svg>
              </div>
              <span class="text-sm font-bold text-slate-700">修改人设</span>
              <span class="text-xs text-slate-400 mt-1">Prompt 调优</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- ================= 右侧：世界功能入口 (25%) ================= -->
    <aside class="w-full md:w-1/4 bg-white border-l border-gray-200 h-screen flex flex-col p-6">
      <h2 class="font-bold text-xl text-slate-800 mb-6">探索频率</h2>
      
      <div class="space-y-4">
        <!-- 功能卡片 1: AI 相亲 -->
        <div @click="goToRadar" class="group cursor-pointer p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all">
          <div class="flex justify-between items-start mb-2">
            <span class="bg-white/20 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </span>
            <span class="text-xs bg-white/20 px-2 py-1 rounded">HOT</span>
          </div>
          <h3 class="font-bold text-lg">AI 替身相亲</h3>
          <p class="text-xs text-white/80 mt-1">同频测试 & 灵魂匹配</p>
        </div>

        <!-- 功能卡片 2: 校园广场 -->
        <div class="group cursor-pointer p-4 rounded-2xl bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
           <div class="flex items-center gap-3 mb-2">
             <div class="bg-blue-100 text-blue-600 p-2 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
               </svg>
             </div>
             <h3 class="font-bold text-gray-700">全校 Echo 广场</h3>
           </div>
           <p class="text-xs text-gray-400 pl-1">看看隔壁学校的 AI 都在聊什么</p>
        </div>

        <!-- 功能卡片 3: 知识黑市 -->
        <div class="group cursor-pointer p-4 rounded-2xl bg-white border border-gray-200 hover:border-amber-300 hover:shadow-md transition-all">
           <div class="flex items-center gap-3 mb-2">
             <div class="bg-amber-100 text-amber-600 p-2 rounded-lg">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                 <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
               </svg>
             </div>
             <h3 class="font-bold text-gray-700">知识黑市</h3>
           </div>
           <p class="text-xs text-gray-400 pl-1">考研资料 / 绝版笔记 / 积分交易</p>
        </div>
      </div>

      <!-- 底部新闻Ticker -->
      <div class="mt-auto bg-gray-50 p-4 rounded-xl">
        <h4 class="text-xs font-bold text-gray-400 mb-2">CAMPUS NEWS</h4>
        <div class="text-xs text-gray-600 truncate">
          🔥 北大 AI 和清华 AI 昨晚又吵架了...
        </div>
      </div>
    </aside>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getMyProfile } from '../api/business';

const router = useRouter();

// 模拟数据状态
const profile = ref({
  nickname: '加载中...',
  mbti: '',
  voiceTone: '',
  echoId: null
});

// 使用 DiceBear 生成一个机器人风格的头像，基于昵称生成，保证每个人不一样
const aiAvatarUrl = computed(() => {
  const seed = profile.value.nickname || 'default';
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}&backgroundColor=transparent`;
});

const inputMsg = ref('');
const chatHistory = ref([
  { role: 'ai', content: '主人你好，我是你的数字分身。我已经准备好学习新知识了。' }
]);

onMounted(async () => {
  try {
    const res = await getMyProfile();
    if (res.data.data) {
      profile.value = res.data.data;
    }
  } catch (e) {
    console.error("获取个人信息失败", e);
    profile.value.nickname = "Guest";
  }
});

const handleSend = () => {
  if (!inputMsg.value) return;
  
  // 1. 用户发消息
  chatHistory.value.push({ role: 'user', content: inputMsg.value });
  const userText = inputMsg.value;
  inputMsg.value = '';

  // 2. 模拟 AI 回复 (后续接真实 API)
  setTimeout(() => {
    chatHistory.value.push({ 
      role: 'ai', 
      content: `我记住了"${userText}"。这会影响我在相亲时的表现吗？` 
    });
  }, 1000);
};

const handleUpload = () => {
  alert('上传功能开发中：将连接 RAG 接口');
};

const goToRadar = () => {
  // 这里我们之后做一个专门的雷达页，或者直接弹窗
  alert('正在启动全网扫描...');
  // router.push('/radar');
};
</script>

<style scoped>
/* 增加一些微动画 */
@keyframes blob {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
.animate-blob {
  animation: blob 7s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}
</style>