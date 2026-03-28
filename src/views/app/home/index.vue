<template>
  <div class="app-root">
    <header class="app-header">
      <div class="header-left">
        <div class="logo-box">〰️</div>
        <div class="logo-text">
          <span class="title">FREQUENCY</span>
          <span class="subtitle">Console</span>
        </div>
      </div>

      <div class="header-center">
        <span class="status-dot"></span>
        <span>SYSTEM ONLINE</span>
      </div>

      <div class="header-right">
        <button class="header-chip">
          <span class="chip-dot"></span>
          <span>{{ playing ? 'ECHO RHYTHM' : 'LIVE' }}</span>
        </button>
        <div class="settings-menu-container">
          <button class="header-btn" @click="showSettingsMenu = !showSettingsMenu">⚙️</button>
          <div v-if="showSettingsMenu" class="settings-menu">
            <div class="settings-menu-item" @click="handlePersonalInfo">个人信息</div>
            <div class="settings-menu-item" @click="handleSettings">设置</div>
            <div class="settings-menu-item" @click="handleLogout">退出登录</div>
          </div>
        </div>
      </div>
    </header>

    <main class="app-main">
      <div class="layout-grid">
        <section class="panel">
          <div class="panel-header">
            <div>
              <p class="kicker">SIGNAL MONITOR</p>
              <h3>{{ profile.name }} Dialogue</h3>
            </div>
            <span class="tag" :class="{ streaming: isStreaming }">{{ isStreaming ? 'STREAMING' : 'READY' }}</span>
          </div>

          <div class="panel-body signal-body">
            <div class="listening-holder">
              <p class="hint" :class="{ show: showListening }">LISTENING...</p>
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
                <div v-if="isLoadingHistory && !messages.length" class="chat-empty">加载历史记录中...</div>
                <div v-else-if="!messages.length" class="chat-empty">
                  点击上方快捷交互，或输入内容和 {{ profile.name }} 开始对话。
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
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <p class="kicker">STANDBY STAGE</p>
              <h3>{{ profile.name }}</h3>
            </div>
            <span class="tag">STANDBY</span>
          </div>

          <div class="panel-body core-body">
            <div class="core-stage">
              <EchoAvatar
                :name="profile.name"
                :mood="profile.mood"
                :palette="profile.palette"
                :species="profile.species"
                :accessory="profile.accessory"
                :speaking="isStreaming || playing"
                :show-label="true"
              />
            </div>

            <div class="core-meta">
              <div class="meta-row"><span>Signal</span><strong>{{ isStreaming ? 'Streaming' : 'Stable' }}</strong></div>
              <div class="meta-row"><span>Persona</span><strong>{{ profile.speechStyle }}</strong></div>
              <div class="meta-row"><span>Status</span><strong>{{ statusText }}</strong></div>
            </div>

            <div class="core-actions">
              <button class="btn-wake" @click="openCore">⚡ WAKE ECHO</button>
              <button class="btn-echo-core" @click="isEchoCoreActive = true">🧩 CUSTOM ECHO</button>
            </div>

            <section class="music-dock">
              <div class="dock-title-row">
                <div>
                  <p class="kicker">RESONANCE DOCK</p>
                  <h4>{{ currentTrack?.name || '尚未选择歌曲' }}</h4>
                </div>
                <button class="dock-jump" @click="router.push('/app/music')">音乐库</button>
              </div>

              <p class="dock-sub">
                {{ currentTrack ? `${formatTime(currentTime)} / ${formatTime(duration)}` : '把音乐融合进 Echo 对话氛围中。' }}
              </p>

              <div v-if="currentTrack" class="dock-progress-wrap">
                <input v-model.number="seekPercentProxy" class="dock-progress" type="range" min="0" max="100" step="0.1" />
                <div class="dock-controls">
                  <button class="dock-btn" @click="prevTrackFromDock">上一首</button>
                  <button class="dock-btn primary" @click="toggleMusicFromDock">{{ playing ? '暂停' : '播放' }}</button>
                  <button class="dock-btn" @click="nextTrackFromDock">下一首</button>
                </div>
              </div>

              <div v-else class="dock-empty">
                <button class="dock-btn primary" @click="router.push('/app/music')">去添加歌曲</button>
              </div>
            </section>
          </div>
        </section>

        <section class="panel">
          <div class="panel-header">
            <div>
              <p class="kicker">PORTAL</p>
              <h3>入口与分身状态</h3>
            </div>
          </div>

          <div class="panel-body right-body">
            <div class="mini-identity">
              <EchoAvatar
                :name="profile.name"
                :mood="profile.mood"
                :palette="profile.palette"
                :species="profile.species"
                :accessory="profile.accessory"
                :show-label="false"
                :small="true"
                :speaking="isStreaming"
              />

              <div class="identity-meta">
                <p class="identity-name">{{ profile.name }}</p>
                <p class="identity-detail">{{ profile.expertise || '暂无擅长领域设置' }}</p>
              </div>
            </div>

            <ul class="portal-list">
              <li v-for="p in portals" :key="p.name" class="portal-item" @click="handlePortalClick(p)">
                <div class="portal-left">
                  <span class="portal-icon">{{ p.icon }}</span>
                  <div class="portal-text">
                    <div class="portal-title">{{ p.name }}</div>
                    <div class="portal-desc">{{ p.desc }}</div>
                  </div>
                </div>
                <span class="portal-arrow">›</span>
              </li>
            </ul>
          </div>
        </section>
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
import { streamChat, getChatHistory, getMyProfile } from '@/api/business'
import AiCorePanel from './components/AiCorePanel.vue'
import EchoCore from './components/EchoCore.vue'
import EchoAvatar from './components/EchoAvatar.vue'
import Cookies from 'js-cookie'
import { Session } from '@/utils/storage'
import { useRouter } from 'vue-router'
import { showToast } from 'vant'
import { storeToRefs } from 'pinia'
import { useEchoPersonaStore } from '@/stores/echoPersona'
import { useMusicPlayerStore } from '@/stores/musicPlayer'

