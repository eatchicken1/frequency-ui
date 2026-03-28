<template>
  <div class="me-shell">
    <div class="orb orb-a"></div>
    <div class="orb orb-b"></div>

    <section class="profile-hero">
      <div class="avatar-wrap">
        <div class="avatar">{{ getInitial(overview.nickname) }}</div>
        <span class="badge">FREE PLAN</span>
      </div>
      <div class="profile-copy">
        <p class="kicker">MY FREQUENCY</p>
        <h1>{{ overview.nickname || '频率用户' }}</h1>
        <p>热度值 {{ overview.heat ?? 0 }} · 纯免费模式运行中</p>
      </div>
      <button class="refresh-btn" @click="loadOverview" :disabled="loading">
        {{ loading ? '同步中...' : '刷新数据' }}
      </button>
    </section>

    <div v-if="statusMessage" class="status" :class="`status-${statusType}`">
      {{ statusMessage }}
    </div>

    <section class="metrics">
      <article class="metric-card">
        <h3>动态发布</h3>
        <p>{{ overview.totalMoments ?? 0 }}</p>
      </article>
      <article class="metric-card">
        <h3>点赞次数</h3>
        <p>{{ overview.totalLiked ?? 0 }}</p>
      </article>
      <article class="metric-card">
        <h3>评论次数</h3>
        <p>{{ overview.totalComments ?? 0 }}</p>
      </article>
      <article class="metric-card">
        <h3>成功匹配</h3>
        <p>{{ overview.totalMatches ?? 0 }}</p>
      </article>
    </section>

    <section class="policy-card">
      <header>
        <h2>配额与成本保护</h2>
      </header>
      <ul>
        <li>知识投喂文件受大小限制，防止单次超大文件消耗。</li>
        <li>AI 调用 token 按日/月限额保护，避免免费模式被滥用。</li>
        <li>社交发帖与评论有频控策略，保证平台稳定性。</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getMyOverview } from '@/api/business'

const loading = ref(false)
const overview = ref<any>({})
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

const unwrap = (res: any) => res?.data?.data ?? res?.data ?? res

const showStatus = (message: string, type: 'success' | 'error' = 'success') => {
  statusMessage.value = message
  statusType.value = type
  window.setTimeout(() => {
    if (statusMessage.value === message) {
      statusMessage.value = ''
    }
  }, 2200)
}

