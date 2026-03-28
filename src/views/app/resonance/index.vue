<template>
  <div class="resonance-shell">
    <div class="ambient ambient-a"></div>
    <div class="ambient ambient-b"></div>

    <header class="hero-card">
      <div class="hero-main">
        <p class="hero-kicker">RESONANCE NETWORK</p>
        <h1>同频发现与社交动态</h1>
        <p class="hero-subtitle">
          先找到与你频率接近的人，再通过动态建立真实互动。
        </p>
      </div>
      <div class="hero-metrics">
        <article class="metric">
          <span>推荐用户</span>
          <strong>{{ recommendedUsers.length }}</strong>
        </article>
        <article class="metric">
          <span>动态条数</span>
          <strong>{{ feed.length }}</strong>
        </article>
        <article class="metric">
          <span>今日交互</span>
          <strong>{{ totalInteractions }}</strong>
        </article>
      </div>
    </header>

    <div v-if="statusMessage" class="status-bar" :class="`status-${statusType}`">
      {{ statusMessage }}
    </div>

    <main class="content-grid">
      <section class="card recommend-card">
        <div class="section-head">
          <h2>同频推荐池</h2>
          <button class="btn ghost" @click="loadAll" :disabled="loading">
            {{ loading ? '刷新中' : '刷新列表' }}
          </button>
        </div>

        <div v-if="loading && !recommendedUsers.length" class="placeholder-grid">
          <div v-for="n in 4" :key="n" class="placeholder-row"></div>
        </div>

        <div v-else class="recommend-list">
          <article v-for="user in recommendedUsers" :key="user.userId" class="user-card">
            <div class="user-avatar">{{ getUserInitial(user.nickname, user.userId) }}</div>
            <div class="user-meta">
              <h3>{{ user.nickname || `用户${user.userId}` }}</h3>
              <p>{{ user.mbti || 'UNKN' }} · 热度 {{ user.heat ?? 0 }}</p>
              <div class="score-track">
                <div class="score-fill" :style="{ width: `${normalizeScore(user.matchScoreHint)}%` }"></div>
              </div>
              <small>匹配度预估 {{ normalizeScore(user.matchScoreHint) }}</small>
            </div>
            <button
              class="btn primary"
              @click="startVibe(user.userId)"
              :disabled="vibeBusyUserId === user.userId"
            >
              {{ vibeBusyUserId === user.userId ? '测试中...' : '同频测试' }}
            </button>
          </article>
          <p v-if="!recommendedUsers.length" class="empty-text">暂无推荐用户，稍后刷新再试。</p>
        </div>
      </section>

      <section class="card feed-card">
        <div class="section-head">
          <h2>频率动态广场</h2>
        </div>

        <div class="compose-box">
          <textarea
            v-model="draftContent"
            maxlength="500"
            placeholder="记录你的当前频率..."
          ></textarea>
          <div class="compose-footer">
            <span>{{ draftContent.length }}/500</span>
            <button class="btn primary" @click="publishMoment" :disabled="publishing || !draftContent.trim()">
              {{ publishing ? '发布中...' : '发布动态' }}
            </button>
          </div>
        </div>

        <div class="feed-list">
          <article v-for="item in feed" :key="item.momentId" class="moment-card">
            <header class="moment-head">
              <div class="author">
                <div class="author-avatar">{{ getUserInitial(item.nickname, item.userId) }}</div>
                <div class="author-meta">
                  <strong>{{ item.nickname || `用户${item.userId}` }}</strong>
                  <span>{{ formatTime(item.createTime) }}</span>
                </div>
              </div>
            </header>

            <p class="moment-content">{{ item.content }}</p>

            <div class="moment-actions">
              <button class="btn mini" @click="toggleLike(item)">
                {{ item.likedByMe ? '已点赞' : '点赞' }} · {{ item.likeCount ?? 0 }}
              </button>
              <button class="btn mini" @click="toggleCommentPanel(item.momentId)">
                评论 · {{ item.commentCount ?? 0 }}
              </button>
            </div>

            <div v-if="activeCommentMomentId === item.momentId" class="comment-panel">
              <div v-if="loadingCommentMomentId === item.momentId" class="comment-loading">评论加载中...</div>
              <div v-else class="comment-list">
                <div v-for="comment in getComments(item)" :key="comment.id" class="comment-item">
                  <strong>{{ comment.nickname || `用户${comment.userId}` }}</strong>
                  <span>{{ comment.content }}</span>
                </div>
                <p v-if="!getComments(item).length" class="empty-comment">还没有评论，写下第一条吧。</p>
              </div>
              <div class="comment-editor">
                <input
                  v-model="commentDraftMap[item.momentId]"
                  maxlength="200"
                  placeholder="写下你的评论..."
                />
                <button class="btn mini primary" @click="sendComment(item)">发送</button>
              </div>
            </div>
          </article>
          <p v-if="!feed.length && !loading" class="empty-text">动态还在生成中，成为第一个发布者吧。</p>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import {
  createMomentComment,
  getRecommendedUsers,
  getSocialFeed,
  listMomentComments,
  publishSocialMoment,
  startVibeCheck,
  toggleMomentLike
} from '@/api/business'

