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
        <button class="header-chip">
          <span class="chip-dot"></span>
          <span>LIVE</span>
        </button>
        <button class="header-btn">⚙️</button>
      </div>
    </header>

    <main class="app-main">
      <div class="layout-grid">
        <section class="panel panel-hover">
          <div class="panel-header">SIGNAL MONITOR</div>
          <div class="panel-body center signal-body">
            <div class="wave">
              <span v-for="i in 5" :key="i"></span>
            </div>

            <!-- LISTENING 固定占位层（防止挤压聊天） -->
            <div class="listening-holder">
              <p class="hint" :class="{ show: showListening }">LISTENING…</p>
            </div>

            <div class="chat-box" @click.stop>
              <div ref="chatScrollRef" class="chat-messages">
                <div
                  v-for="(message, index) in messages"
                  :key="index"
                  :class="['chat-row', message.role]"
                >
                  <div class="chat-avatar">
                    {{ message.role === 'user' ? 'U' : 'E' }}
                  </div>

                  <div class="chat-bubble">
                    <div class="chat-name">{{ message.role === 'user' ? 'me' : 'myEcho' }}</div>
                    <p class="chat-text">{{ message.content }}</p>
                  </div>
                </div>
              </div>

              <div class="chat-input">
                <input
                  v-model="userInput"
                  type="text"
                  placeholder="输入内容..."
                  @focus="isInputFocused = true"
                  @blur="isInputFocused = false"
                  @keyup.enter="sendMessage"
                  :disabled="isStreaming"
                />
                <button class="chat-send" @click="sendMessage" :disabled="isStreaming || !userInput.trim()">
                  发送
                </button>
              </div>
            </div>
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

            <div class="core-meta">
              <div class="meta-row">
                <span class="meta-label">Signal</span>
                <span class="meta-value">Stable</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Latency</span>
                <span class="meta-value">12ms</span>
              </div>
              <div class="meta-row">
                <span class="meta-label">Band</span>
                <span class="meta-value">Harmonic</span>
              </div>
            </div>

            <div class="core-actions">
              <button class="btn-wake" @click="openCore">
                <span class="icon">⚡</span>
                <span>WAKE ECHO</span>
              </button>
              <button class="btn-echo-core" @click="isEchoCoreActive = true">
                <span class="icon">🧠</span>
                <span>ECHOCORE</span>
              </button>
            </div>
          </div>
        </section>

        <section class="panel panel-hover">
          <div class="panel-header">PORTAL</div>
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
        </section>
      </div>

      <Teleport to="body">
        <Transition name="modal-fade">
          <div v-if="isCoreActive" class="modal-backdrop" @click.self="closeCore">
            <div class="modal-panel" @click.stop>
              <div class="modal-header">
                <div class="modal-title">
                  <span class="modal-dot"></span>
                  <span>Echo Core</span>
                </div>
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
                <div class="modal-title">
                  <span class="modal-dot"></span>
                  <span>EchoCore</span>
                </div>
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
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { streamChat } from '@/api/business'
import AiCorePanel from './components/AiCorePanel.vue'
import EchoCore from './components/EchoCore.vue'

// --- Data ---
const portals = [
  { icon: '💕', name: 'Resonance', desc: 'Find Soulmate' },
  { icon: '🎓', name: 'Campus', desc: 'School Echoes' },
  { icon: '🔥', name: 'News', desc: 'Trending' },
  { icon: '🧠', name: 'EchoCore', desc: 'AI 分身', action: 'echo-core' }
]

// --- State ---
const isCoreActive = ref(false)
const isEchoCoreActive = ref(false)

type ChatMessage = { role: 'user' | 'ai'; content: string }
const userInput = ref('')
const isInputFocused = ref(false)
const messages = ref<ChatMessage[]>([])
const isStreaming = ref(false)

const chatScrollRef = ref<HTMLElement | null>(null)
const streamController = ref<AbortController | null>(null)

let stopCurrentTyping: (() => void) | null = null

// 我输入时显示 LISTENING…；AI 回复(流式)时隐藏
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
    scrollToBottom()
  },
  { deep: true }
)

// --- Actions ---
const openCore = () => {
  isCoreActive.value = true
}

