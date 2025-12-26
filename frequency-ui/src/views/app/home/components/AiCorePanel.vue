<template>
  <div class="flex flex-col h-full bg-white rounded-[24px] border border-[#e4e4e7] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.01)] overflow-hidden relative isolation-auto">
    
    <section class="relative flex-shrink-0 pt-8 pb-6 px-8 flex flex-col items-center justify-center bg-gradient-to-b from-gray-50/50 to-white z-10">
      
      <div class="relative w-32 h-32 mb-6 group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
        <div class="absolute inset-0 bg-[#3b82f6]/10 rounded-full animate-pulse-slow"></div>
        <div class="absolute inset-2 bg-[#3b82f6]/20 rounded-full blur-md"></div>
        
        <div class="relative w-full h-full bg-white rounded-full border-[3px] border-white shadow-lg flex items-center justify-center overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/bottts/svg?seed=Frequency" 
            alt="AI Echo" 
            class="w-24 h-24 object-cover"
          />
        </div>
        
        <div class="absolute bottom-1 right-1 w-6 h-6 bg-green-400 border-[3px] border-white rounded-full z-20" title="Online"></div>
      </div>

      <div class="text-center space-y-2">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Echo · 零号机</h2>
        <div class="flex items-center gap-2 justify-center">
          <span class="px-3 py-1 bg-[#3b82f6]/10 text-[#3b82f6] text-xs font-semibold rounded-full">Lv.3 共鸣者</span>
          <span class="px-3 py-1 bg-gray-50 text-gray-500 text-xs font-semibold rounded-full">Sync: 85%</span>
        </div>
      </div>
    </section>

    <div class="flex-1 flex flex-col min-h-0 bg-white">
      <div class="flex px-8 border-b border-gray-100 gap-8">
        <button 
          v-for="tab in tabs" 
          :key="tab.key"
          @click="currentTab = tab.key"
          class="relative py-4 text-sm font-bold transition-colors duration-200 outline-none focus:outline-none"
          :class="[
            currentTab === tab.key ? 'text-[#3b82f6]' : 'text-gray-400 hover:text-gray-600'
          ]"
        >
          {{ tab.label }}
          <span 
            v-if="currentTab === tab.key" 
            class="absolute bottom-0 left-0 w-full h-[2px] bg-[#3b82f6] rounded-t-full"
          ></span>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
        
        <div v-if="currentTab === 'feeding'" class="space-y-8 animate-fade-in">
          
          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider opacity-80">
              Memory Injection // 记忆注入
            </h3>
            
            <div 
                class="group relative border-1 border-dashed border-[#e4e4e7] rounded-[24px] p-8 text-center transition-all duration-300 hover:border-[#3b82f6] hover:bg-[#3b82f6]/5 cursor-pointer"
              >
              <div class="flex flex-col items-center gap-4 group-hover:-translate-y-1 transition-transform duration-300">
                <div class="w-12 h-12 bg-[#3b82f6]/10 text-[#3b82f6] rounded-full flex items-center justify-center">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div class="text-sm text-gray-500">
                  <span class="text-[#3b82f6] font-semibold">点击上传</span> 或拖拽文件至此
                  <p class="text-xs text-gray-400 mt-2">支持 PDF, TXT, MD (Max 10MB)</p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider opacity-80">
              Quick Feed // 快速投喂
            </h3>
            <div class="flex gap-4">
              <input 
                type="text" 
                placeholder="告诉 Echo 你今天的一个想法..." 
                class="flex-1 h-[44px] bg-white border border-[#e4e4e7] rounded-[20px] px-6 text-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 focus:border-[#3b82f6]/50 focus:shadow-[0_2px_8px_rgba(0,0,0,0.05)]"
              />
              <button class="h-[44px] px-8 bg-gray-900 text-white text-sm font-bold rounded-[20px] shadow-sm transition-all duration-300 hover:bg-black hover:shadow-[0_12px_24px_-8px_rgba(0,0,0,0.08)] hover:-translate-y-[4px] active:translate-y-0 disabled:opacity-50">
                发送
              </button>
            </div>
          </div>

        </div>

        <div v-else-if="currentTab === 'personality'" class="space-y-8 animate-fade-in">
          
          <div class="space-y-6">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider opacity-80">
              Soul Equalizer // 灵魂均衡器
            </h3>
            
            <div class="space-y-6">
              <div class="space-y-3">
                <div class="flex justify-between text-xs font-semibold text-gray-500">
                  <span>理性 (Rational)</span>
                  <span>感性 (Emotional)</span>
                </div>
                <input 
                  type="range" 
                  class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3b82f6] hover:accent-[#3b82f6]"
                  min="0" max="100"
                />
              </div>

              <div class="space-y-3">
                <div class="flex justify-between text-xs font-semibold text-gray-500">
                  <span>内向 (Introvert)</span>
                  <span>外向 (Extrovert)</span>
                </div>
                <input 
                  type="range" 
                  class="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 hover:accent-indigo-500"
                  min="0" max="100" 
                />
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-sm font-bold text-gray-900 uppercase tracking-wider opacity-80">
              Traits // 特质标签
            </h3>
            <div class="flex flex-wrap gap-3">
              <button 
                v-for="tag in personalityTags" 
                :key="tag"
                class="h-[36px] px-5 rounded-full text-sm font-medium border transition-all duration-300 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
                :class="activeTags.includes(tag) 
                  ? 'bg-[#3b82f6] border-[#3b82f6] text-white shadow-[0_4px_12px_rgba(0,0,0,0.1)]' 
                  : 'bg-white border-[#e4e4e7] text-gray-600 hover:border-[#3b82f6]/50 hover:text-[#3b82f6]'"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>

    <footer class="flex-shrink-0 px-16 py-4 border-t border-gray-50 bg-white z-20 flex justify-between items-center text-xs text-gray-400">
      <div class="flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
        <span>Engine Active</span>
      </div>
      <div>
        Token Usage: 1,204 / 5,000
      </div>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// --- Types & Data ---
type TabKey = 'feeding' | 'personality' | 'abilities'

interface TabItem {
  key: TabKey
  label: string
}

const tabs: TabItem[] = [
  { key: 'feeding', label: '投喂养成' },
  { key: 'personality', label: '性格调优' },
  { key: 'abilities', label: '能力扩展' }
]

const currentTab = ref<TabKey>('feeding')

const personalityTags = ['幽默', '毒舌', '治愈', '严谨', '中二', '哲学', '粘人']
const activeTags = ref(['幽默', '治愈'])

// --- Logic ---
const toggleTag = (tag: string) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag)
  } else {
    activeTags.value.push(tag)
  }
}
</script>

<style scoped>
/* 自定义滚动条，保持视觉克制 
*/
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #f1f5f9;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #cbd5e1;
}

/* 简单的淡入动画 
*/
.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 慢速呼吸效果 
*/
.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.1;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}
</style>