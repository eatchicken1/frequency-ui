<template>
  <div class="h-full">
    
    <div class="mb-8"> 
      <h1 class="text-3xl font-serif text-freq-ink mb-2">当下</h1>
      <p class="text-freq-ink-light tracking-wide">万物皆有裂痕，那是光照进来的地方。</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      
      <div class="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow border border-stone-100 group cursor-pointer flex flex-col justify-between h-64">
        <div>
          <div class="text-xs text-freq-cyan font-bold tracking-widest mb-4 uppercase">Daily Quote</div>
          <p class="text-freq-ink text-lg font-serif leading-loose">
            “我们在同一频率呼吸，却在不同时区生活。”
          </p>
        </div>
        <div class="flex justify-between items-center text-xs text-gray-300 group-hover:text-gray-400">
          <span>Freq AI</span>
          <span>刚刚</span>
        </div>
      </div>

      <div class="bg-[#F2F0E9] rounded-3xl p-8 shadow-inner flex flex-col justify-center items-center text-center h-64">
        <div class="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 text-freq-cyan">
          🎵
        </div>
        <h3 class="font-serif text-freq-ink mb-1">正在播放</h3>
        <p class="text-xs text-freq-ink-light">Erik Satie - Gymnopédie No.1</p>
      </div>

      <div class="bg-white rounded-3xl p-8 shadow-sm border border-stone-100 h-64 flex flex-col justify-center items-center relative overflow-hidden">
        <p class="text-freq-ink-light italic relative z-10 text-center px-6 py-2 bg-white/80 backdrop-blur-sm rounded-lg">"专注模式已开启..."</p>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
// 逻辑层稍后接入
</script>