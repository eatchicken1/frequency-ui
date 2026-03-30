<template>
  <div class="app-root">
    <main class="app-main">
      <section class="overview-strip">
        <article class="overview-rail overview-lead">
          <div class="overview-copy">
            <p class="overview-kicker">CURRENT FREQUENCY</p>
            <h2>{{ profile.name }} 正在待机</h2>
            <p>
              让聊天、分身和音乐保持一条连续的情绪曲线。当前人格为
              <strong>{{ profile.speechStyle }}</strong>，{{ statusText }}。
            </p>
          </div>

          <div class="overview-actions">
            <button class="overview-btn primary icon-btn" @click="openCore">
              <span class="icon-glyph" aria-hidden="true">⚡</span>
              <span>唤醒 Runtime</span>
            </button>
            <button class="overview-btn icon-btn" @click="openWorkshop">
              <span class="icon-glyph" aria-hidden="true">🧠</span>
              <span>打开 Workshop</span>
            </button>
          </div>
        </article>

        <article class="overview-rail">
          <span class="overview-label icon-label"><span class="label-icon" aria-hidden="true">●</span><span>状态</span></span>
          <strong>{{ isStreaming ? '对话流进行中' : '系统在线待机' }}</strong>
          <small>{{ currentTrack ? '音乐氛围已接入' : '当前无音乐输入' }}</small>
        </article>

        <article class="overview-rail">
          <span class="overview-label icon-label"><span class="label-icon" aria-hidden="true">◈</span><span>知识库</span></span>
          <strong>{{ profile.knowledgeCount || 0 }} 份资料</strong>
          <small>{{ profile.expertise || '等待补充擅长领域' }}</small>
        </article>

        <article class="overview-rail">
          <span class="overview-label icon-label"><span class="label-icon" aria-hidden="true">✦</span><span>今日提示</span></span>
          <strong>{{ dailyMissions[0]?.title }}</strong>
          <small>{{ dailyMissions[0]?.desc }}</small>
        </article>
      </section>

      <div class="layout-grid">
        <section class="panel panel-signal">
          <div class="panel-header">
            <div>
              <p class="kicker">SIGNAL MONITOR</p>
              <h3>{{ profile.name }} Dialogue</h3>
            </div>
            <span class="tag" :class="{ streaming: isStreaming }">{{ isStreaming ? 'STREAMING' : 'READY' }}</span>
          </div>

          <div class="panel-body signal-body">
            <div class="signal-console">
              <div class="signal-console-chip">
                <span>状态</span>
                <strong>{{ isStreaming ? '正在回应' : isLoadingHistory ? '同步历史中' : '对话就绪' }}</strong>
              </div>
              <div class="signal-console-chip ghost">
                <span>模式</span>
                <strong>{{ currentTrack ? '配乐联动' : '纯对话模式' }}</strong>
              </div>
            </div>

            <div class="quick-row">
              <button
                v-for="item in quickInteractions"
                :key="item.label"
                class="quick-chip"
                :disabled="isStreaming"
                @click="sendQuickMessage(item.text)"
              >
                {{ item.label }}
              </button>
            </div>

            <div class="chat-box" @click.stop>
              <div ref="chatScrollRef" class="chat-messages">
                <div v-if="isLoadingHistory && !messages.length" class="chat-empty-panel loading">
                  <span class="chat-empty-kicker">SYNCING HISTORY</span>
                  <strong>正在同步过往对话</strong>
                  <p>稍等片刻，我们把历史会话重新接回当前信号面板。</p>
                </div>
                <div v-else-if="!messages.length" class="chat-empty-panel">
                  <span class="chat-empty-kicker">SIGNAL READY</span>
                  <strong>从一句简单的话开始</strong>
                  <p>点击上方快捷交互，或者直接输入你此刻想聊的事情。</p>
                </div>

                <div v-if="isLoadingHistory && messages.length" class="history-tip">正在加载更早对话...</div>

                <div
                  v-for="(message, index) in messages"
                  :key="`${message.role}-${index}`"
                  :class="['chat-row', message.role]"
                >
                  <div class="chat-avatar">
                    {{ message.role === 'user' ? 'U' : profile.name.slice(0, 1).toUpperCase() }}
                  </div>

                  <div class="chat-bubble">
                    <div class="chat-name">{{ message.role === 'user' ? 'me' : profile.name }}</div>
                    <p class="chat-text">{{ message.content || (message.role === 'ai' && isStreaming ? '...' : '') }}</p>
                  </div>
                </div>
              </div>

              <div class="chat-input">
                <div class="chat-input-meta">
                  <span>{{ isStreaming ? '回应生成中' : '按 Enter 发送' }}</span>
                  <span>{{ currentTrack ? '音乐已接入' : '未接入配乐' }}</span>
                </div>

                <div class="chat-input-row">
                  <input
                    v-model="userInput"
                    type="text"
                    :placeholder="`和 ${profile.name} 说点什么...`"
                    @focus="isInputFocused = true"
                    @blur="isInputFocused = false"
                    @keyup.enter="sendMessage"
                    :disabled="isStreaming"
                  />
                  <button class="chat-send" @click="sendMessage" :disabled="isStreaming || !userInput.trim()">
                    发送
                  </button>
                  <button v-if="isStreaming" class="chat-stop" @click="stopStreaming">停止</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="panel panel-core">
          <div class="panel-header">
            <div>
              <p class="kicker">STANDBY STAGE</p>
              <h3>{{ profile.name }}</h3>
            </div>
            <span class="tag">STANDBY</span>
          </div>

          <div class="panel-body core-body">
            <div class="core-stage">
              <div class="stage-aura"></div>
              <div class="stage-topline">
                <span class="stage-chip primary">{{ isStreaming ? 'STREAMING' : 'STANDBY' }}</span>
                <span class="stage-chip">{{ currentTrack ? 'MUSIC LINKED' : 'SILENT FIELD' }}</span>
              </div>

              <div class="stage-center">
                <EchoAvatar
                  :name="profile.name"
                  :mood="profile.mood"
                  :palette="profile.palette"
                  :species="profile.species"
                  :accessory="profile.accessory"
                  :speaking="avatarMode === 'replying'"
                  :mode="avatarMode"
                  :look-direction="avatarLookDirection"
                  :music-energy="energyLevel"
                  :show-label="false"
                />
              </div>

              <div class="stage-footer">
                <div class="stage-footer-copy">
                  <strong>{{ profile.name }}</strong>
                  <span>{{ profile.speechStyle }} · {{ currentTrack ? currentTrack.name : '静默待机中' }}</span>
                </div>
              </div>
            </div>

            <div class="core-meta-grid">
              <div class="core-meta-chip"><span>Signal</span><strong>{{ isStreaming ? 'Streaming' : 'Stable' }}</strong></div>
              <div class="core-meta-chip"><span>Persona</span><strong>{{ profile.speechStyle }}</strong></div>
              <div class="core-meta-chip"><span>Status</span><strong>{{ statusText }}</strong></div>
            </div>
          </div>
        </section>

        <aside class="sidebar-stack">
          <section class="panel panel-portal">
            <div class="panel-header">
              <div>
                <p class="kicker">HOT FEATURES</p>
                <h3>热门功能</h3>
              </div>
              <span class="tag">{{ displayedHotFeatures.length || 0 }}项</span>
            </div>

            <div class="panel-body right-body">
              <div class="portal-grid">
                <button
                  v-for="item in displayedHotFeatures"
                  :key="item.featureCode"
                  class="portal-tile"
                  type="button"
                  @click="handleHotFeatureClick(item)"
                >
                  <div class="portal-tile-copy">
                    <div class="portal-mainline">
                      <span class="portal-title">
                        <span class="title-icon" aria-hidden="true">{{ getFeatureIcon(item) }}</span>
                        <span class="portal-title-text">{{ item.featureName }}</span>
                      </span>
                      <span class="portal-heat">热度 {{ item.heatScore || item.clickCount || 0 }}</span>
                    </div>
                    <span class="portal-desc">{{ item.featureDesc || '高频访问功能' }}</span>
                  </div>
                  <span class="portal-link-text">{{ item.actionType === 'action' ? '触发' : '进入' }}</span>
                </button>
              </div>

              <div v-if="!displayedHotFeatures.length" class="portal-empty">
                <strong>热门功能正在计算中</strong>
                <span>稍后会根据全站访问热度自动补齐。</span>
              </div>

              <button v-if="showFeaturedWorkshop" class="portal-featured" type="button" @click="openHotPreset('echo-core')">
                <div class="portal-featured-copy">
                  <div class="portal-featured-title">
                    <strong>EchoCore Workshop</strong>
                  </div>
                  <span>快速进入分身工作台，继续调人格、形象与知识仓。</span>
                </div>
                <span class="portal-link-text featured">打开</span>
              </button>

              <div class="portal-tip">
                <span class="portal-tip-dot"></span>
                <span>热门功能来自后台热度统计与缓存，每 5 分钟自动刷新。</span>
              </div>
            </div>
          </section>

          <section class="panel panel-resonance">
            <div class="panel-header">
              <div>
                <p class="kicker">RESONANCE DECK</p>
                <h3>{{ currentTrack?.name || '情绪配乐与今日节奏' }}</h3>
              </div>
              <button class="dock-jump" @click="openMusicLibrary">音乐库</button>
            </div>

            <div class="panel-body resonance-body">
              <div v-if="currentTrack" class="music-dock">
                <div class="dock-topline">
                  <span class="dock-status">{{ playing ? 'PLAYING' : 'PAUSED' }}</span>
                  <span class="dock-track">{{ currentTrack.name }}</span>
                </div>

                <p class="resonance-sub">{{ `${formatTime(currentTime)} / ${formatTime(duration)} · 当前音乐正在驱动 Echo 氛围。` }}</p>

                <input v-model.number="seekPercentProxy" class="dock-progress" type="range" min="0" max="100" step="0.1" />

                <div class="dock-controls">
                  <button class="dock-btn" @click="prevTrackFromDock">上一首</button>
                  <button class="dock-btn primary" @click="toggleMusicFromDock">{{ playing ? '暂停' : '播放' }}</button>
                  <button class="dock-btn" @click="nextTrackFromDock">下一首</button>
                </div>
              </div>

              <div v-else class="dock-empty">
                <div class="dock-empty-copy">
                  <strong>当前没有接入配乐</strong>
                  <span>添加一首歌，让 Echo 的待机区和聊天区都带上节奏感。</span>
                </div>
                <button class="dock-btn primary icon-btn" @click="openMusicLibrary">
                  <span class="icon-glyph" aria-hidden="true">♫</span>
                  <span>添加配乐</span>
                </button>
              </div>

              <div class="resonance-suggestion">
                <span class="overview-label">今日提示</span>
                <strong>{{ dailyMissions[1]?.title }}</strong>
                <small>{{ dailyMissions[1]?.desc }}</small>
              </div>
            </div>
          </section>
        </aside>
      </div>

      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="isCoreActive" class="modal-backdrop" @click.self="closeCore">
            <div class="modal-panel" @click.stop>
              <div class="modal-header">
                <div class="modal-title"><span class="modal-dot"></span><span>Echo Core Runtime</span></div>
                <button class="btn-close" @click="closeCore">✕</button>
              </div>
              <div class="modal-body">
                <AiCorePanel />
              </div>
            </div>
          </div>
        </Transition>

        <Transition name="modal-fade">
          <div v-if="isEchoCoreActive" class="modal-backdrop" @click.self="isEchoCoreActive = false">
            <div class="modal-panel" @click.stop>
              <div class="modal-header">
                <div class="modal-title"><span class="modal-dot"></span><span>EchoCore Workshop</span></div>
                <button class="btn-close" @click="isEchoCoreActive = false">✕</button>
              </div>
              <div class="modal-body">
                <EchoCore v-model="isEchoCoreActive" />
              </div>
            </div>
          </div>
        </Transition>
      </Teleport>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { streamChat, getChatHistory, getMyProfile, listHotFeatures, reportHotFeature } from '@/api/business'