const loading = ref(false)
const publishing = ref(false)
const vibeBusyUserId = ref<number | null>(null)
const recommendedUsers = ref<any[]>([])
const feed = ref<any[]>([])
const draftContent = ref('')
const activeCommentMomentId = ref<number | null>(null)
const loadingCommentMomentId = ref<number | null>(null)
const commentDraftMap = ref<Record<number, string>>({})
const commentMap = ref<Record<number, any[]>>({})
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

const totalInteractions = computed(() => {
  return feed.value.reduce((acc, item) => acc + (item.likeCount || 0) + (item.commentCount || 0), 0)
})

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

const loadAll = async () => {
  loading.value = true
  try {
    const [recommendRes, feedRes] = await Promise.all([getRecommendedUsers(), getSocialFeed(20)])
    recommendedUsers.value = unwrap(recommendRes) || []
    feed.value = unwrap(feedRes) || []
  } catch {
    showStatus('加载失败，请稍后重试', 'error')
  } finally {
    loading.value = false
  }
}

const publishMoment = async () => {
  const content = draftContent.value.trim()
  if (!content) return
  publishing.value = true
  try {
    await publishSocialMoment({ content })
    draftContent.value = ''
    await loadAll()
    showStatus('发布成功')
  } catch {
    showStatus('发布失败，请检查配额或稍后重试', 'error')
  } finally {
    publishing.value = false
  }
}

const toggleLike = async (item: any) => {
  const next = !item.likedByMe
  const oldLike = item.likedByMe
  const oldCount = item.likeCount || 0
  item.likedByMe = next
  item.likeCount = Math.max(0, oldCount + (next ? 1 : -1))
  try {
    await toggleMomentLike(item.momentId, next)
  } catch {
    item.likedByMe = oldLike
    item.likeCount = oldCount
    showStatus('操作失败，请稍后重试', 'error')
  }
}

const loadComments = async (momentId: number) => {
  loadingCommentMomentId.value = momentId
  try {
    const res = await listMomentComments(momentId, 20)
    commentMap.value[momentId] = unwrap(res) || []
  } catch {
    showStatus('评论加载失败', 'error')
  } finally {
    loadingCommentMomentId.value = null
  }
}

const toggleCommentPanel = async (momentId: number) => {
  if (activeCommentMomentId.value === momentId) {
    activeCommentMomentId.value = null
    return
  }
  activeCommentMomentId.value = momentId
  if (!commentMap.value[momentId]) {
    await loadComments(momentId)
  }
}

