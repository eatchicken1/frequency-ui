<template>
  <div class="page-root">
    <!-- 页面标题区（与 Home 风格一致） -->
    <div class="page-header">
      <div class="page-title">
        <span class="status-dot"></span>
        <span>Compliant Panel</span>
      </div>
      <div class="page-desc">
        System compliance detection and rule validation
      </div>
    </div>

    <!-- 页面主体 -->
    <div class="page-content">
      <!-- 左侧：配置 / 输入 -->
      <div class="card card-config">
        <div class="card-header">
          <span>Configuration</span>
        </div>

        <div class="card-body">
          <div class="form-item">
            <label>Target Environment</label>
            <select v-model="form.env">
              <option value="prod">Production</option>
              <option value="staging">Staging</option>
              <option value="dev">Development</option>
            </select>
          </div>

          <div class="form-item">
            <label>Compliance Level</label>
            <select v-model="form.level">
              <option value="strict">Strict</option>
              <option value="normal">Normal</option>
              <option value="loose">Loose</option>
            </select>
          </div>

          <div class="form-item">
            <label>Rule Set</label>
            <select v-model="form.ruleSet">
              <option value="default">Default Rules</option>
              <option value="security">Security Rules</option>
              <option value="custom">Custom Rules</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 右侧：状态 / 执行 -->
      <div class="card card-status">
        <div class="card-header">
          <span>Execution Status</span>
        </div>

        <div class="card-body">
          <div class="status-block">
            <div class="status-label">Module Status</div>
            <div class="status-value ready">
              READY
            </div>
          </div>

          <div class="status-block">
            <div class="status-label">Last Execution</div>
            <div class="status-value muted">
              Not executed
            </div>
          </div>

          <div class="status-block">
            <div class="status-label">Result</div>
            <div class="status-value muted">
              —
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button class="primary-btn" @click="execute">
            Execute Compliance Check
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const form = reactive({
  env: 'prod',
  level: 'normal',
  ruleSet: 'default'
})

function execute() {
  // 这里可以接你原来的执行逻辑
  console.log('Execute compliance check:', form)
}
</script>

<style scoped>
/* ===== 页面根 ===== */
.page-root {
  padding: 32px;
  background: #f3f4f6;
  min-height: calc(100vh - 64px);
}

/* ===== Header（对齐 Home） ===== */
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

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22c55e;
}

.page-desc {
  margin-top: 6px;
  font-size: 13px;
  color: #6b7280;
}

/* ===== 主体布局 ===== */
.page-content {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 24px;
}

/* ===== 通用 Card ===== */
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
  color: #111827;
}

.card-body {
  padding: 24px;
  flex: 1;
}

.card-footer {
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

/* ===== 表单 ===== */
.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 18px;
}

.form-item label {
  font-size: 12px;
  color: #374151;
}

.form-item select {
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #d1d5db;
  font-size: 13px;
  outline: none;
}

.form-item select:focus {
  border-color: #111827;
}

/* ===== 状态块 ===== */
.status-block {
  margin-bottom: 20px;
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

.status-value.ready {
  color: #16a34a;
}

.status-value.muted {
  color: #9ca3af;
}

/* ===== 按钮 ===== */
.primary-btn {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  background: #111827;
  color: #ffffff;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.primary-btn:hover {
  background: #000000;
}
</style>