const loadOverview = async () => {
  loading.value = true
  try {
    const res = await getMyOverview()
    overview.value = unwrap(res) || {}
    showStatus('数据已同步')
  } catch {
    showStatus('同步失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

const getInitial = (name: string) => {
  if (name && name.trim()) return name.trim().slice(0, 1).toUpperCase()
  return '我'
}

onMounted(loadOverview)
</script>

<style scoped>
.me-shell {
  --bg-top: #fff8f0;
  --bg-bottom: #fffdf8;
  --ink: #6a3510;
  --ink-soft: #9c5d2f;
  --line: #f1dcc6;
  --accent: #d9781d;
  min-height: 100%;
  padding: 18px;
  background: linear-gradient(165deg, var(--bg-top), var(--bg-bottom));
  position: relative;
  overflow: hidden;
  font-family: "Manrope", "Noto Sans SC", "PingFang SC", sans-serif;
}

.orb {
  position: absolute;
  border-radius: 999px;
  pointer-events: none;
  filter: blur(28px);
  opacity: 0.36;
  animation: floating 10s ease-in-out infinite;
}

.orb-a {
  width: 280px;
  height: 280px;
  background: radial-gradient(circle, #ffd2a4 0%, transparent 68%);
  right: -90px;
  top: -90px;
}

.orb-b {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #ffe8cd 0%, transparent 66%);
  left: -100px;
  bottom: -120px;
  animation-delay: 1.6s;
}

.profile-hero {
  position: relative;
  z-index: 1;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.88), rgba(255, 248, 236, 0.82));
  backdrop-filter: blur(8px);
  padding: 16px;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 14px;
  align-items: center;
  animation: entry 420ms ease;
}

.avatar-wrap {
  display: grid;
  justify-items: center;
  gap: 8px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  font-size: 24px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(135deg, #cb6917, #ef9a3d);
}

.badge {
  font-size: 10px;
  color: #8b4e1d;
  border: 1px solid #efcfae;
  background: #fff9f1;
  border-radius: 999px;
  padding: 2px 8px;
  letter-spacing: 0.08em;
}

.profile-copy .kicker {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: #b97a3d;
}

.profile-copy h1 {
  margin: 4px 0 0;
  font-size: 30px;
  line-height: 1.1;
  color: var(--ink);
}

.profile-copy p {
  margin: 6px 0 0;
  color: var(--ink-soft);
  font-size: 13px;
}

.refresh-btn {
  border: 1px solid #edcca9;
  background: #fff;
  color: #9f5e2b;
  border-radius: 10px;
  padding: 8px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease;
}

.refresh-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 14px -12px #91501a;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.status {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 13px;
  animation: entry 260ms ease;
}

.status-success {
  border: 1px solid #d8efda;
  background: #f0fff2;
  color: #2a7c39;
}

.status-error {
  border: 1px solid #f2c4c4;
  background: #fff3f3;
  color: #aa3c3c;
}

.metrics {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.metric-card {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.9);
}

.metric-card h3 {
  margin: 0;
  color: #aa6a34;
  font-size: 12px;
}

.metric-card p {
  margin: 8px 0 0;
  color: #75350a;
  font-size: 28px;
  line-height: 1;
  font-weight: 700;
}

.policy-card {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.92);
  padding: 14px;
}

.policy-card h2 {
  margin: 0;
  font-size: 16px;
  color: var(--ink);
}

.policy-card ul {
  margin: 10px 0 0;
  padding-left: 18px;
  display: grid;
  gap: 7px;
}

.policy-card li {
  color: #8b5120;
  font-size: 13px;
  line-height: 1.5;
}

@keyframes entry {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes floating {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(8px, -12px);
  }
}

@media (max-width: 1000px) {
  .metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .me-shell {
    padding: 12px;
  }

  .profile-hero {
    grid-template-columns: 1fr;
    justify-items: start;
  }

  .avatar-wrap {
    justify-items: start;
  }

  .profile-copy h1 {
    font-size: 24px;
  }

  .refresh-btn {
    width: 100%;
  }

  .metrics {
    grid-template-columns: 1fr;
  }
}

@media (prefers-color-scheme: dark) {
  .me-shell {
    --bg-top: #19130d;
    --bg-bottom: #15100c;
    --ink: #ffd9b4;
    --ink-soft: #d8ae88;
    --line: #4b3422;
    --accent: #ff9a3f;
    background: linear-gradient(165deg, #19130d, #15100c);
  }

  .orb-a {
    background: radial-gradient(circle, #9a5d2a 0%, transparent 68%);
  }

  .orb-b {
    background: radial-gradient(circle, #7e4b22 0%, transparent 66%);
  }

  .profile-hero,
  .metric-card,
  .policy-card {
    background: linear-gradient(135deg, rgba(42, 29, 19, 0.92), rgba(31, 22, 15, 0.9));
    border-color: #5b3d27;
  }

  .avatar {
    background: linear-gradient(135deg, #b7651b, #d28a3c);
  }

  .badge {
    background: #2f2014;
    border-color: #6b4426;
    color: #ebb785;
  }

  .profile-copy .kicker {
    color: #cc9b67;
  }

  .profile-copy h1,
  .policy-card h2 {
    color: #ffd8b3;
  }

  .profile-copy p,
  .metric-card h3,
  .policy-card li {
    color: #d0ab88;
  }

  .metric-card p {
    color: #ffcf9e;
  }

  .refresh-btn {
    background: #2c1f14;
    border-color: #7d5431;
    color: #efbe8d;
  }

  .status-success {
    border-color: #4c7b53;
    background: #1f3323;
    color: #98d7a2;
  }

  .status-error {
    border-color: #8a4646;
    background: #3a1f1f;
    color: #efb5b5;
  }
}
</style>
