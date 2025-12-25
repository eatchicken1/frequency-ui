<template>
  <div class="min-h-screen bg-freq-bg text-freq-ink font-sans selection:bg-freq-cyan/20">
    
    <header class="fixed top-0 left-0 w-full h-16 bg-white backdrop-blur-md z-40 flex items-center justify-between px-6 sm:px-12 border-b border-stone-200/30 shadow-md">
       <div class="font-serif text-lg tracking-widest font-bold">Frequency</div>
       <div class="hidden md:block text-xs text-freq-ink-light">寻找你的同类</div>
    </header>

    <main class="w-full min-h-screen pb-24 px-4 sm:px-6 lg:px-8">
      <div class="w-full h-[100px] flex-shrink-0"></div>
      <div class="max-w-5xl mx-auto h-full relative z-0">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>

    <nav class="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div class="bg-white/90 backdrop-blur-xl shadow-2xl border border-white/50 rounded-full px-8 py-3 flex items-center gap-10 sm:gap-16 transition-all hover:scale-105 duration-300">
        
        <router-link to="/app/home" class="group flex flex-col items-center gap-1" active-class="text-freq-ink" exact-active-class="text-freq-ink">
          <div class="text-2xl text-gray-400 group-hover:text-freq-cyan transition-colors" :class="{ '!text-freq-ink': $route.path.includes('home') }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
              <path d="M8 16H3v5" />
            </svg>
          </div>
        </router-link>

        <router-link to="/app/resonance">
           <div class="w-12 h-12 -mt-8 rounded-full bg-freq-cyan text-white flex items-center justify-center shadow-lg shadow-freq-cyan/40 hover:bg-freq-cyan/90 transition-transform active:scale-95 ring-4 ring-freq-bg">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2z" />
             </svg>
           </div>
        </router-link>

        <router-link to="/app/me" class="group flex flex-col items-center gap-1" active-class="text-freq-ink">
          <div class="text-2xl text-gray-400 group-hover:text-freq-cyan transition-colors" :class="{ '!text-freq-ink': $route.path.includes('me') }">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="8" r="4" />
              <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
            </svg>
          </div>
        </router-link>

      </div>
    </nav>

  </div>
</template>

<style scoped>
/* 优雅的淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>