const sendComment = async (item: any) => {
  const draft = (commentDraftMap.value[item.momentId] || '').trim()
  if (!draft) return
  try {
    const res = await createMomentComment(item.momentId, draft)
    const comment = unwrap(res)
    if (!commentMap.value[item.momentId]) {
      commentMap.value[item.momentId] = []
    }
    commentMap.value[item.momentId].push(comment)
    item.commentCount = (item.commentCount || 0) + 1
    commentDraftMap.value[item.momentId] = ''
    showStatus('评论成功')
  } catch {
    showStatus('评论失败，请稍后重试', 'error')
  }
}

const startVibe = async (targetUserId: number) => {
  vibeBusyUserId.value = targetUserId
  try {
    await startVibeCheck(targetUserId)
    await loadAll()
    showStatus('同频测试已完成')
  } catch {
    showStatus('同频测试失败，请稍后重试', 'error')
  } finally {
    vibeBusyUserId.value = null
  }
}

const getComments = (item: any) => {
  return commentMap.value[item.momentId] || item.latestComments || []
}

const normalizeScore = (score: number) => {
  if (!score) return 0
  return Math.max(0, Math.min(100, Number(score)))
}

const formatTime = (value: string) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const now = new Date()
  const sameDay = now.toDateString() === date.toDateString()
  return sameDay ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : date.toLocaleString()
}

const getUserInitial = (nickname: string, userId: number) => {
  if (nickname && nickname.trim()) return nickname.trim().slice(0, 1).toUpperCase()
  return String(userId || 'U').slice(0, 1).toUpperCase()
}

onMounted(loadAll)
</script>

<style scoped>
.resonance-shell {
  --bg-1: #f7f8ff;
  --bg-2: #eef7ff;
  --ink-1: #172542;
  --ink-2: #466086;
  --line: #d7e4f6;
  --brand: #2e68d2;
  --brand-soft: #dbe7ff;
  --highlight: #1fb7a6;
  min-height: 100%;
  padding: 18px;
  background: linear-gradient(150deg, var(--bg-1), var(--bg-2));
  position: relative;
  overflow: hidden;
  font-family: "Space Grotesk", "Noto Sans SC", "PingFang SC", sans-serif;
}

.ambient {
  position: absolute;
  border-radius: 999px;
  filter: blur(24px);
  opacity: 0.45;
  pointer-events: none;
  animation: drift 9s ease-in-out infinite;
}

.ambient-a {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, #87b8ff 0%, transparent 68%);
  top: -60px;
  right: -40px;
}

.ambient-b {
  width: 320px;
  height: 320px;
  background: radial-gradient(circle, #8ee7dc 0%, transparent 68%);
  bottom: -110px;
  left: -90px;
  animation-delay: 1.2s;
}

.hero-card {
  position: relative;
  z-index: 1;
  border: 1px solid var(--line);
  border-radius: 22px;
  padding: 20px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(244, 248, 255, 0.78));
  backdrop-filter: blur(8px);
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 16px;
  animation: rise-in 420ms ease;
}

.hero-kicker {
  margin: 0 0 6px;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #4f6891;
  font-weight: 600;
}

.hero-main h1 {
  margin: 0;
  font-size: 26px;
  line-height: 1.15;
  color: var(--ink-1);
}

.hero-subtitle {
  margin: 8px 0 0;
  color: var(--ink-2);
  font-size: 14px;
  line-height: 1.5;
}

.hero-metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}

.metric {
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 12px 10px;
  background: #fff;
  display: grid;
  gap: 6px;
}

.metric span {
  font-size: 11px;
  color: #6b83a7;
}

.metric strong {
  font-size: 24px;
  line-height: 1;
  color: #183154;
}

.status-bar {
  position: relative;
  z-index: 1;
  border-radius: 12px;
  padding: 9px 12px;
  font-size: 13px;
  margin-bottom: 12px;
  animation: rise-in 260ms ease;
}

.status-success {
  background: #e6fff7;
  border: 1px solid #a8ead7;
  color: #18695f;
}

.status-error {
  background: #fff1f1;
  border: 1px solid #f0b4b4;
  color: #9a2f2f;
}

.content-grid {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 380px minmax(0, 1fr);
  gap: 14px;
}

