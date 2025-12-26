<template>
  <div class="app-container">
    <!-- Header (不可侵犯区) -->
    <header class="header">
      <div class="header-content">
        <h1 class="header-title">合规性面板</h1>
        <div class="header-actions">
          <button class="btn-secondary">帮助</button>
          <button class="btn-secondary">设置</button>
        </div>
      </div>
    </header>

    <!-- Main / Panel (可交互区) -->
    <main class="main-content">
      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">用户信息表单</h2>
        </div>
        <div class="panel-body">
          <form class="form">
            <div class="form-group">
              <label for="name" class="form-label">姓名</label>
              <input
                type="text"
                id="name"
                class="form-input"
                placeholder="请输入您的姓名"
              />
            </div>

            <div class="form-group">
              <label for="email" class="form-label">邮箱</label>
              <input
                type="email"
                id="email"
                class="form-input"
                placeholder="请输入您的邮箱"
              />
            </div>

            <div class="form-group">
              <label for="phone" class="form-label">电话</label>
              <input
                type="tel"
                id="phone"
                class="form-input"
                placeholder="请输入您的电话"
              />
            </div>

            <div class="form-actions">
              <button type="button" class="btn-secondary">重置</button>
              <button type="submit" class="btn-primary">提交</button>
            </div>
          </form>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h2 class="panel-title">数据统计</h2>
        </div>
        <div class="panel-body">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">1,234</div>
              <div class="stat-label">总用户数</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">567</div>
              <div class="stat-label">今日新增</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">89%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">$45,678</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer (不可侵犯区) -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-left">
          <p>© 2024 合规性系统. 保留所有权利.</p>
        </div>
        <div class="footer-right">
          <p>版本 1.0.0</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Vue 3 Composition API
import { ref } from 'vue'

// 表单数据
const formData = ref({
  name: '',
  email: '',
  phone: ''
})
</script>

<style scoped>
/* 基础样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 应用容器 */
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Header 样式 */
.header {
  flex-shrink: 0;
  isolation: isolate;
  background-color: #ffffff;
  border-bottom: 1px solid #e4e4e7;
  padding: 16px 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.header-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 24px;
}

/* Main 内容区域 */
.main-content {
  flex: 1;
  padding: 32px;
  background-color: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

/* Panel 样式 */
.panel {
  background-color: #ffffff;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  overflow: hidden;
  transition: box-shadow 0.3s ease;
}

.panel:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
}

.panel-header {
  padding: 24px 32px;
  border-bottom: 1px solid #f3f4f6;
  background-color: #ffffff;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.panel-body {
  padding: 32px;
}

/* 表单样式 */
.form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-input {
  height: 44px;
  padding: 0 24px;
  border: 1px solid #e4e4e7;
  border-radius: 20px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 24px;
  margin-top: 8px;
}

/* 按钮样式 */
.btn-primary,
.btn-secondary {
  min-height: 44px;
  padding: 0 32px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-primary {
  background-color: #3b82f6;
  color: #ffffff;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.1);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.2);
}

.btn-secondary {
  background-color: #ffffff;
  color: #374151;
  border: 1px solid #e4e4e7;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

/* 统计卡片样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.stat-card {
  padding: 24px;
  background-color: #f9fafb;
  border: 1px solid #e4e4e7;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  border-color: #d1d5db;
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

/* Footer 样式 */
.footer {
  flex-shrink: 0;
  isolation: isolate;
  background-color: #ffffff;
  border-top: 1px solid #e4e4e7;
  padding: 16px 32px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-content p {
  font-size: 14px;
  color: #6b7280;
}

/* 确保所有交互元素符合规范 */
button,
input {
  border-radius: 20px;
  outline: none;
}

/* 禁止自动填充样式破坏主题 */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px #ffffff inset !important;
  -webkit-text-fill-color: #1f2937 !important;
}
</style>