import AiCorePanel from './components/AiCorePanel.vue'
import EchoCore from './components/EchoCore.vue'
import EchoAvatar from './components/EchoAvatar.vue'
import Cookies from 'js-cookie'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useEchoPersonaStore } from '@/stores/echoPersona'
import { useMusicPlayerStore } from '@/stores/musicPlayer'

type HotFeatureItem = {
  featureCode: string
  featureName: string
  featureDesc?: string
  actionType?: 'route' | 'action' | string
  actionValue?: string
  icon?: string
  clickCount?: number
  heatScore?: number
}

type AvatarMode = 'idle' | 'listening' | 'thinking' | 'replying' | 'grooving'
type AvatarLookDirection = 'center' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right'

const hotFeatureFallback: HotFeatureItem[] = [
  { featureCode: 'home', featureName: '当下', featureDesc: '返回当前主界面', actionType: 'route', actionValue: '/app/home', icon: '•' },
  { featureCode: 'resonance', featureName: '共鸣', featureDesc: '查看频率匹配与推荐', actionType: 'route', actionValue: '/app/resonance', icon: '💕' },
  { featureCode: 'music', featureName: '听歌', featureDesc: '打开音乐库与情绪配乐', actionType: 'route', actionValue: '/app/music', icon: '🎵' },
  { featureCode: 'me', featureName: '本我', featureDesc: '查看个人状态与设置', actionType: 'route', actionValue: '/app/me', icon: '◌' },
  { featureCode: 'echo-core', featureName: 'EchoCore', featureDesc: 'AI 分身工作台', actionType: 'action', actionValue: 'open-echo-core', icon: '🧠' }
]

