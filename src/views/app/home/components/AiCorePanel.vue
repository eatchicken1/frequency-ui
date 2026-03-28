<template>
  <div class="page-root">
    <!-- 页面 Header（系统级） -->
    <div class="page-header">
      <div class="page-title">
        <span class="status-dot online"></span>
        <span>AI Core Panel</span>
      </div>
      <div class="page-desc">
        AI core engine status, configuration and runtime control
      </div>
    </div>

    <!-- 主体区域 -->
    <div class="page-content">
      <!-- 左侧：AI 核心信息 -->
      <div class="card">
        <div class="card-header">
          AI Core Overview
        </div>

        <div class="card-body center">
          <!-- 原头像功能（降权保留） -->
          <div class="ai-avatar">
            <img
              src="https://api.dicebear.com/7.x/bottts/svg?seed=Frequency"
              alt="AI Core"
            />
          </div>

          <div class="ai-name">
            AI Core Engine
          </div>

          <div class="ai-status online">
            ONLINE
          </div>

          <div class="ai-meta">
            <div class="meta-item">
              <span class="label">Model</span>
              <span class="value">GPT-based</span>
            </div>
            <div class="meta-item">
              <span class="label">Mode</span>
              <span class="value">Inference</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧：控制 & 运行 -->
      <div class="card">
        <div class="card-header">
          Runtime Control
        </div>

        <div class="card-body">
          <div class="status-block">
            <div class="status-label">Core Status</div>
            <div class="status-value online">Running</div>
          </div>

          <div class="status-block">
            <div class="status-label">Uptime</div>
            <div class="status-value muted">—</div>
          </div>

          <div class="status-block">
            <div class="status-label">Last Action</div>
            <div class="status-value muted">None</div>
          </div>
        </div>

        <div class="card-footer">
          <button class="secondary-btn" @click="restart">
            Restart Core
          </button>
          <button class="primary-btn" @click="shutdown">
            Shutdown
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 原来这里可以接你已有的控制逻辑
function restart() {
  console.log('Restart AI Core')
}

function shutdown() {
  console.log('Shutdown AI Core')
}
</script>

<style scoped>
/* ===== 页面基础 ===== */
.page-root {
  padding: 32px;
  background: #f3f4f6;
  min-height: calc(100vh - 64px);
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 20px;
  font-weight: 600;
  color: #111827;
}

.page-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #22c55e;
}

/* ===== 布局 ===== */
.page-content {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 24px;
}

/* ===== Card ===== */
.card {
  background: #ffffff;
  border-radius: 20px;
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 600;
}

.card-body {
  padding: 24px;
  flex: 1;
}

.card-body.center {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.card-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 12px;
}

/* ===== AI 信息 ===== */
.ai-avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0,0,0,.15);
}

.ai-avatar img {
  width: 100%;
  height: 100%;
}

.ai-name {
  margin-top: 14px;
  font-size: 15px;
  font-weight: 600;
}

.ai-status {
  margin-top: 6px;
  font-size: 12px;
  font-weight: 600;
}

.ai-status.online {
  color: #16a34a;
}

.ai-meta {
  margin-top: 20px;
  width: 100%;
}

.meta-item {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 10px;
}

.meta-item .label {
  color: #6b7280;
}

.meta-item .value {
  font-weight: 600;
}

/* ===== 状态 ===== */
.status-block {
  margin-bottom: 18px;
}

.status-label {
  font-size: 12px;
  color: #6b7280;
}

.status-value {
  margin-top: 6px;
  font-size: 14px;
  font-weight: 600;
}

.status-value.online {
  color: #16a34a;
}

.status-value.muted {
  color: #9ca3af;
}

/* ===== 按钮 ===== */
.primary-btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: #111827;
  color: #ffffff;
  border: none;
  cursor: pointer;
}

.secondary-btn {
  flex: 1;
  height: 40px;
  border-radius: 20px;
  background: #e5e7eb;
  border: none;
  cursor: pointer;
}
</style>
