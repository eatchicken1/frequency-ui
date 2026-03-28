<template>
  <div class="layout-shell" :class="{ 'home-mode': isHomePage }">
    <div v-if="showBackButton" class="layout-ambient layout-ambient-a"></div>
    <div v-if="showBackButton" class="layout-ambient layout-ambient-b"></div>
    <header v-if="showBackButton" class="layout-topbar">
      <div class="layout-topbar-inner">
        <button class="brand-anchor" type="button" @click="goBackHome">
          <span class="brand-mark">〰</span>
          <span class="brand-copy">
            <span class="brand-title">FREQUENCY</span>
            <span class="brand-subtitle">Workspace</span>
          </span>
        </button>

        <div class="topbar-center">
          <span class="view-kicker">ACTIVE VIEW</span>
          <strong>{{ pageTitle }}</strong>
        </div>

        <div class="topbar-actions">
          <nav class="page-nav" aria-label="应用导航">
            <button
              v-for="item in navItems"
              :key="item.path"
              class="nav-pill"
              type="button"
              :class="{ active: item.path === route.path }"
              @click="goToPage(item.path)"
            >
              {{ item.label }}
            </button>
          </nav>

          <button class="back-btn" type="button" @click="goBackHome">
            <span class="back-icon">←</span>
            <span>返回主页</span>
          </button>
        </div>
      </div>
    </header>

    <main ref="layoutContentRef" class="layout-content" :class="{ 'route-scroll': showBackButton }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts" name="layout">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const layoutContentRef = ref<HTMLElement | null>(null)

const navItems = [
  { path: '/app/home', label: '当下' },
  { path: '/app/resonance', label: '共鸣' },
  { path: '/app/music', label: '听歌' },
  { path: '/app/me', label: '本我' }
]

const isHomePage = computed(() => route.path === '/app/home')
const showBackButton = computed(() => !isHomePage.value)
const pageTitle = computed(() => String(route.meta?.title || 'Frequency'))

const goBackHome = () => {
  router.push('/app/home')
}

const goToPage = (path: string) => {
  if (path !== route.path) {
    router.push(path)
  }
}

watch(
  () => route.path,
  async () => {
    await nextTick()
    if (showBackButton.value) {
      layoutContentRef.value?.scrollTo({ top: 0, behavior: 'auto' })
    }
  },
  { immediate: true }
)
</script>

<style scoped>
.layout-shell {
  --app-nav-height: 72px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
  background:
    radial-gradient(1100px 620px at 0% 0%, rgba(110, 231, 183, 0.09), transparent 58%),
    radial-gradient(1000px 680px at 100% 0%, rgba(96, 165, 250, 0.1), transparent 58%),
    linear-gradient(180deg, #f6f8fb, #eef3f8);
  overflow: hidden;
}

.layout-shell.home-mode {
  --app-nav-height: 0px;
}

.layout-ambient {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(48px);
  opacity: 0.56;
}

.layout-ambient-a {
  width: 360px;
  height: 360px;
  top: -120px;
  right: -80px;
  background: radial-gradient(circle, rgba(125, 173, 252, 0.22), transparent 70%);
}

.layout-ambient-b {
  width: 420px;
  height: 420px;
  bottom: -180px;
  left: -120px;
  background: radial-gradient(circle, rgba(120, 225, 208, 0.18), transparent 72%);
}

.layout-topbar {
  flex-shrink: 0;
  height: var(--app-nav-height);
  position: relative;
  z-index: 2;
  border-bottom: 1px solid rgba(221, 230, 240, 0.92);
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px) saturate(135%);
}

.layout-topbar-inner {
  height: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.layout-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  z-index: 1;
}

.layout-content.route-scroll {
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-bottom: 16px;
}

.layout-content.route-scroll::-webkit-scrollbar {
  width: 8px;
}

.layout-content.route-scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(148, 163, 184, 0.26);
}

.brand-anchor {
  min-width: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #0f172a;
}

.brand-anchor:hover .brand-mark {
  transform: translateY(-1px) scale(1.02);
  box-shadow: 0 18px 30px -22px rgba(15, 23, 42, 0.72);
}

.brand-mark {
  width: 34px;
  height: 34px;
  border-radius: 11px;
  background: #0f172a;
  color: #ffffff;
  display: grid;
  place-items: center;
  font-size: 16px;
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.8);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.brand-copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1;
  gap: 4px;
}

.brand-title {
  font-size: 14px;
  font-weight: 900;
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.topbar-center {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  min-width: 0;
}

.view-kicker {
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.topbar-center strong {
  font-size: 18px;
  line-height: 1;
  color: #0f172a;
  letter-spacing: -0.03em;
}

.topbar-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  min-width: 0;
  flex: 1;
}

.page-nav {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
}

.nav-pill {
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(221, 230, 240, 0.92);
  background: rgba(255, 255, 255, 0.82);
  color: #475569;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.nav-pill:hover {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.84);
  color: #0f172a;
  box-shadow: 0 10px 20px -18px rgba(15, 23, 42, 0.34);
}

.nav-pill.active {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border-color: #0f172a;
  color: #ffffff;
  box-shadow: 0 18px 28px -22px rgba(15, 23, 42, 0.64);
}

.back-btn {
  height: 34px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(203, 213, 225, 0.92);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
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
  transform: translateY(-1px);
}

.back-icon {
  font-size: 13px;
}

@media (max-width: 980px) {
  .layout-shell {
    --app-nav-height: 64px;
  }

  .layout-topbar {
    height: var(--app-nav-height);
  }

  .layout-topbar-inner {
    padding: 0 12px;
    gap: 10px;
  }

  .topbar-center {
    display: none;
  }

  .page-nav {
    gap: 6px;
    overflow-x: auto;
    flex-wrap: nowrap;
    scrollbar-width: none;
  }

  .page-nav::-webkit-scrollbar {
    display: none;
  }

  .nav-pill,
  .back-btn {
    height: 32px;
    padding: 0 12px;
  }

  .brand-mark {
    width: 32px;
    height: 32px;
    border-radius: 10px;
  }
}

@media (max-width: 760px) {
  .layout-topbar-inner {
    justify-content: space-between;
  }

  .brand-copy {
    display: none;
  }

  .topbar-actions {
    flex: 1;
    gap: 8px;
  }

  .back-btn span:last-child {
    display: none;
  }

  .back-btn {
    min-width: 36px;
    justify-content: center;
  }
}
</style>