const isCoreActive = ref(false)
const isEchoCoreActive = ref(false)
const router = useRouter()
const hotFeatures = ref<HotFeatureItem[]>([...hotFeatureFallback])

const echoStore = useEchoPersonaStore()
const musicPlayer = useMusicPlayerStore()
const { profile, statusText } = storeToRefs(echoStore)
const { currentTrack, currentTime, duration, playing, seekPercent, tracks, energyLevel } = storeToRefs(musicPlayer)

const quickInteractions = computed(() => [
  { label: '打个招呼', text: `${profile.value.name}，先和我打个招呼吧。` },
  { label: '今日建议', text: `以${profile.value.speechStyle}风格，给我一个今天可执行的提升建议。` },
  { label: '节奏聊天', text: '结合当前音乐氛围，陪我聊 1 分钟，语气轻松一点。' }
])

const displayedHotFeatures = computed(() => {
  const seen = new Set<string>()
  return hotFeatures.value.filter((item) => {
    const featureCode = String(item.featureCode || '').trim().toLowerCase()
    const actionValue = String(item.actionValue || '').trim().toLowerCase()
    const featureName = String(item.featureName || '').trim().toLowerCase()

    if (featureCode === 'home' || actionValue === '/app/home') {
      return false
    }

    const uniqueKey = actionValue || `${featureCode}:${featureName}`
    if (!uniqueKey) return true
    if (seen.has(uniqueKey)) return false
    seen.add(uniqueKey)
    return true
  })
})

const showFeaturedWorkshop = computed(() => {
  return !displayedHotFeatures.value.some((item) => {
    const featureCode = String(item.featureCode || '').toLowerCase()
    const actionValue = String(item.actionValue || '').toLowerCase()
    return featureCode.includes('echo') || actionValue === 'open-echo-core'
  })
})

const dailyMissions = computed(() => [
  {
    title: '校准分身',
    desc: profile.value.personaPrompt ? '把人格设定收成更稳定的说话习惯。' : '补上分身人格 Prompt，让回答更像你的 Echo。'
  },
  {
    title: '做一次共鸣测试',
    desc: '到共鸣页刷新推荐，看看今天谁和你的频率最接近。'
  },
  {
    title: '接入情绪配乐',
    desc: currentTrack.value ? `继续播放 ${currentTrack.value.name}，让对话氛围更完整。` : '导入一首歌，让待机区和聊天区联动起来。'
  }
])

type ChatMessage = { role: 'user' | 'ai'; content: string; createTime?: string; timestamp?: number }
const userInput = ref('')
const isInputFocused = ref(false)
const messages = ref<ChatMessage[]>([])
const isStreaming = ref(false)
const hasReplyText = ref(false)
const avatarLookDirection = ref<AvatarLookDirection>('center')
let avatarLookTimer: number | null = null

const chatScrollRef = ref<HTMLElement | null>(null)
const streamController = ref<AbortController | null>(null)
let stopCurrentTyping: (() => void) | null = null
const backendEchoId = ref<string | number | null>(null)

const currentPage = ref(1)
const totalPages = ref(1)
const isLoadingHistory = ref(false)
const hasMoreHistory = ref(true)

const seekPercentProxy = computed({
  get: () => seekPercent.value,
  set: (value: number) => musicPlayer.setSeekPercent(value)
})

const avatarMode = computed<AvatarMode>(() => {
  if (isStreaming.value && hasReplyText.value) return 'replying'
  if (isStreaming.value) return 'thinking'
  if (isInputFocused.value) return 'listening'
  if (playing.value && energyLevel.value > 0.04) return 'grooving'
  return 'idle'
})

const toTimestamp = (value?: string | number | null) => {
  if (value === null || value === undefined || value === '') return 0
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const PERSONA_CONTEXT_PREFIX = '[[ECHO_CONTEXT]]'

const stripPersonaContext = (text?: string) => {
  const source = String(text || '')
  if (!source.startsWith(PERSONA_CONTEXT_PREFIX)) return source
  const splitIndex = source.indexOf('\n\n')
  if (splitIndex === -1) return source
  return source.slice(splitIndex + 2)
}

const sortMessagesAscending = (list: ChatMessage[]) => {
  return [...list].sort((a, b) => {
    const ta = a.timestamp || toTimestamp(a.createTime)
    const tb = b.timestamp || toTimestamp(b.createTime)
    if (ta !== tb) return ta - tb
    if (a.role === b.role) return 0
    return a.role === 'user' ? -1 : 1
  })
}

const buildPersonaContext = () => {
  const expertise = profile.value.expertise ? `擅长领域：${profile.value.expertise}` : ''
  return [
    `你是用户的分身「${profile.value.name}」。`,
    `语气风格：${profile.value.speechStyle}。`,
    `人格设定：${profile.value.personaPrompt}。`,
    expertise
  ]
    .filter(Boolean)
    .join('\n')
}

const extractEchoIdFromToken = () => {
  const token = Cookies.get('access_token')
  if (!token || !token.includes('.')) return null
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1] || ''))
    const candidates = [payload.echoId, payload.user_id, payload.userId, payload.id, payload.uid, payload.sub]
    const matched = candidates.find((value) => value !== undefined && value !== null && `${value}`.trim() !== '')
    return matched ?? null
  } catch {
    return null
  }
}

