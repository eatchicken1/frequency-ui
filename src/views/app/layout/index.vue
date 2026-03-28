<template>
  <div class="layout-shell">
    <header v-if="showBackButton" class="layout-topbar">
      <div class="layout-topbar-inner">
        <button class="back-btn" type="button" @click="goBackHome">
          <span class="back-icon">←</span>
          <span>返回主页</span>
        </button>
        <span class="back-tip">Home</span>
      </div>
    </header>

    <main class="layout-content" :class="{ 'with-topbar': showBackButton }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts" name="layout">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const showBackButton = computed(() => route.path !== '/app/home')

const goBackHome = () => {
  router.push('/app/home')
}
</script>

<style scoped>
.layout-shell {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f2f4f6;
  overflow: hidden;
}

.layout-topbar {
  flex-shrink: 0;
  height: 56px;
  border-bottom: 1px solid rgba(222, 229, 237, 0.9);
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(10px);
}

.layout-topbar-inner {
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.layout-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.back-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.96);
  background: #ffffff;
  color: #0f172a;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  box-shadow: 0 10px 22px -18px rgba(15, 23, 42, 0.42);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.back-btn:hover {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.96);
}

.back-icon {
  font-size: 13px;
}

.back-tip {
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

@media (max-width: 980px) {
  .layout-topbar {
    height: 52px;
  }

  .layout-topbar-inner {
    padding: 0 10px;
  }

  .back-btn {
    height: 32px;
    padding: 0 12px;
  }

  .back-tip {
    font-size: 10px;
  }
}
</style>
