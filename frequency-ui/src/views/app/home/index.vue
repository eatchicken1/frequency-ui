<template>
  <div class="app-root">
    <header class="app-header isolate">
      <div class="header-left">
        <div class="logo-box">
          <span>〰️</span>
        </div>
        <div class="logo-text">
          <span class="title">FREQUENCY</span>
          <span class="subtitle">Console</span>
        </div>
      </div>

      <div class="header-center">
        <span class="status-dot"></span>
        <span class="status-text">SYSTEM ONLINE</span>
      </div>

      <div class="header-right">
        <div class="user-box">
          <div class="user-text">
            <span class="user-name">Admin</span>
            <span class="user-role">Super User</span>
          </div>
          <div class="avatar">😊</div>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="layout-grid">
        
        <section class="panel panel-hover">
          <div class="panel-header">SIGNAL MONITOR</div>
          <div class="panel-body center">
            <div class="wave">
              <span v-for="i in 5" :key="i"></span>
            </div>
            <p class="hint">LISTENING…</p>
          </div>
        </section>

        <section class="panel panel-hover panel-core">
          <div class="core-container">
            <div class="core-wrapper">
              <div class="core-glow"></div>
              <div class="core">
                <span class="emoji-entity">🧬</span>
                <span class="core-state animate-pulse">STANDBY</span>
              </div>
            </div>
            
            <h2 class="core-title">ECHO-01</h2>

            <div class="action-area">
              <button class="btn-wake" @click="openCore">
                <span class="icon">⚡</span>
                <span>WAKE ECHO</span>
              </button>
            </div>
          </div>
        </section>

        <section class="panel panel-hover">
          <div class="panel-header">PORTAL</div>
          <ul class="portal-list">
            <li v-for="item in portals" :key="item.name" class="portal-item">
              <span class="portal-icon">{{ item.icon }}</span>
              <div class="portal-info">
                <strong>{{ item.name }}</strong>
                <small>{{ item.desc }}</small>
              </div>
            </li>
          </ul>
        </section>

      </div>
    </main>

    <Transition name="modal-fade">
      <div v-if="isCoreActive" class="modal-backdrop" @click.self="closeCore">
        <div class="modal-wrapper">
          <div class="modal-header">
            <div class="modal-status">
              <span class="status-dot active"></span>
              <span>NEURAL LINK ESTABLISHED</span>
            </div>
            <button class="btn-close" @click="closeCore">CLOSE ×</button>
          </div>
          
          <div class="modal-body">
            <AiCorePanel />
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AiCorePanel from './components/AiCorePanel.vue'

// --- Data ---
const portals = [
  { icon: '💕', name: 'Resonance', desc: 'Find Soulmate' },
  { icon: '🎓', name: 'Campus', desc: 'School Echoes' },
  { icon: '🔥', name: 'News', desc: 'Trending' }
]

// --- State ---
const isCoreActive = ref(false)

// --- Actions ---
const openCore = () => {
  isCoreActive.value = true
}

const closeCore = () => {
  isCoreActive.value = false
}
</script>

<style scoped>
/* ================= Root ================= */
.app-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f2f4f6;
  color: #27272a;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  overflow: hidden;
}