const syncProfileFromBackend = async () => {
  try {
    const res = await getMyProfile()
    const data = res?.data?.data ?? res?.data ?? {}
    if (!data || typeof data !== 'object') return
    if (data.echoId !== undefined && data.echoId !== null && `${data.echoId}`.trim() !== '') {
      backendEchoId.value = data.echoId
    }

    const tags = Array.isArray(data.tags)
      ? data.tags.filter(Boolean)
      : String(data.tags || '')
          .split(/[,，]/)
          .map((item) => item.trim())
          .filter(Boolean)
    const next = {
      ...profile.value,
      name: data.nickname || profile.value.name,
      personaPrompt: data.personalityPrompt || profile.value.personaPrompt,
      speechStyle: data.voiceTone || profile.value.speechStyle,
      expertise: tags.join(', ') || profile.value.expertise,
      visibility: String(data.isPublic || '').toUpperCase() === 'Y' ? '公开' : '私有'
    }
    echoStore.applyProfile(next)
  } catch (error) {
    console.warn('同步分身资料失败，使用本地配置', error)
  }
}

const loadChatHistory = async (page = 1, shouldPrepend = false) => {
  if (isLoadingHistory.value || !hasMoreHistory.value) return

  const scrollEl = chatScrollRef.value
  const previousHeight = shouldPrepend && scrollEl ? scrollEl.scrollHeight : 0

  try {
    isLoadingHistory.value = true
    const conversationId = sessionStorage.getItem('currentConversationId')
    const response = await getChatHistory(page, 20, conversationId)

    if (response && response.records && response.records.length > 0) {
      const historyMessages: ChatMessage[] = response.records.map((record: any) => ({
        role: record.role === 'user' ? 'user' : 'ai',
        content: record.role === 'user' ? stripPersonaContext(record.content) : record.content,
        createTime: record.createTime,
        timestamp: toTimestamp(record.createTime)
      }))

      if (shouldPrepend) {
        messages.value = sortMessagesAscending([...messages.value, ...historyMessages])
        await nextTick()
        if (scrollEl) {
          const nextHeight = scrollEl.scrollHeight
          scrollEl.scrollTop = Math.max(0, nextHeight - previousHeight)
        }
      } else {
        messages.value = sortMessagesAscending(historyMessages)
      }

      currentPage.value = response.current || page
      totalPages.value = response.pages || 1
      hasMoreHistory.value = currentPage.value < totalPages.value
    } else {
      hasMoreHistory.value = false
      if (!shouldPrepend) messages.value = []
    }
  } catch (error) {
    console.error('加载聊天历史记录失败:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

const handleScroll = () => {
  const el = chatScrollRef.value
  if (!el) return
  if (el.scrollTop <= 0 && hasMoreHistory.value && !isLoadingHistory.value) {
    void loadChatHistory(currentPage.value + 1, true)
  }
}

onMounted(async () => {
  await syncProfileFromBackend()
  await loadHotFeatures()
  await loadChatHistory(1, false)
  const el = chatScrollRef.value
  if (el) el.addEventListener('scroll', handleScroll)

  if (!tracks.value.length) {
    try {
      await musicPlayer.loadRemoteTracks()
    } catch (error: any) {
      console.warn('加载音乐列表失败', error)
    }
  }
})

onBeforeUnmount(() => {
  const el = chatScrollRef.value
  if (el) el.removeEventListener('scroll', handleScroll)
  stopCurrentTyping?.()
  if (streamController.value) streamController.value.abort()
  if (avatarLookTimer != null) {
    window.clearTimeout(avatarLookTimer)
    avatarLookTimer = null
  }
})

const scrollToBottom = async () => {
  await nextTick()
  const el = chatScrollRef.value
  if (!el) return
  el.scrollTop = el.scrollHeight
}

watch(
  messages,
  () => {
    if (!isLoadingHistory.value) {
      void scrollToBottom()
    }
  },
  { deep: true }
)

const openCore = () => {
  cueAvatarLook('up-left')
  isCoreActive.value = true
}

const openWorkshop = () => {
  cueAvatarLook('up-left')
  isEchoCoreActive.value = true
}

const closeCore = () => {
  isCoreActive.value = false
}

const cueAvatarLook = (direction: AvatarLookDirection, duration = 1400) => {
  avatarLookDirection.value = direction
  if (avatarLookTimer != null) {
    window.clearTimeout(avatarLookTimer)
  }
  avatarLookTimer = window.setTimeout(() => {
    avatarLookDirection.value = 'center'
    avatarLookTimer = null
  }, duration)
}

const loadHotFeatures = async () => {
  try {
    const res = await listHotFeatures(6)
    const data = res?.data?.data || res?.data || []
    if (Array.isArray(data) && data.length) {
      hotFeatures.value = data.map((item: any) => ({
        featureCode: String(item.featureCode || ''),
        featureName: String(item.featureName || '未命名功能'),
        featureDesc: String(item.featureDesc || ''),
        actionType: String(item.actionType || 'route'),
        actionValue: String(item.actionValue || ''),
        icon: String(item.icon || ''),
        clickCount: Number(item.clickCount || 0),
        heatScore: Number(item.heatScore || 0)
      }))
      return
    }
    hotFeatures.value = [...hotFeatureFallback]
  } catch (error) {
    console.warn('加载热门功能失败，使用兜底配置', error)
    hotFeatures.value = [...hotFeatureFallback]
  }
}

const reportHotFeatureClick = async (item: HotFeatureItem) => {
  try {
    await reportHotFeature({
      featureCode: item.featureCode,
      featureName: item.featureName,
      featureDesc: item.featureDesc,
      actionType: item.actionType,
      actionValue: item.actionValue,
      icon: item.icon
    })
  } catch (error) {
    console.warn('上报热门功能点击失败', error)
  }
}

const openHotPreset = async (featureCode: string) => {
  const preset = hotFeatureFallback.find((item) => item.featureCode === featureCode)
  if (!preset) return
  await handleHotFeatureClick(preset)
}

const handleHotFeatureClick = async (item: HotFeatureItem) => {
  cueAvatarLook('right')
  await reportHotFeatureClick(item)
  const actionType = String(item.actionType || 'route')
  const actionValue = String(item.actionValue || '')
  if (actionType === 'action' || actionValue === 'open-echo-core') {
    openWorkshop()
    return
  }
  if (actionValue) {
    router.push(actionValue)
  }
}

const openMusicLibrary = () => {
  cueAvatarLook('right', 1200)
  router.push('/app/music')
}

const getFeatureIcon = (item: HotFeatureItem) => {
  const icon = String(item.icon || '').trim()
  if (icon) return icon
  const code = String(item.featureCode || '').toLowerCase()
  if (code.includes('home')) return '◉'
  if (code.includes('resonance')) return '✶'
  if (code.includes('music')) return '♫'
  if (code.includes('me')) return '◎'
  if (code.includes('echo')) return '◈'
  return '◆'
}

const stopStreaming = () => {
  stopCurrentTyping?.()
  streamController.value?.abort()
  streamController.value = null
  stopCurrentTyping = null
  isStreaming.value = false
  hasReplyText.value = false
}

const sendQuickMessage = async (text: string) => {
  cueAvatarLook('left', 900)
  userInput.value = text
  await sendMessage()
}

const sendMessage = async () => {
  const content = userInput.value.trim()
  if (!content || isStreaming.value) return

  cueAvatarLook('left', 1200)
  stopCurrentTyping?.()
  stopCurrentTyping = null

  if (streamController.value) {
    streamController.value.abort()
    streamController.value = null
  }

  userInput.value = ''
  const nowTs = Date.now()
  messages.value.push({ role: 'user', content, timestamp: nowTs })
  messages.value.push({ role: 'ai', content: '', timestamp: nowTs + 1 })
  messages.value = sortMessagesAscending(messages.value)

  const currentIndex = messages.value.findIndex((item) => item.role === 'ai' && !item.content && item.timestamp === nowTs + 1)
  if (currentIndex === -1) {
    isStreaming.value = false
    showToast('消息队列异常，请重试')
    return
  }
  const controller = new AbortController()
  streamController.value = controller
  isStreaming.value = true
  hasReplyText.value = false

  let fullText = ''
  let displayIndex = 0
  let typingActive = false
  let typingTimer: number | null = null

  const stopTyping = () => {
    typingActive = false
    if (typingTimer != null) {
      window.clearTimeout(typingTimer)
      typingTimer = null
    }
  }
  stopCurrentTyping = stopTyping

  const typeNextChar = () => {
    if (!typingActive) return

    if (displayIndex < fullText.length) {
      displayIndex += 1
      messages.value[currentIndex] = {
        ...messages.value[currentIndex],
        content: fullText.slice(0, displayIndex)
      }
      typingTimer = window.setTimeout(typeNextChar, 16)
      return
    }

    stopTyping()
  }

  try {
    const conversationId = sessionStorage.getItem('currentConversationId') || String(Date.now())
    sessionStorage.setItem('currentConversationId', conversationId)
    const echoId = backendEchoId.value ?? extractEchoIdFromToken()
    const personaContext = buildPersonaContext()
    const mergedQuery = `${PERSONA_CONTEXT_PREFIX}\n${personaContext}\n\n${content}`

    await streamChat({
      query: mergedQuery,
      conversationId,
      echoId,
      signal: controller.signal,
      onMessage: (chunk: string) => {
        fullText += chunk
        if (fullText.trim()) {
          hasReplyText.value = true
        }
        if (!typingActive) {
          typingActive = true
          typeNextChar()
        }
      },
      onError: (error: Error) => {
        stopTyping()
        messages.value[currentIndex] = {
          ...messages.value[currentIndex],
          content: error?.message || '系统繁忙，请稍后重试。'
        }
        streamController.value = null
        stopCurrentTyping = null
        isStreaming.value = false
        hasReplyText.value = false
      },
      onComplete: () => {
        stopTyping()
        messages.value[currentIndex] = {
          ...messages.value[currentIndex],
          content: fullText
        }
        streamController.value = null
        stopCurrentTyping = null
        isStreaming.value = false
        hasReplyText.value = false
      }
    })
  } catch (err: any) {
    stopTyping()
    messages.value[currentIndex] = {
      ...messages.value[currentIndex],
      content: err?.message || '系统繁忙，请稍后重试。'
    }
    streamController.value = null
    stopCurrentTyping = null
    isStreaming.value = false
    hasReplyText.value = false
  }
}

const toggleMusicFromDock = () => {
  cueAvatarLook('right', 1200)
  if (!currentTrack.value) {
    openMusicLibrary()
    return
  }
  void musicPlayer.togglePlay()
}

const prevTrackFromDock = () => {
  cueAvatarLook('right', 900)
  if (!tracks.value.length) {
    openMusicLibrary()
    return
  }
  void musicPlayer.prevTrack()
}

const nextTrackFromDock = () => {
  cueAvatarLook('right', 900)
  if (!tracks.value.length) {
    openMusicLibrary()
    return
  }
  void musicPlayer.nextTrack()
}

const formatTime = (seconds: number) => {
  const value = Math.max(0, Math.floor(seconds || 0))
  const m = Math.floor(value / 60)
  const s = value % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>

<style scoped>
.app-root {
  height: 100%;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1100px 680px at 12% -8%, rgba(98, 224, 208, 0.2), transparent 54%),
    radial-gradient(960px 620px at 96% -4%, rgba(123, 172, 255, 0.18), transparent 56%),
    radial-gradient(760px 520px at 50% 118%, rgba(147, 197, 253, 0.14), transparent 70%),
    linear-gradient(180deg, #f7fbff, #edf3f9);
  color: var(--text-primary);
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  overflow: hidden;
}

.app-main {
  flex: 1;
  min-height: 0;
  padding: 18px 24px 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.overview-strip {
  width: min(2000px, 100%);
  flex-shrink: 0;
  margin: 0 auto 8px;
  display: grid;
  grid-template-columns: minmax(0, 1.55fr) repeat(3, minmax(220px, 0.55fr));
  gap: 8px;
}

.overview-copy {
  min-width: 0;
}

.icon-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.label-icon {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #4f6f95;
  font-size: 9px;
  background: rgba(203, 219, 238, 0.36);
}

.overview-kicker,
.overview-label {
  margin: 0;
  color: #7b8a9b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.overview-copy h2 {
  margin: 1px 0 0;
  color: #0f172a;
  font-size: 16px;
  line-height: 1.08;
  letter-spacing: -0.04em;
}

.overview-copy p {
  margin: 3px 0 0;
  color: #526173;
  font-size: 10px;
  line-height: 1.45;
  max-width: 520px;
}

.overview-copy strong {
  color: #0f172a;
}

.overview-rail {
  border-radius: 18px;
  border: 1px solid rgba(214, 226, 240, 0.9);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(248, 252, 255, 0.9));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 18px 38px -34px rgba(15, 23, 42, 0.34);
  backdrop-filter: blur(16px);
  padding: 10px 12px;
  display: grid;
  align-content: center;
  gap: 3px;
  min-height: 72px;
}

.overview-lead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.overview-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.overview-btn {
  min-height: 30px;
  padding: 0 10px;
  border-radius: 11px;
  border: 1px solid rgba(197, 210, 226, 0.94);
  background: linear-gradient(180deg, #ffffff, #f8fafc);
  color: #0f172a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.03em;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.icon-glyph {
  font-size: 12px;
  line-height: 1;
}

.overview-btn:hover {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.84);
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.34);
}

.overview-btn.primary {
  background: linear-gradient(135deg, #e8f1ff, #dce9fb);
  color: #173a66;
  border-color: rgba(162, 184, 216, 0.92);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.overview-rail strong {
  color: #0f172a;
  font-size: 13px;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.overview-rail small {
  color: #64748b;
  font-size: 10px;
  line-height: 1.35;
}

.layout-grid {
  flex: 1;
  width: min(2000px, 100%);
  display: grid;
  grid-template-columns: minmax(320px, 1.02fr) minmax(520px, 1.34fr) minmax(340px, 0.92fr);
  grid-template-areas:
    'signal core sidebar';
  gap: 14px;
  min-height: 0;
  height: 0;
  margin: 0 auto;
  align-items: stretch;
}

.panel-signal {
  grid-area: signal;
}

.panel-core {
  grid-area: core;
}

.panel-resonance {
  grid-area: resonance;
}

.panel-portal {
  grid-area: portal;
}

.sidebar-stack {
  grid-area: sidebar;
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 0;
}

.panel-portal {
  flex: 1;
  min-height: 0;
}

.panel-resonance {
  flex: 0 0 auto;
}

.panel {
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92), rgba(246, 250, 255, 0.88));
  border-radius: 22px;
  border: 1px solid rgba(216, 227, 241, 0.86);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 18px 36px -30px rgba(15, 23, 42, 0.34);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
  min-height: 0;
}

.panel {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 26px 42px -30px rgba(15, 23, 42, 0.42);
}

.panel-header {
  padding: 14px 16px 10px;
  border-bottom: 1px solid rgba(224, 233, 245, 0.86);
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.kicker {
  margin: 0;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #6c7f98;
  font-weight: 800;
}

.panel-header h3 {
  margin: 4px 0 0;
  font-size: 15px;
  color: #0f172a;
  letter-spacing: -0.02em;
}

.tag {
  min-height: 26px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #334155;
  border: 1px solid rgba(215, 226, 238, 0.92);
  background: rgba(248, 251, 255, 0.92);
  font-weight: 800;
}

.tag.streaming {
  color: #0f766e;
  border-color: rgba(13, 148, 136, 0.26);
  background: rgba(20, 184, 166, 0.12);
}

.panel-body {
  flex: 1;
  min-height: 0;
  padding: 12px 14px 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.signal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

.signal-console {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.signal-console-chip {
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid rgba(208, 220, 235, 0.94);
  background:
    linear-gradient(180deg, rgba(248, 251, 255, 0.96), rgba(243, 248, 253, 0.92));
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.signal-console-chip span {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.14em;
  font-weight: 800;
}

.signal-console-chip strong {
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
}

.signal-console-chip.ghost {
  background: rgba(255, 255, 255, 0.92);
}

.quick-row {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.quick-chip {
  min-height: 28px;
  padding: 0 11px;
  border-radius: 999px;
  border: 1px solid rgba(215, 226, 238, 0.92);
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  font-size: 10px;
  font-weight: 800;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease;
}

.quick-chip:hover {
  transform: translateY(-1px);
  border-color: rgba(148, 163, 184, 0.78);
  box-shadow: 0 10px 20px -18px rgba(15, 23, 42, 0.28);
}

.quick-chip:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.chat-box {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(214, 226, 240, 0.92);
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(248, 251, 255, 0.92));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.94);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.22) transparent;
  overscroll-behavior: contain;
}

.chat-empty-panel {
  margin: auto 0;
  border: 1px dashed rgba(214, 223, 235, 0.92);
  border-radius: 18px;
  padding: 18px 16px;
  background:
    radial-gradient(260px 140px at 50% 0%, rgba(125, 173, 252, 0.08), transparent 72%),
    rgba(255, 255, 255, 0.88);
  display: grid;
  place-items: center;
  text-align: center;
  gap: 6px;
}

.chat-empty-panel.loading {
  border-style: solid;
}

.chat-empty-kicker {
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.18em;
  color: #7b8a9b;
}

.chat-empty-panel strong {
  color: #0f172a;
  font-size: 15px;
}

.chat-empty-panel p {
  margin: 0;
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.history-tip {
  align-self: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 10px;
  color: #64748b;
  background: #f1f5f9;
}

.chat-row {
  display: flex;
  align-items: flex-end;
  gap: 9px;
}

.chat-row.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  background: linear-gradient(135deg, #dbe8fb, #cbdcf6);
  color: #1d467b;
}

.chat-row.ai .chat-avatar {
  background: linear-gradient(135deg, #dbeafe, #e0f2fe);
  color: #1e3a8a;
}

.chat-bubble {
  max-width: 82%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-name {
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #64748b;
  text-transform: uppercase;
}

.chat-row.user .chat-name {
  text-align: right;
}

.chat-text {
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  line-height: 1.58;
  font-size: 12px;
  padding: 10px 12px;
  border-radius: 16px;
  background: linear-gradient(180deg, #f8fbff, #f1f6fb);
  color: #0f172a;
  border-bottom-left-radius: 6px;
  border: 1px solid rgba(226, 233, 242, 0.92);
}

.chat-row.user .chat-text {
  background: linear-gradient(135deg, #e9f1ff, #dce8fb);
  color: #183a63;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 14px;
  border-color: rgba(205, 217, 235, 0.96);
}

.chat-input {
  flex-shrink: 0;
  display: grid;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #ecf1f7;
  background: rgba(255, 255, 255, 0.94);
}

.chat-input-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 10px;
  font-weight: 700;
  color: #7b8a9b;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.chat-input-row {
  display: flex;
  gap: 8px;
}

.chat-input input {
  flex: 1;
  border: 1px solid #dde5f1;
  background: #fff;
  border-radius: 13px;
  padding: 10px 12px;
  font-size: 12px;
  outline: none;
}

.chat-input input:focus {
  border-color: #0f172a;
}

.chat-send,
.chat-stop {
  border: 1px solid rgba(174, 190, 213, 0.92);
  background: linear-gradient(135deg, #e7f0ff, #d9e8fb);
  color: #173a66;
  padding: 0 13px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.chat-stop {
  background: linear-gradient(135deg, #f8fafd, #e9eef6);
  color: #516277;
  border-color: rgba(201, 211, 225, 0.96);
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.core-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

.core-stage {
  flex: 1;
  min-height: 320px;
  position: relative;
  border-radius: 22px;
  border: 1px solid rgba(214, 223, 235, 0.92);
  background:
    radial-gradient(320px 220px at 50% 40%, rgba(110, 231, 183, 0.18), transparent 64%),
    radial-gradient(360px 220px at 78% 18%, rgba(125, 173, 252, 0.16), transparent 66%),
    linear-gradient(180deg, #fbfdff, #f1f6fd);
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.92),
    0 20px 34px -30px rgba(15, 23, 42, 0.28);
}

.stage-aura,
.stage-center,
.stage-topline,
.stage-footer {
  position: absolute;
}

.stage-aura {
  inset: 14% 18% 20%;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.6), transparent 66%);
  filter: blur(12px);
  pointer-events: none;
}

.stage-center {
  inset: 0;
  display: grid;
  place-items: center;
  padding-top: 10px;
}

.stage-topline {
  left: 16px;
  right: 16px;
  top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  z-index: 1;
}

.stage-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid rgba(214, 223, 235, 0.92);
  background: rgba(255, 255, 255, 0.84);
  color: #334155;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.stage-chip.primary {
  background: linear-gradient(135deg, #e7f1ff, #dae8fb);
  color: #20466f;
  border-color: rgba(166, 187, 218, 0.9);
}

.stage-footer {
  left: 16px;
  right: 16px;
  bottom: 14px;
  z-index: 1;
  border-radius: 16px;
  border: 1px solid rgba(214, 223, 235, 0.92);
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(18px);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.stage-footer-copy {
  display: grid;
  gap: 3px;
  min-width: 0;
}

.stage-footer-copy strong {
  color: #0f172a;
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stage-footer-copy span {
  color: #64748b;
  font-size: 11px;
  line-height: 1.45;
}

.core-meta-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.core-meta-chip {
  border: 1px solid rgba(214, 223, 235, 0.92);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  padding: 10px 12px;
  display: grid;
  gap: 4px;
}

.core-meta-chip span {
  color: #7b8a9b;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.core-meta-chip strong {
  color: #0f172a;
  font-size: 13px;
}

.dock-jump:hover,
.dock-btn:hover,
.btn-close:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.3);
}

.music-dock {
  min-width: 0;
  border: 1px solid rgba(214, 223, 235, 0.94);
  border-radius: 18px;
  padding: 10px 10px;
  background:
    radial-gradient(240px 120px at 0% 0%, rgba(120, 225, 208, 0.14), transparent 72%),
    radial-gradient(260px 140px at 100% 0%, rgba(125, 173, 252, 0.16), transparent 74%),
    linear-gradient(160deg, rgba(255, 255, 255, 0.98), rgba(246, 250, 255, 0.95));
  display: grid;
  gap: 8px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.92);
  overflow: hidden;
}

.dock-jump {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(207, 218, 231, 0.92);
  background: rgba(255, 255, 255, 0.92);
  color: #334155;
  border-radius: 999px;
  height: 28px;
  min-width: 72px;
  padding: 0 12px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
}

.resonance-body {
  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 10px;
  min-height: 0;
  overflow: hidden;
}

.resonance-sub {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  line-height: 1.45;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dock-topline {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 10px;
  min-width: 0;
}

.dock-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: linear-gradient(135deg, #e7f0ff, #dae7fa);
  color: #21446a;
  border: 1px solid rgba(168, 188, 216, 0.9);
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 0.12em;
}

.dock-track {
  flex: 1;
  min-width: 0;
  display: -webkit-box;
  color: #0f172a;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.35;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: anywhere;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.dock-progress {
  width: 100%;
  min-width: 0;
  max-width: 100%;
}

.dock-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  min-width: 0;
  width: 100%;
}

.dock-btn {
  flex: 1 1 0;
  min-width: 0;
  height: 28px;
  border-radius: 10px;
  border: 1px solid rgba(207, 218, 231, 0.92);
  background: rgba(255, 255, 255, 0.94);
  color: #334155;
  font-size: 10px;
  font-weight: 700;
  padding: 0 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.dock-btn.primary {
  background: linear-gradient(135deg, #e7f0ff, #d8e7fa);
  border-color: rgba(167, 186, 214, 0.92);
  color: #173a66;
}

.dock-empty {
  min-height: 0;
  border: 1px dashed rgba(214, 223, 235, 0.96);
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.88);
  padding: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.dock-empty-copy {
  display: grid;
  gap: 4px;
}

.dock-empty-copy strong {
  color: #0f172a;
  font-size: 13px;
}

.dock-empty-copy span {
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

.dock-empty .dock-btn {
  min-width: 88px;
  padding: 0 12px;
}

.resonance-suggestion {
  border: 1px solid rgba(214, 223, 235, 0.92);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.86);
  padding: 12px;
  display: grid;
  gap: 4px;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
}

.resonance-suggestion strong {
  color: #0f172a;
  font-size: 12px;
}

.resonance-suggestion small {
  color: #64748b;
  font-size: 11px;
  line-height: 1.52;
}

.right-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  overscroll-behavior: contain;
}

.right-body::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.portal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 7px;
}

.portal-tile,
.portal-featured {
  border: 1px solid rgba(214, 223, 235, 0.92);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.86);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  cursor: pointer;
}

.portal-tile {
  min-height: 58px;
  border-radius: 16px;
  padding: 0 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
}

.portal-tile:hover,
.portal-featured:hover {
  background: linear-gradient(180deg, #ffffff, #f8fbff);
  border-color: #d4deeb;
  transform: translateY(-1px);
  box-shadow: 0 14px 26px -22px rgba(15, 23, 42, 0.28);
}

.portal-tile-copy {
  min-width: 0;
  display: grid;
  gap: 4px;
}

.portal-mainline {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.portal-title {
  min-width: 0;
  flex: 1;
  font-weight: 800;
  font-size: 14px;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 6px;
  white-space: nowrap;
}

.portal-title-text {
  min-width: 0;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.title-icon {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #27486f;
  background: rgba(206, 220, 239, 0.46);
  flex-shrink: 0;
}

.panel-resonance .panel-header > div {
  flex: 1;
  min-width: 0;
}

.panel-resonance .panel-header h3 {
  font-size: 12px;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portal-desc {
  font-size: 11px;
  color: #64748b;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.portal-heat {
  display: inline-flex;
  flex-shrink: 0;
  width: fit-content;
  min-height: 20px;
  padding: 0 8px;
  border-radius: 999px;
  border: 1px solid rgba(214, 223, 235, 0.9);
  background: rgba(245, 248, 252, 0.94);
  color: #475569;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.portal-link-text {
  flex-shrink: 0;
  color: #64748b;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.portal-featured {
  border-radius: 18px;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  text-align: left;
  background:
    radial-gradient(220px 140px at 100% 0%, rgba(125, 173, 252, 0.14), transparent 74%),
    radial-gradient(180px 120px at 0% 100%, rgba(120, 225, 208, 0.1), transparent 72%),
    rgba(255, 255, 255, 0.9);
}

.portal-featured-copy {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.portal-featured-title {
  display: flex;
  align-items: center;
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
}

.portal-featured-copy span:last-child {
  color: #64748b;
  font-size: 11px;
  line-height: 1.55;
}

.portal-link-text.featured {
  color: #35567d;
}

.portal-empty {
  border: 1px dashed rgba(214, 223, 235, 0.96);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.88);
  padding: 10px 12px;
  display: grid;
  gap: 3px;
}

.portal-empty strong {
  color: #0f172a;
  font-size: 12px;
}

.portal-empty span {
  color: #64748b;
  font-size: 11px;
  line-height: 1.5;
}

.portal-tip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  background: rgba(246, 249, 253, 0.92);
  border: 1px solid rgba(223, 231, 240, 0.92);
  color: #64748b;
  font-size: 10px;
  font-weight: 700;
}

.portal-tip-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #60a5fa;
  box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.12);
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  background:
    radial-gradient(1200px 900px at 70% 15%, rgba(45, 229, 143, 0.18), transparent 60%),
    radial-gradient(1000px 800px at 20% 85%, rgba(100, 140, 255, 0.18), transparent 60%),
    rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(16px) saturate(120%);
  -webkit-backdrop-filter: blur(16px) saturate(120%);
}

.modal-panel {
  width: min(1080px, calc(100vw - 48px));
  height: min(720px, calc(100vh - 120px));
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 40px 90px -30px rgba(0, 0, 0, 0.55);
  display: flex;
  flex-direction: column;
}

.modal-header {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px 0 20px;
  border-bottom: 1px solid rgba(228, 228, 231, 0.7);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(16px);
}

.modal-title {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-weight: 900;
  letter-spacing: 0.08em;
  font-size: 12px;
  text-transform: uppercase;
  color: #111827;
}

.modal-dot {
  width: 9px;
  height: 9px;
  border-radius: 99px;
  background: #3b82f6;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.14);
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  border: 1px solid #e4e4e7;
  background: rgba(255, 255, 255, 0.92);
  cursor: pointer;
}

.modal-body {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(12px);
}

@media (max-width: 1360px) {
  .app-main {
    overflow-y: auto;
  }

  .overview-strip {
    grid-template-columns: 1fr 1fr;
  }

  .overview-lead {
    grid-column: span 2;
  }

  .overview-actions {
    margin-top: 10px;
  }

  .layout-grid {
    flex: none;
    grid-template-columns: 1fr 1.06fr;
    grid-template-areas:
      'core sidebar'
      'signal sidebar';
    height: auto;
  }

  .stage-footer {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 980px) {
  .app-main {
    padding: 12px;
    overflow-y: auto;
  }

  .overview-strip {
    grid-template-columns: 1fr;
    margin-bottom: 12px;
  }

  .overview-lead {
    grid-column: auto;
    flex-direction: column;
    align-items: flex-start;
  }

  .overview-actions {
    width: 100%;
    flex-direction: column;
  }

  .layout-grid {
    flex: none;
    grid-template-columns: 1fr;
    grid-template-areas:
      'core'
      'signal'
      'sidebar';
    gap: 12px;
    height: auto;
  }

  .core-meta-grid,
  .dock-controls {
    grid-template-columns: 1fr;
  }

  .portal-grid {
    grid-template-columns: 1fr;
  }

  .chat-input-meta {
    flex-direction: column;
    align-items: flex-start;
  }

  .stage-footer {
    left: 12px;
    right: 12px;
    bottom: 12px;
    padding: 10px 12px;
  }

  .dock-empty {
    align-items: stretch;
    flex-direction: column;
  }

  .modal-panel {
    width: calc(100vw - 20px);
    height: calc(100vh - 44px);
    border-radius: 18px;
  }
}
</style>