const portals = [
  { icon: '💕', name: 'Resonance', desc: 'Find Soulmate' },
  { icon: '🎓', name: 'Campus', desc: 'School Echoes' },
  { icon: '🎵', name: 'Music', desc: 'Echo Sound Dock' },
  { icon: '🔥', name: 'News', desc: 'Trending' },
  { icon: '🧠', name: 'EchoCore', desc: 'AI 分身工作台', action: 'echo-core' }
]

const isCoreActive = ref(false)
const isEchoCoreActive = ref(false)
const showSettingsMenu = ref(false)
const router = useRouter()

const echoStore = useEchoPersonaStore()
const musicPlayer = useMusicPlayerStore()
const { profile, statusText } = storeToRefs(echoStore)
const { currentTrack, currentTime, duration, playing, seekPercent, tracks } = storeToRefs(musicPlayer)

const quickInteractions = computed(() => [
  { label: '打个招呼', text: `${profile.value.name}，先和我打个招呼吧。` },
  { label: '今日建议', text: `以${profile.value.speechStyle}风格，给我一个今天可执行的提升建议。` },
  { label: '节奏聊天', text: '结合当前音乐氛围，陪我聊 1 分钟，语气轻松一点。' }
])

type ChatMessage = { role: 'user' | 'ai'; content: string; createTime?: string; timestamp?: number }
const userInput = ref('')
const isInputFocused = ref(false)
const messages = ref<ChatMessage[]>([])
const isStreaming = ref(false)

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
  document.addEventListener('click', handleClickOutside)
  await syncProfileFromBackend()
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
  document.removeEventListener('click', handleClickOutside)
  const el = chatScrollRef.value
  if (el) el.removeEventListener('scroll', handleScroll)
  stopCurrentTyping?.()
  if (streamController.value) streamController.value.abort()
})

