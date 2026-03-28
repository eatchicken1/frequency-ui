<template>
  <div class="runtime-root">
    <div class="runtime-header">
      <div class="runtime-title-wrap">
        <span class="runtime-dot" :class="statusClass"></span>
        <div>
          <p class="runtime-kicker">ECHO CORE RUNTIME</p>
          <h3>运行态总览</h3>
        </div>
      </div>
      <button class="runtime-refresh" type="button" :disabled="loading" @click="loadRuntime">
        {{ loading ? '刷新中...' : '刷新' }}
      </button>
    </div>

    <div v-if="error" class="runtime-error">
      {{ error }}
    </div>

    <div class="runtime-grid">
      <article class="runtime-card">
        <p class="card-label">Core Status</p>
        <p class="card-value" :class="statusClass">{{ runtime.status || '--' }}</p>
        <p class="card-sub">最近更新时间：{{ formatTime(runtime.generatedAt) }}</p>
      </article>

      <article class="runtime-card">
        <p class="card-label">Provider</p>
        <p class="card-value">{{ runtime.defaultProvider || '--' }}</p>
        <p class="card-sub">MCP：{{ runtime.mcpEnabled ? '已启用' : '未启用' }}</p>
      </article>

      <article class="runtime-card">
        <p class="card-label">Runtime URL</p>
        <p class="card-value mono">{{ runtime.pythonRuntimeUrl || '--' }}</p>
        <p class="card-sub">Quota TZ：{{ runtime.quotaTimeZone || '--' }}</p>
      </article>

      <article class="runtime-card">
        <p class="card-label">当前用户</p>
        <p class="card-value">{{ runtime.userId ?? '--' }}</p>
        <p class="card-sub">配额开关：{{ runtime.redisHotData?.quotaEnabled ? '开启' : '关闭' }}</p>
      </article>
    </div>

    <div class="quota-section">
      <div class="quota-head">
        <h4>Redis 热点数据（Token 配额）</h4>
        <span class="quota-head-sub">检查键是否已落 Redis</span>
      </div>

      <div class="quota-grid">
        <section class="quota-card">
          <div class="quota-top">
            <strong>日配额</strong>
            <span class="quota-badge" :class="bucketStateClass(daily)">{{ bucketStateText(daily) }}</span>
          </div>
          <p class="quota-key mono">{{ daily?.key || '--' }}</p>
          <div class="quota-metrics">
            <span>已用 / 上限</span>
            <strong>{{ formatNum(daily?.used) }} / {{ formatNum(daily?.limit) }}</strong>
          </div>
          <div class="quota-metrics">
            <span>TTL(s)</span>
            <strong>{{ formatNum(daily?.ttlSeconds) }}</strong>
          </div>
        </section>

        <section class="quota-card">
          <div class="quota-top">
            <strong>月配额</strong>
            <span class="quota-badge" :class="bucketStateClass(monthly)">{{ bucketStateText(monthly) }}</span>
          </div>
          <p class="quota-key mono">{{ monthly?.key || '--' }}</p>
          <div class="quota-metrics">
            <span>已用 / 上限</span>
            <strong>{{ formatNum(monthly?.used) }} / {{ formatNum(monthly?.limit) }}</strong>
          </div>
          <div class="quota-metrics">
            <span>TTL(s)</span>
            <strong>{{ formatNum(monthly?.ttlSeconds) }}</strong>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { showToast } from 'vant'
import { getAiRuntimeOverview } from '@/api/business'

const loading = ref(false)
const error = ref('')
const runtime = ref({})

const daily = computed(() => runtime.value?.redisHotData?.daily || null)
const monthly = computed(() => runtime.value?.redisHotData?.monthly || null)

const statusClass = computed(() => {
  const status = String(runtime.value?.status || '').toLowerCase()
  return status === 'running' ? 'ok' : 'muted'
})

const loadRuntime = async () => {
  if (loading.value) return
  loading.value = true
  error.value = ''
  try {
    const res = await getAiRuntimeOverview()
    runtime.value = res?.data?.data || res?.data || {}
  } catch (e) {
    error.value = '运行态数据加载失败，请检查网关 /api/ai/platform/runtime'
    showToast('Runtime 数据拉取失败')
  } finally {
    loading.value = false
  }
}

const bucketStateText = (bucket) => {
  if (!bucket) return '--'
  return bucket.valuePresent ? '已命中 Redis' : '未命中'
}

const bucketStateClass = (bucket) => {
  if (!bucket) return 'unknown'
  return bucket.valuePresent ? 'hit' : 'miss'
}

const formatNum = (value) => {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '--'
  return Number(value).toLocaleString('zh-CN')
}

const formatTime = (value) => {
  if (!value) return '--'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('zh-CN', { hour12: false })
}

onMounted(() => {
  loadRuntime()
})
</script>

<style scoped>
.runtime-root {
  height: 100%;
  overflow: auto;
  padding: 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #f3f6fb 100%);
}

.runtime-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.runtime-title-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
}

.runtime-dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
}

.runtime-dot.ok {
  background: #16a34a;
  box-shadow: 0 0 0 4px rgba(22, 163, 74, 0.18);
}

.runtime-dot.muted {
  background: #94a3b8;
}

.runtime-kicker {
  margin: 0;
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.runtime-title-wrap h3 {
  margin: 3px 0 0;
  font-size: 18px;
  color: #0f172a;
}

.runtime-refresh {
  height: 34px;
  border-radius: 999px;
  border: 1px solid #d2dbe7;
  background: #fff;
  color: #334155;
  padding: 0 14px;
  font-weight: 700;
  cursor: pointer;
}

.runtime-refresh:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.runtime-error {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #fecaca;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 12px;
}

.runtime-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.runtime-card {
  border: 1px solid #dce4ee;
  border-radius: 16px;
  background: #fff;
  padding: 12px;
}

.card-label {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-weight: 700;
}

.card-value {
  margin: 8px 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  word-break: break-all;
}

.card-value.ok {
  color: #15803d;
}

.card-value.muted {
  color: #64748b;
}

.card-value.mono {
  font-family: Consolas, Menlo, Monaco, monospace;
  font-size: 14px;
}

.card-sub {
  margin: 0;
  color: #64748b;
  font-size: 12px;
}

.quota-section {
  margin-top: 14px;
  border: 1px solid #dce4ee;
  border-radius: 16px;
  background: #fff;
  padding: 14px;
}

.quota-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 10px;
}

.quota-head h4 {
  margin: 0;
  font-size: 14px;
  color: #0f172a;
}

.quota-head-sub {
  color: #64748b;
  font-size: 11px;
}

.quota-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.quota-card {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 10px;
  background: #f8fafc;
}

.quota-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.quota-top strong {
  color: #0f172a;
  font-size: 13px;
}

.quota-badge {
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: 700;
}

.quota-badge.hit {
  background: #dcfce7;
  color: #166534;
}

.quota-badge.miss {
  background: #fef3c7;
  color: #92400e;
}

.quota-badge.unknown {
  background: #e2e8f0;
  color: #475569;
}

.quota-key {
  margin: 8px 0;
  color: #334155;
  font-size: 11px;
  word-break: break-all;
}

.quota-metrics {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
  margin-top: 6px;
}

.quota-metrics strong {
  color: #0f172a;
}

.mono {
  font-family: Consolas, Menlo, Monaco, monospace;
}

@media (max-width: 980px) {
  .runtime-root {
    padding: 14px;
  }

  .runtime-grid,
  .quota-grid {
    grid-template-columns: 1fr;
  }
}
</style>