/* ================= Header (No Transform) ================= */
.app-header {
  height: 64px;
  flex-shrink: 0;
  z-index: 100;
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left, .header-right { display: flex; align-items: center; gap: 12px; }
.logo-box { width: 32px; height: 32px; border-radius: 8px; background: #18181b; color: white; display: grid; place-items: center; }
.logo-text { display: flex; flex-direction: column; line-height: 1; }
.logo-text .title { font-weight: 800; font-size: 14px; letter-spacing: -0.02em; }
.logo-text .subtitle { font-size: 10px; color: #71717a; letter-spacing: 0.1em; }
.header-center { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #10b981; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); border-radius: 20px; }
.status-dot { width: 6px; height: 6px; background: currentColor; border-radius: 50%; box-shadow: 0 0 8px currentColor; }
.user-box { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.user-text { text-align: right; }
.user-name { font-size: 12px; font-weight: bold; display: block; }
.user-role { font-size: 10px; color: #a1a1aa; }
.avatar { width: 36px; height: 36px; border-radius: 50%; border: 1px solid #e4e4e7; display: grid; place-items: center; background: white; }

/* ================= Main Layout ================= */
.app-main {
  flex: 1;
  padding: 24px 32px 32px 32px;
  min-height: 0; /* Important for scroll */
}

.layout-grid {
  display: grid;
  /* 严格保持你要求的左右宽度 */
  grid-template-columns: 320px 1fr 360px; 
  gap: 24px;
  height: 100%;
  max-width: 1600px;
  margin: 0 auto;
}

/* ================= Panels (Shared) ================= */
.panel {
  background: white;
  border-radius: 24px;
  border: 1px solid #e4e4e7;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.01);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.panel-hover {
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease;
}

.panel-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0,0,0,0.08);
}

.panel-header {
  padding: 20px 24px;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #a1a1aa;
  border-bottom: 1px solid #f4f4f5;
  text-transform: uppercase;
}

.panel-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.panel-body.center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ================= Left: Wave Animation ================= */
.wave { display: flex; gap: 4px; height: 32px; align-items: flex-end; margin-bottom: 16px; }
.wave span { width: 4px; background: #3b82f6; border-radius: 2px; animation: wave 1s ease-in-out infinite; }
.wave span:nth-child(1) { height: 20%; animation-delay: 0s; }
.wave span:nth-child(2) { height: 40%; animation-delay: 0.1s; }
.wave span:nth-child(3) { height: 100%; animation-delay: 0.2s; }
.wave span:nth-child(4) { height: 60%; animation-delay: 0.1s; }
.wave span:nth-child(5) { height: 30%; animation-delay: 0s; }
@keyframes wave { 0%, 100% { transform: scaleY(1); opacity: 0.5; } 50% { transform: scaleY(1.5); opacity: 1; } }
.hint { font-size: 11px; color: #cbd5e1; letter-spacing: 0.1em; }

/* ================= Middle: Core (Standby) ================= */
.panel-core {
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at center, #ffffff 0%, #fafafa 100%);
}

.core-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.core-wrapper { position: relative; width: 180px; height: 180px; }
.core-glow {
  position: absolute; inset: 0;
  background: rgba(99, 102, 241, 0.15);
  filter: blur(40px); border-radius: 50%;
  animation: breathe 4s infinite ease-in-out;
}
.core {
  position: relative; width: 100%; height: 100%;
  border-radius: 50%; background: white;
  border: 1px solid #e4e4e7;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  box-shadow: 0 10px 30px -10px rgba(99, 102, 241, 0.1);
}
.emoji-entity { font-size: 40px; margin-bottom: 4px; }
.core-state { font-size: 10px; letter-spacing: 0.2em; color: #6366f1; font-weight: 700; }
.core-title { font-family: monospace; font-size: 14px; letter-spacing: 0.2em; color: #71717a; }

/* 唤醒按钮 */
.btn-wake {
  height: 48px; padding: 0 32px;
  background: #18181b; color: white;
  border-radius: 24px; border: none;
  font-weight: 600; font-size: 13px; letter-spacing: 0.05em;
  display: flex; align-items: center; gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.btn-wake:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); background: #000; }
.btn-wake:active { transform: translateY(0); }

/* ================= Right: Portals ================= */
.portal-list { list-style: none; padding: 0 24px; margin: 0; }
.portal-item {
  display: flex; gap: 16px; padding: 16px;
  border-radius: 16px; cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}
.portal-item:hover { background: #f8fafc; transform: translateX(4px); }
.portal-icon { font-size: 20px; width: 40px; height: 40px; background: white; border: 1px solid #f4f4f5; border-radius: 12px; display: grid; place-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.portal-info { display: flex; flex-direction: column; justify-content: center; }
.portal-info strong { font-size: 13px; color: #3f3f46; margin-bottom: 2px; }
.portal-info small { font-size: 11px; color: #a1a1aa; }

/* ================= Modal ================= */
.modal-backdrop {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(9, 9, 11, 0.4);
  backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  padding: 40px;
}

.modal-wrapper {
  width: 100%; max-width: 900px; height: 85vh;
  display: flex; flex-direction: column; gap: 16px;
}

.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 0 8px; }
.modal-status { display: flex; align-items: center; gap: 8px; font-size: 11px; color: rgba(255,255,255,0.7); font-weight: 600; letter-spacing: 0.1em; }
.status-dot.active { width: 6px; height: 6px; background: #4ade80; border-radius: 50%; box-shadow: 0 0 10px #4ade80; }

.btn-close {
  background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);
  color: white; padding: 6px 16px; border-radius: 20px;
  font-size: 11px; font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.btn-close:hover { background: rgba(255,255,255,0.2); }

.modal-body { flex: 1; min-height: 0; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px -12px rgba(0,0,0,0.5); }

/* Animation */
.animate-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
@keyframes breathe { 0%, 100% { opacity: 0.2; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.1); } }

.modal-fade-enter-active, .modal-fade-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; transform: scale(0.96) translateY(12px); }
</style>