.card {
  border: 1px solid var(--line);
  border-radius: 18px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(6px);
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-head h2 {
  margin: 0;
  font-size: 16px;
  color: var(--ink-1);
}

.recommend-list {
  display: grid;
  gap: 10px;
  max-height: calc(100vh - 300px);
  overflow: auto;
  padding-right: 2px;
}

.recommend-list::-webkit-scrollbar,
.feed-list::-webkit-scrollbar {
  width: 8px;
}

.recommend-list::-webkit-scrollbar-thumb,
.feed-list::-webkit-scrollbar-thumb {
  background: #d4def0;
  border-radius: 999px;
}

.user-card {
  border: 1px solid #d9e5f7;
  border-radius: 14px;
  padding: 10px;
  display: grid;
  grid-template-columns: 44px 1fr auto;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #ffffff, #f5f9ff);
}

.user-avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #2f77ff, #5aa6ff);
  color: #fff;
  font-size: 16px;
  font-weight: 700;
}

.user-meta h3 {
  margin: 0;
  color: #15325c;
  font-size: 14px;
}

.user-meta p {
  margin: 2px 0;
  color: #617fa9;
  font-size: 12px;
}

.user-meta small {
  color: #35639d;
  font-size: 11px;
}

.score-track {
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: #e5eeff;
  overflow: hidden;
  margin: 6px 0 4px;
}

.score-fill {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #31cdb8, #2f79f4);
  transition: width 260ms ease;
}

.feed-card {
  display: grid;
  grid-template-rows: auto auto 1fr;
  min-height: calc(100vh - 230px);
}

.compose-box {
  border: 1px solid #d5e4fa;
  border-radius: 14px;
  padding: 10px;
  background: #fbfdff;
  margin-bottom: 12px;
}

.compose-box textarea {
  width: 100%;
  min-height: 84px;
  border: none;
  outline: none;
  resize: vertical;
  background: transparent;
  color: #1c385f;
  line-height: 1.5;
  font-size: 13px;
}

.compose-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #6884ab;
  font-size: 12px;
}

.feed-list {
  display: grid;
  gap: 10px;
  overflow: auto;
  padding-right: 2px;
}

.moment-card {
  border: 1px solid #d9e5f7;
  border-radius: 14px;
  padding: 11px;
  background: linear-gradient(135deg, #ffffff, #f6f9ff);
  animation: rise-in 280ms ease;
}

.author {
  display: flex;
  align-items: center;
  gap: 9px;
}

.author-avatar {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: #dcebff;
  color: #1f4f95;
  font-size: 13px;
  font-weight: 700;
}

.author-meta {
  display: grid;
}

.author-meta strong {
  color: #19345d;
  font-size: 13px;
}

.author-meta span {
  color: #6b84a8;
  font-size: 11px;
}

.moment-content {
  margin: 8px 0 10px;
  color: #1f3f6a;
  font-size: 13px;
  line-height: 1.58;
}

.moment-actions {
  display: flex;
  gap: 8px;
}

.comment-panel {
  margin-top: 10px;
  border-top: 1px dashed #cfe0f7;
  padding-top: 8px;
}

.comment-loading,
.empty-comment {
  margin: 0 0 8px;
  font-size: 12px;
  color: #6b84a8;
}

.comment-list {
  display: grid;
  gap: 6px;
  margin-bottom: 8px;
}

.comment-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 8px;
  font-size: 12px;
  color: #325b8d;
}

.comment-item strong {
  color: #1f4678;
}

.comment-editor {
  display: flex;
  gap: 8px;
}

.comment-editor input {
  flex: 1;
  border: 1px solid #c7dbf6;
  border-radius: 9px;
  padding: 7px 9px;
  font-size: 12px;
  outline: none;
  color: #1f3f67;
}

.btn {
  border: 1px solid #c7daf5;
  border-radius: 10px;
  background: #fff;
  color: #204976;
  padding: 7px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: transform 160ms ease, box-shadow 160ms ease, background 160ms ease;
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 14px -12px #1b3f6f;
}