const handleClickOutside = (e: MouseEvent) => {
  const target = e.target as HTMLElement
  if (!target.closest('.settings-menu-container')) {
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

const showListening = computed(() => {
  if (isStreaming.value) return false
  return isInputFocused.value || userInput.value.trim().length > 0
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
  isCoreActive.value = true
}

const closeCore = () => {
  isCoreActive.value = false
}

const handlePortalClick = (item: { action?: string; name?: string }) => {
  if (item.action === 'echo-core') {
    isEchoCoreActive.value = true
    return
  }
  if (item.name === 'Resonance') {
    router.push('/app/resonance')
    return
  }
  if (item.name === 'Music') {
    router.push('/app/music')
    return
  }
  if (item.name === 'Campus' || item.name === 'News') {
    router.push('/app/me')
  }
}

const stopStreaming = () => {
  stopCurrentTyping?.()
  streamController.value?.abort()
  streamController.value = null
  stopCurrentTyping = null
  isStreaming.value = false
}

const sendQuickMessage = async (text: string) => {
  userInput.value = text
  await sendMessage()
}

const sendMessage = async () => {
  const content = userInput.value.trim()
  if (!content || isStreaming.value) return

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
  }
}

const toggleMusicFromDock = () => {
  if (!currentTrack.value) {
    router.push('/app/music')
    return
  }
  void musicPlayer.togglePlay()
}

const prevTrackFromDock = () => {
  if (!tracks.value.length) {
    router.push('/app/music')
    return
  }
  void musicPlayer.prevTrack()
}

const nextTrackFromDock = () => {
  if (!tracks.value.length) {
    router.push('/app/music')
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(1200px 700px at 10% -10%, rgba(120, 225, 208, 0.18), transparent 50%),
    radial-gradient(1000px 700px at 95% 0%, rgba(125, 173, 252, 0.14), transparent 55%),
    #eef2f7;
  color: #1f2937;
  font-family: 'Space Grotesk', 'Noto Sans SC', sans-serif;
  overflow: hidden;
}

.app-header {
  height: 64px;
  flex-shrink: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.84);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
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
  border-radius: 10px;
  background: #0f172a;
  color: #fff;
  display: grid;
  place-items: center;
}

.logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1;
}

.logo-text .title {
  font-weight: 900;
  font-size: 14px;
  letter-spacing: -0.02em;
}

.logo-text .subtitle {
  font-size: 10px;
  color: #64748b;
  letter-spacing: 0.12em;
}

.header-center {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.1em;
  color: #0f172a;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 99px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.16);
}

.header-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e4eaf3;
  background: #fff;
  font-size: 11px;
  font-weight: 700;
  color: #0f172a;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 99px;
  background: #ef4444;
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.12);
}

.header-btn {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  border: 1px solid #dfe7f2;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
}

.header-btn:hover {
  background: #f8fafc;
}

.settings-menu-container {
  position: relative;
}

.settings-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  width: 180px;
  background: #fff;
  border: 1px solid #e4eaf3;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.08);
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
  background-color: #f8fafc;
}

.settings-menu-item:last-child {
  border-top: 1px solid #f1f5f9;
  color: #ef4444;
}

.settings-menu-item:last-child:hover {
  background-color: #fef2f2;
}

.app-main {
  flex: 1;
  min-height: 0;
  padding: 22px 30px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1.1fr 1.35fr 0.95fr;
  gap: 18px;
  height: 100%;
  max-width: 2000px;
  margin: 0 auto;
}

.panel {
  background: rgba(255, 255, 255, 0.78);
  border-radius: 24px;
  border: 1px solid rgba(226, 232, 240, 0.75);
  box-shadow: 0 10px 35px -30px rgba(15, 23, 42, 0.35);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(10px);
}

.panel {
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.panel:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px -28px rgba(15, 23, 42, 0.45);
}

.panel-header {
  padding: 16px 18px 12px;
  border-bottom: 1px solid rgba(231, 236, 244, 0.8);
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
  color: #64748b;
  font-weight: 700;
}

.panel-header h3 {
  margin: 4px 0 0;
  font-size: 15px;
  color: #0f172a;
}

.tag {
  height: 24px;
  border-radius: 999px;
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #334155;
  border: 1px solid #dce4ef;
  background: #f8fbff;
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
  padding: 14px 16px 16px;
}

.signal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.listening-holder {
  height: 20px;
  display: flex;
  align-items: center;
}