const closeCore = () => {
  isCoreActive.value = false
}

const handlePortalClick = (item: { action?: string }) => {
  if (item.action === 'echo-core') {
    isEchoCoreActive.value = true
  }
}

const sendMessage = async () => {
  const content = userInput.value.trim()
  if (!content || isStreaming.value) return

  // stop previous typing/stream if any
  stopCurrentTyping?.()
  stopCurrentTyping = null

  if (streamController.value) {
    streamController.value.abort()
    streamController.value = null
  }

  userInput.value = ''
  messages.value.push({ role: 'user', content })
  messages.value.push({ role: 'ai', content: '' })

  const currentIndex = messages.value.length - 1

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
      typingTimer = window.setTimeout(typeNextChar, 18)
      return
    }

    stopTyping()
  }

  try {
    // 获取或生成会话ID
    const conversationId = sessionStorage.getItem('currentConversationId') || String(Date.now());
    sessionStorage.setItem('currentConversationId', conversationId);

    await streamChat({
      echoId: '1',
      query: content,
      conversationId: conversationId,
      signal: controller.signal,
      onMessage: (chunk: string) => {
        fullText += chunk

        // 第一次收到流式内容，启动打字机
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
        isStreaming.value = false
      },
      onComplete: () => {
        // flush
        stopTyping()
        messages.value[currentIndex] = {
          ...messages.value[currentIndex],
          content: fullText
        }
        isStreaming.value = false
      }
    })
  } catch (err: any) {
    stopTyping()
    messages.value[currentIndex] = {
      ...messages.value[currentIndex],
      content: err?.message || '系统繁忙，请稍后重试。'
    }
    isStreaming.value = false
  }
}

onBeforeUnmount(() => {
  stopCurrentTyping?.()
  if (streamController.value) streamController.value.abort()
})
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

.header-center { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; color: #18181b; }
.status-dot { width: 8px; height: 8px; border-radius: 99px; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.16); }

