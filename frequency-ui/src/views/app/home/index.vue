<template>
  <div class="app-root">
    <!-- ================= Header ================= -->
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

    <!-- ================= Main ================= -->
    <main class="app-main">
      <div class="layout-grid">
        <!-- Left Panel -->
        <section class="panel panel-hover">
          <div class="panel-header">SIGNAL MONITOR</div>
          <div class="panel-body center">
            <div class="wave">
              <span v-for="i in 5" :key="i"></span>
            </div>
            <p class="hint">LISTENING…</p>
          </div>
        </section>

        <!-- Center Panel -->
        <section class="panel panel-hover panel-core">
          <div class="core-wrapper">
            <div class="core-glow"></div>
            <div class="core">
              🧬
              <span class="core-state">ACTIVE</span>
            </div>
          </div>
          <h2 class="core-title">ECHO-01</h2>
        </section>

        <!-- Right Panel -->
        <section class="panel panel-hover">
          <div class="panel-header">PORTAL</div>
          <ul class="portal-list">
            <li v-for="item in portals" :key="item.name" class="portal-item">
              <span>{{ item.icon }}</span>
              <div>
                <strong>{{ item.name }}</strong>
                <small>{{ item.desc }}</small>
              </div>
            </li>
          </ul>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
const portals = [
  { icon: '💕', name: 'Resonance', desc: 'Find Soulmate' },
  { icon: '🎓', name: 'Campus', desc: 'School Echoes' },
  { icon: '🔥', name: 'News', desc: 'Trending' }
]
</script>

<style scoped>
/* ================= Root ================= */
.app-root {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f2f4f6;
  color: #27272a;
}

/* ================= Header ================= */
.app-header {
  height: 64px;
  flex-shrink: 0;
  z-index: 100;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #f4f4f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text .title {
  font-family: serif;
  letter-spacing: 0.25em;
  font-size: 12px;
  font-weight: bold;
}

.logo-text .subtitle {
  font-size: 8px;
  letter-spacing: 0.4em;
  color: #a1a1aa;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-radius: 999px;
  background: #f4f4f5;
  border: 1px solid #e4e4e7;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #22c55e;
}

.status-text {
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #71717a;
}

.user-box {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.user-text {
  text-align: right;
}

.user-name {
  font-size: 12px;
  font-weight: bold;
}

.user-role {
  font-size: 9px;
  color: #a1a1aa;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid #e4e4e7;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ================= Main ================= */
.app-main {
  flex: 1;
  padding: 24px 32px;
  min-height: 0;
}

/* Grid */
.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  gap: 24px;
  height: 100%;
}

/* ================= Panel ================= */
.panel {
  background: white;
  border-radius: 16px;
  border: 1px solid #e4e4e7;
  box-shadow: 0 4px 24px rgba(0,0,0,0.03);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.panel-hover {
  transition: transform 0.4s cubic-bezier(0.4,0,0.2,1),
              box-shadow 0.4s;
}

.panel-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 32px rgba(0,0,0,0.08);
}

.panel-header {
  padding: 16px;
  font-size: 10px;
  letter-spacing: 0.2em;
  color: #a1a1aa;
  border-bottom: 1px solid #f4f4f5;
}

.panel-body.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* ================= Core ================= */
.panel-core {
  align-items: center;
  justify-content: center;
}

.core-wrapper {
  position: relative;
  width: 200px;
  height: 200px;
}

.core-glow {
  position: absolute;
  inset: 0;
  background: rgba(34,211,238,0.15);
  filter: blur(48px);
  border-radius: 50%;
}

.core {
  position: relative;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: white;
  border: 1px solid #e4e4e7;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 40px;
}

.core-state {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: #06b6d4;
}

.core-title {
  margin-top: 16px;
  font-family: serif;
  letter-spacing: 0.3em;
}

/* ================= Portal ================= */
.portal-list {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.portal-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  transition: transform 0.3s;
}

.portal-item:hover {
  transform: translateX(6px);
  background: #fafafa;
}

.portal-item strong {
  font-size: 12px;
}

.portal-item small {
  font-size: 9px;
  color: #a1a1aa;
}
</style>