.btn.primary {
  border-color: var(--brand);
  background: linear-gradient(135deg, #3a78ea, var(--brand));
  color: #fff;
}

.btn.ghost {
  background: #f6f9ff;
}

.btn.mini {
  padding: 5px 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.placeholder-grid {
  display: grid;
  gap: 10px;
}

.placeholder-row {
  height: 64px;
  border-radius: 12px;
  background: linear-gradient(90deg, #edf3ff, #f6f9ff, #edf3ff);
  background-size: 200% 100%;
  animation: shimmer 1.1s linear infinite;
}

.empty-text {
  margin: 10px 0 0;
  color: #6d86aa;
  font-size: 12px;
}

@keyframes rise-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes drift {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, -14px);
  }
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@media (max-width: 1180px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .recommend-list {
    max-height: 360px;
  }

  .feed-card {
    min-height: auto;
  }
}

@media (max-width: 760px) {
  .resonance-shell {
    padding: 12px;
  }

  .hero-card {
    grid-template-columns: 1fr;
    padding: 16px;
  }

  .hero-main h1 {
    font-size: 22px;
  }

  .hero-metrics {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .user-card {
    grid-template-columns: 36px 1fr;
  }

  .user-avatar {
    width: 36px;
    height: 36px;
    border-radius: 10px;
  }

  .user-card .btn {
    grid-column: 1 / -1;
    width: 100%;
  }
}

@media (prefers-color-scheme: dark) {
  .resonance-shell {
    --bg-1: #0f1524;
    --bg-2: #101d2e;
    --ink-1: #e5eeff;
    --ink-2: #9ab0d7;
    --line: #253854;
    --brand: #5f9dff;
    --brand-soft: #1b2b44;
    --highlight: #3ed5bf;
    background: linear-gradient(150deg, #0d1524, #0f1b2e);
  }

  .ambient-a {
    background: radial-gradient(circle, #2f4f84 0%, transparent 68%);
  }

  .ambient-b {
    background: radial-gradient(circle, #176a64 0%, transparent 68%);
  }

  .hero-card,
  .card {
    background: linear-gradient(135deg, rgba(21, 31, 48, 0.92), rgba(16, 27, 43, 0.9));
    border-color: #2a3c59;
  }

  .metric,
  .user-card,
  .compose-box,
  .moment-card {
    background: linear-gradient(135deg, #16253b, #131f32);
    border-color: #2c4161;
  }

  .metric strong,
  .hero-main h1,
  .section-head h2,
  .user-meta h3,
  .author-meta strong {
    color: #e4edff;
  }

  .hero-kicker,
  .hero-subtitle,
  .metric span,
  .user-meta p,
  .user-meta small,
  .author-meta span,
  .moment-content,
  .empty-text,
  .comment-loading,
  .empty-comment,
  .compose-footer {
    color: #9ab0d7;
  }

  .user-avatar {
    background: linear-gradient(135deg, #4b8fff, #3b6ac4);
  }

  .author-avatar {
    background: #1c3555;
    color: #c8dcff;
  }

  .score-track {
    background: #243651;
  }

  .compose-box textarea,
  .comment-editor input {
    color: #dce8ff;
  }

  .comment-editor input {
    border-color: #2f4668;
    background: #122033;
  }

  .btn {
    background: #15253c;
    border-color: #345178;
    color: #c8dcff;
  }

  .btn.ghost {
    background: #132239;
  }

  .btn.primary {
    border-color: #5f9dff;
    background: linear-gradient(135deg, #5f9dff, #4a7dd2);
    color: #fff;
  }

  .comment-panel {
    border-top-color: #2e4668;
  }

  .comment-item {
    color: #9eb4d9;
  }

  .comment-item strong {
    color: #c7dbff;
  }

  .placeholder-row {
    background: linear-gradient(90deg, #1a2b43, #1f3049, #1a2b43);
  }
}
</style>