.header-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border-radius: 999px; border: 1px solid #e4e4e7; background: white; font-size: 12px; cursor: default; }
.chip-dot { width: 6px; height: 6px; border-radius: 99px; background: #ef4444; box-shadow: 0 0 0 4px rgba(239,68,68,0.12); }
.header-btn { width: 34px; height: 34px; border-radius: 12px; border: 1px solid #e4e4e7; background: white; cursor: pointer; }

/* ================= Main Layout ================= */
.app-main {
  flex: 1;
  min-height: 0;
  padding: 24px 32px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 1fr 1.6fr 1fr;
  gap: 24px;
  height: 100%;
  max-width: 2000px;
  margin: 0 auto;
}

/* ================= Left: Chat (WeChat-like) ================= */
.signal-body {
  align-items: stretch;
  justify-content: flex-start;
  gap: 12px;
  min-height: 0;
  overflow: hidden;
}

/* ===== LISTENING 固定占位，防止顶聊天 ===== */
.listening-holder {
  height: 22px;              /* 固定预留高度 */
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hint {
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.hint.show {
  opacity: 1;
}


.chat-box {
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.chat-messages {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 4px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  scroll-behavior: smooth;
  /* 隐藏滚动条 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* Chrome, Safari and Opera */
.chat-messages::-webkit-scrollbar {
  width: 0;
  height: 0;
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
  background: #111827;
  color: #fff;
}

.chat-row.ai .chat-avatar {
  background: #e5e7eb;
  color: #111827;
}

.chat-bubble {
  max-width: 78%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.chat-name {
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 0.08em;
  color: #6b7280;
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
  padding: 10px 12px;
  border-radius: 14px;
  background: #f3f4f6;
  color: #111827;
  border-bottom-left-radius: 6px;
}

.chat-row.user .chat-text {
  background: #111827;
  color: #fff;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 14px;
}

.chat-input {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid #e4e4e7;
}

.chat-input input {
  flex: 1;
  border: 1px solid #e4e4e7;
  background: #fff;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 12px;
  outline: none;
}

.chat-input input:focus {
  border-color: #111827;
}

.chat-send {
  border: none;
  background: #111827;
  color: #fff;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 12px;
  cursor: pointer;
  white-space: nowrap;
}

.chat-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s;
}

.panel-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -10px rgba(0,0,0,0.1);
}

.panel-header {
  padding: 18px 24px;
  border-bottom: 1px solid #f4f4f5;
  font-size: 12px;
  letter-spacing: 0.12em;
  font-weight: 800;
  color: #111827;
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
.wave span:nth-child(4) { height: 40%; animation-delay: 0.3s; }
.wave span:nth-child(5) { height: 20%; animation-delay: 0.4s; }

@keyframes wave {
  0%, 100% { transform: scaleY(0.4); opacity: 0.5; }
  50% { transform: scaleY(1); opacity: 1; }
}

.hint {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
  letter-spacing: 0.2em;
  font-weight: 700;
  margin-bottom: 8px;
}

/* ================= Middle: Core ================= */
.panel-core .core-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 26px;
  gap: 18px;
}

.core-wrapper {
  display: grid;
  place-items: center;
  position: relative;
  padding: 30px 0 22px;
}

.core-glow {
  position: absolute;
  width: 240px;
  height: 240px;
  border-radius: 999px;
  background: radial-gradient(circle at center, rgba(59,130,246,0.22), rgba(59,130,246,0) 60%);
  filter: blur(6px);
  animation: breathe 3.2s ease-in-out infinite;
}

.core {
  width: 160px;
  height: 160px;
  border-radius: 999px;
  border: 1px solid #e4e4e7;
  background: linear-gradient(180deg, #ffffff, #fafafa);
  display: grid;
  place-items: center;
  gap: 10px;
  box-shadow: 0 20px 40px -25px rgba(0,0,0,0.35);
  position: relative;
}

.emoji-entity { font-size: 38px; }
.core-state {
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: #111827;
}

.core-meta {
  display: grid;
  gap: 10px;
  border: 1px solid #f4f4f5;
  border-radius: 16px;
  padding: 14px 16px;
  background: #fafafa;
}

.meta-row { display: flex; justify-content: space-between; font-size: 12px; color: #52525b; }
.meta-label { color: #71717a; }
.meta-value { font-weight: 700; color: #111827; }

.core-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-wake, .btn-echo-core {
  height: 44px;
  border-radius: 14px;
  border: 1px solid #e4e4e7;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-weight: 800;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-wake:hover, .btn-echo-core:hover { border-color: #111827; transform: translateY(-1px); }
.btn-wake { background: #111827; color: white; border-color: #111827; }
.btn-wake:hover { filter: brightness(1.05); }

.btn-echo-core { background: white; color: #111827; }

/* ================= Right: Portal ================= */
.portal-list {
  list-style: none;
  margin: 0;
  padding: 16px;
  display: grid;
  gap: 10px;
}

.portal-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #f4f4f5;
  background: #fafafa;
  border-radius: 16px;
  padding: 12px 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.portal-item:hover {
  background: white;
  border-color: #e4e4e7;
  transform: translateY(-1px);
}

.portal-left { display: flex; align-items: center; gap: 12px; }
.portal-icon { width: 36px; height: 36px; border-radius: 14px; background: white; border: 1px solid #e4e4e7; display: grid; place-items: center; }
.portal-text { display: flex; flex-direction: column; }
.portal-title { font-weight: 800; font-size: 13px; color: #111827; }
.portal-desc { font-size: 11px; color: #71717a; margin-top: 2px; }
.portal-arrow { font-size: 18px; color: #a1a1aa; }

/* ================= Modal ================= */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  backdrop-filter: blur(8px);
  display: grid;
  place-items: center;
  z-index: 1000;
}

.modal-panel {
  width: min(1080px, calc(100vw - 48px));
  height: min(720px, calc(100vh - 120px));
  background: rgba(255,255,255,0.92);
  border: 1px solid rgba(255,255,255,0.35);
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 40px 90px -30px rgba(0,0,0,0.55);
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
  border-bottom: 1px solid rgba(228,228,231,0.7);
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
  box-shadow: 0 0 0 4px rgba(59,130,246,0.14);
}

.btn-close {
  width: 36px;
  height: 36px;
  border-radius: 14px;
  border: 1px solid #e4e4e7;
  background: white;
  cursor: pointer;
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
