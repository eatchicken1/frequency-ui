<template>
  <div class="layout-shell">
    <div v-if="showBackButton" class="layout-ambient layout-ambient-a"></div>
    <div v-if="showBackButton" class="layout-ambient layout-ambient-b"></div>
    <header class="layout-topbar">
      <div class="layout-topbar-inner">
        <button class="brand-anchor" type="button" @click="goBackHome">
          <span class="brand-mark">〰</span>
          <span class="brand-copy">
            <span class="brand-title">FREQUENCY</span>
            <span class="brand-subtitle">Workspace</span>
          </span>
        </button>

        <div class="topbar-center">
          <span class="view-kicker">当前页面</span>
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

          <template v-if="isHomePage">
            <div class="topbar-status" aria-live="polite">
              <span class="status-dot" :class="{ playing }"></span>
              <span class="topbar-status-copy">{{ playing ? '音乐联动中' : '在线待机' }}</span>
            </div>

            <div class="settings-menu-container">
              <button
                class="settings-trigger"
                :class="{ active: showSettingsMenu }"
                type="button"
                aria-label="打开设置菜单"
                @click="showSettingsMenu = !showSettingsMenu"
              >
                ⚙
              </button>
              <div v-if="showSettingsMenu" class="settings-menu">
                <div class="settings-menu-item" @click="handlePersonalInfo">个人信息</div>
                <div class="settings-menu-item" @click="handleSettings">设置</div>
                <div class="settings-menu-item danger" @click="handleLogout">退出登录</div>
              </div>
            </div>
          </template>

          <button v-else class="back-btn" type="button" aria-label="返回主页" @click="goBackHome">
            <span class="back-icon">←</span>
            <span>主页</span>
          </button>
        </div>
      </div>
    </header>

    <main ref="layoutContentRef" class="layout-content" :class="{ 'route-scroll': showBackButton }">
      <router-view v-slot="{ Component, route: currentRoute }">
        <transition :name="pageTransitionName" mode="out-in">
          <component :is="Component" :key="currentRoute.fullPath" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup lang="ts" name="layout">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Cookies from 'js-cookie'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useMusicPlayerStore } from '@/stores/musicPlayer'
import { Session } from '@/utils/storage'

const route = useRoute()
const router = useRouter()
const layoutContentRef = ref<HTMLElement | null>(null)
const showSettingsMenu = ref(false)

const navItems = [
  { path: '/app/home', label: '当下' },
  { path: '/app/resonance', label: '共鸣' },
  { path: '/app/music', label: '听歌' },
  { path: '/app/me', label: '本我' }
]
const navOrderMap = new Map(navItems.map((item, index) => [item.path, index]))
const pageTransitionName = ref('route-slide-forward')
const musicPlayer = useMusicPlayerStore()
const { playing } = storeToRefs(musicPlayer)

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

const getRouteOrder = (path: string) => navOrderMap.get(path) ?? 0

const getPageTransitionName = (to: string, from?: string) => {
  if (!from || to === from) return 'route-slide-forward'
  return getRouteOrder(to) >= getRouteOrder(from) ? 'route-slide-forward' : 'route-slide-back'
}

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement | null
  if (target && !target.closest('.settings-menu-container')) {
    showSettingsMenu.value = false
  }
}

const handlePersonalInfo = () => {
  showSettingsMenu.value = false
  router.push('/app/me')
}

const handleSettings = () => {
  showSettingsMenu.value = false
  showToast('设置功能正在完善中，先跳转到个人页')
  router.push('/app/me')
}

const handleLogout = () => {
  showSettingsMenu.value = false
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  Cookies.remove('tenant_id')
  Session.clear()
  window.location.href = '/'
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

watch(
  () => route.path,
  async (to, from) => {
    showSettingsMenu.value = false
    pageTransitionName.value = getPageTransitionName(to, from)
    await nextTick()
    layoutContentRef.value?.scrollTo({ top: 0, behavior: 'auto' })
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

.layout-content :deep(> *) {
  min-height: 100%;
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

.topbar-status {
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(220, 228, 239, 0.92);
  background: rgba(255, 255, 255, 0.88);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  box-shadow: 0 10px 22px -20px rgba(15, 23, 42, 0.28);
}

.topbar-status-copy {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.status-dot.playing {
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
}

.settings-menu-container {
  position: relative;
}

.settings-trigger {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid rgba(220, 228, 239, 0.92);
  background: rgba(255, 255, 255, 0.88);
  color: #0f172a;
  font-size: 15px;
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.settings-trigger:hover,
.settings-trigger.active {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.92);
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.3);
}

.settings-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(220, 228, 239, 0.92);
  border-radius: 12px;
  box-shadow: 0 20px 36px -28px rgba(2, 6, 23, 0.26);
  backdrop-filter: blur(14px);
  z-index: 1000;
  overflow: hidden;
}

.settings-menu-item {
  padding: 12px 16px;
  font-size: 14px;
  color: #1f2937;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.settings-menu-item:hover {
  background: #f8fafc;
}

.settings-menu-item.danger {
  border-top: 1px solid #f1f5f9;
  color: #ef4444;
}

.settings-menu-item.danger:hover {
  background: #fef2f2;
}

.back-btn {
  height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(220, 228, 239, 0.92);
  background: rgba(255, 255, 255, 0.88);
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 10px 22px -20px rgba(15, 23, 42, 0.28);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
}

.back-btn:hover {
  background: #ffffff;
  border-color: rgba(148, 163, 184, 0.92);
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.3);
}

.back-icon {
  font-size: 12px;
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

  .topbar-status,
  .settings-trigger {
    height: 32px;
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

  .topbar-status {
    padding: 0 10px;
  }
}

:deep(.route-slide-forward-enter-active),
:deep(.route-slide-forward-leave-active),
:deep(.route-slide-back-enter-active),
:deep(.route-slide-back-leave-active) {
  transition:
    opacity 260ms ease,
    transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
    filter 320ms cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform, filter;
}

:deep(.route-slide-forward-enter-from),
:deep(.route-slide-back-leave-to) {
  opacity: 0;
  transform: translate3d(22px, 0, 0);
  filter: blur(10px);
}

:deep(.route-slide-forward-leave-to),
:deep(.route-slide-back-enter-from) {
  opacity: 0;
  transform: translate3d(-18px, 0, 0);
  filter: blur(8px);
}

:deep(.route-slide-forward-enter-to),
:deep(.route-slide-forward-leave-from),
:deep(.route-slide-back-enter-to),
:deep(.route-slide-back-leave-from) {
  opacity: 1;
  transform: translate3d(0, 0, 0);
  filter: blur(0);
}

@media (prefers-reduced-motion: reduce) {
  :deep(.route-slide-forward-enter-active),
  :deep(.route-slide-forward-leave-active),
  :deep(.route-slide-back-enter-active),
  :deep(.route-slide-back-leave-active) {
    transition: opacity 140ms ease;
  }

  :deep(.route-slide-forward-enter-from),
  :deep(.route-slide-forward-leave-to),
  :deep(.route-slide-back-enter-from),
  :deep(.route-slide-back-leave-to) {
    transform: none;
    filter: none;
  }
}
</style>