.hint {
  margin: 0;
  font-size: 11px;
  color: #64748b;
  letter-spacing: 0.14em;
  font-weight: 800;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.hint.show {
  opacity: 1;
}

.quick-row {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.quick-chip {
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #dce4ee;
  background: #fff;
  color: #334155;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
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
  border: 1px solid rgba(228, 234, 243, 0.9);
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.9);
  overflow: hidden;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scrollbar-width: thin;
  scrollbar-color: rgba(15, 23, 42, 0.22) transparent;
}

.chat-empty {
  margin: auto 0;
  color: #64748b;
  font-size: 12px;
  text-align: center;
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
  gap: 8px;
}

.chat-row.user {
  flex-direction: row-reverse;
}

.chat-avatar {
  width: 28px;
  height: 28px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
  background: #0f172a;
  color: #fff;
}

.chat-row.ai .chat-avatar {
  background: #dbeafe;
  color: #1e3a8a;
}

.chat-bubble {
  max-width: 80%;
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
  line-height: 1.45;
  font-size: 13px;
  padding: 9px 11px;
  border-radius: 14px;
  background: #f8fafc;
  color: #0f172a;
  border-bottom-left-radius: 6px;
}

.chat-row.user .chat-text {
  background: #0f172a;
  color: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 14px;
}

.chat-input {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding: 10px;
  border-top: 1px solid #ecf1f7;
  background: #fff;
}

.chat-input input {
  flex: 1;
  border: 1px solid #dde5f1;
  background: #fff;
  border-radius: 11px;
  padding: 9px 11px;
  font-size: 12px;
  outline: none;
}

.chat-input input:focus {
  border-color: #0f172a;
}

.chat-send,
.chat-stop {
  border: none;
  background: #0f172a;
  color: #fff;
  padding: 0 12px;
  border-radius: 11px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.chat-stop {
  background: #475569;
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.core-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.core-stage {
  min-height: 208px;
  border-radius: 18px;
  border: 1px solid #e5ecf4;
  background:
    radial-gradient(220px 160px at 50% 0%, rgba(110, 231, 183, 0.18), transparent 65%),
    linear-gradient(180deg, #f8fcff, #f2f8ff);
  display: grid;
  place-items: center;
  overflow: hidden;
}

.core-meta {
  border: 1px solid #e5edf6;
  border-radius: 14px;
  padding: 10px 12px;
  background: rgba(255, 255, 255, 0.86);
  display: grid;
  gap: 8px;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  font-size: 12px;
}

.meta-row span {
  color: #64748b;
}

.meta-row strong {
  color: #0f172a;
}

.core-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 9px;
}

.btn-wake,
.btn-echo-core {
  height: 42px;
  border-radius: 12px;
  border: 1px solid #d9e2ee;
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  font-size: 12px;
}

.btn-wake {
  background: #0f172a;
  color: #fff;
  border-color: #0f172a;
}

.music-dock {
  border: 1px solid #e3ebf4;
  border-radius: 16px;
  padding: 12px;
  background: linear-gradient(160deg, #fff, #f8fbff);
  display: grid;
  gap: 8px;
}

.dock-title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}

.dock-title-row h4 {
  margin: 4px 0 0;
  font-size: 14px;
  color: #0f172a;
  max-width: 260px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dock-jump {
  border: 1px solid #d7e1ec;
  background: #fff;
  color: #334155;
  border-radius: 999px;
  height: 28px;
  padding: 0 10px;
  font-size: 11px;
  cursor: pointer;
}

.dock-sub {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

.dock-progress-wrap {
  display: grid;
  gap: 10px;
}

.dock-progress {
  width: 100%;
}

.dock-controls {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.dock-btn {
  height: 32px;
  border-radius: 10px;
  border: 1px solid #d7e1ec;
  background: #fff;
  color: #334155;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.dock-btn.primary {
  background: #0f172a;
  border-color: #0f172a;
  color: #fff;
}

.right-body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
}

.mini-identity {
  border: 1px solid #e4ebf4;
  border-radius: 14px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
}

.identity-meta {
  min-width: 0;
}

.identity-name {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}

.identity-detail {
  margin: 4px 0 0;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  max-height: 34px;
  overflow: hidden;
}

.portal-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 8px;
}

.portal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e8edf5;
  background: #fff;
  border-radius: 14px;
  padding: 10px 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.portal-item:hover {
  background: #f8fbff;
  border-color: #d4deeb;
  transform: translateY(-1px);
}

.portal-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.portal-icon {
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e4eaf2;
  display: grid;
  place-items: center;
}

.portal-title {
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
}

.portal-desc {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
}

.portal-arrow {
  font-size: 18px;
  color: #9aa4b2;
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
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.35);
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
  background: #fff;
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
  .layout-grid {
    grid-template-columns: 1fr 1.25fr;
  }

  .panel:last-child {
    grid-column: span 2;
  }
}

@media (max-width: 980px) {
  .app-main {
    padding: 12px;
  }

  .app-header {
    padding: 0 12px;
  }

  .header-center {
    display: none;
  }

  .layout-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .panel:last-child {
    grid-column: auto;
  }

  .core-actions,
  .dock-controls {
    grid-template-columns: 1fr;
  }

  .modal-panel {
    width: calc(100vw - 20px);
    height: calc(100vh - 44px);
    border-radius: 18px;
  }
}
</style>
