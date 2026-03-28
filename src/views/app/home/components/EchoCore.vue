<template>
  <div v-if="visible" class="ec-modal" role="dialog" aria-modal="true">
    <div class="ec-shell">
      <div class="ec-card-top">
        <div class="ec-status-strip">
          <span class="ec-status-pill">
            <span class="ec-dot"></span>
            <span>STANDBY LINKED</span>
          </span>
          <span class="ec-status-copy">编辑中的设定会直接作用于主页分身与对话风格</span>
        </div>
      </div>

      <div class="ec-card-body">
        <div class="ec-grid">
          <section class="ec-left">
            <div class="ec-tabs">
              <button class="ec-tab" :class="{ active: tab === 'persona' }" type="button" @click="tab = 'persona'">
                分身设定
              </button>
              <button class="ec-tab" :class="{ active: tab === 'knowledge' }" type="button" @click="tab = 'knowledge'">
                知识仓
              </button>
            </div>

            <div class="ec-left-content">
              <div class="ec-toggle-row">
                <button type="button" class="ec-mini-toggle" @click="setCurrentSections(true)">全部展开</button>
                <button type="button" class="ec-mini-toggle" @click="setCurrentSections(false)">全部收起</button>
              </div>

              <div v-if="tab === 'persona'" class="ec-pane">
                <section class="ec-section">
                  <button
                    type="button"
                    class="ec-section-head"
                    :class="{ open: sectionOpen.persona }"
                    @click="toggleSection('persona')"
                  >
                    <span class="ec-section-title">人格设定</span>
                    <span class="ec-section-arrow" :class="{ open: sectionOpen.persona }">⌄</span>
                  </button>

                  <div v-show="sectionOpen.persona" class="ec-section-body">
                    <div class="ec-block">
                      <div class="ec-label">分身名</div>
                      <input v-model="form.name" class="ec-input" placeholder="例如：小回声 / 夜航 Echo" />
                    </div>

                    <div class="ec-block">
                      <div class="ec-label">人格 Prompt</div>
                      <textarea
                        v-model="form.personaPrompt"
                        class="ec-textarea"
                        placeholder="描述它说话方式、情绪风格、边界和习惯。"
                      />
                    </div>

                    <div class="ec-row-2">
                      <div class="ec-block">
                        <div class="ec-label">语气风格</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="style in styles"
                            :key="style"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.speechStyle === style }"
                            @click="form.speechStyle = style"
                          >
                            {{ style }}
                          </button>
                        </div>
                      </div>

                      <div class="ec-block">
                        <div class="ec-label">可见性</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="v in visibilities"
                            :key="v"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.visibility === v }"
                            @click="form.visibility = v"
                          >
                            {{ v }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="ec-block">
                      <div class="ec-label">擅长领域</div>
                      <input
                        v-model="form.expertise"
                        class="ec-input"
                        placeholder="例如：学习规划, 情绪陪伴, 写作"
                      />
                    </div>
                  </div>
                </section>

                <section class="ec-section">
                  <button
                    type="button"
                    class="ec-section-head"
                    :class="{ open: sectionOpen.appearance }"
                    @click="toggleSection('appearance')"
                  >
                    <span class="ec-section-title">形象设定</span>
                    <span class="ec-section-arrow" :class="{ open: sectionOpen.appearance }">⌄</span>
                  </button>

                  <div v-show="sectionOpen.appearance" class="ec-section-body">
                    <div class="ec-row-2">
                      <div class="ec-block">
                        <div class="ec-label">情绪状态</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="item in moodOptions"
                            :key="item.value"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.mood === item.value }"
                            @click="form.mood = item.value"
                          >
                            {{ item.label }}
                          </button>
                        </div>
                      </div>

                      <div class="ec-block">
                        <div class="ec-label">配色主题</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="item in paletteOptions"
                            :key="item.value"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.palette === item.value }"
                            @click="form.palette = item.value"
                          >
                            {{ item.label }}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div class="ec-row-2">
                      <div class="ec-block">
                        <div class="ec-label">形象种类</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="item in speciesOptions"
                            :key="item.value"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.species === item.value }"
                            @click="form.species = item.value"
                          >
                            {{ item.label }}
                          </button>
                        </div>
                      </div>

                      <div class="ec-block">
                        <div class="ec-label">配件</div>
                        <div class="ec-chip-row">
                          <button
                            v-for="item in accessoryOptions"
                            :key="item.value"
                            type="button"
                            class="ec-chip"
                            :class="{ active: form.accessory === item.value }"
                            @click="form.accessory = item.value"
                          >
                            {{ item.label }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div v-else class="ec-pane">
                <section class="ec-section">
                  <button
                    type="button"
                    class="ec-section-head"
                    :class="{ open: sectionOpen.knowledge }"
                    @click="toggleSection('knowledge')"
                  >
                    <span class="ec-section-title">知识仓</span>
                    <span class="ec-section-arrow" :class="{ open: sectionOpen.knowledge }">⌄</span>
                  </button>

                  <div v-show="sectionOpen.knowledge" class="ec-section-body">
                    <div class="ec-block">
                      <div class="ec-label">上传知识文件</div>
                      <div class="ec-desc">上传后会进入分身知识库，并参与后续回答生成。</div>

                      <div class="ec-upload-row">
                        <input ref="fileInput" class="ec-file" type="file" multiple @change="onPickFiles" />
                        <button class="ec-btn ec-btn-ghost" type="button" @click="triggerPick">选择文件</button>
                        <span class="ec-upload-note">共 {{ mergedKnowledgeCount }} 份资料</span>
                      </div>

                      <div v-if="files.length" class="ec-file-list">
                        <div v-for="(f, idx) in files" :key="f.key" class="ec-file-item">
                          <div>
                            <p class="ec-file-name" :title="f.file.name">{{ f.file.name }}</p>
                            <p class="ec-file-size">{{ formatSize(f.file.size) }}</p>
                          </div>
                          <button type="button" class="ec-mini-btn" @click="removeFile(idx)">删除</button>
                        </div>
                      </div>
                    </div>

                    <div class="ec-tip">
                      现在支持在主页 STANDBY 区展示你的定制形象，并在对话区体现个性语气。
                    </div>
                  </div>
                </section>
              </div>
            </div>
          </section>

          <aside class="ec-right">
            <div class="ec-right-title">实时预览</div>
            <EchoAvatar
              :name="form.name"
              :mood="form.mood"
              :palette="form.palette"
              :species="form.species"
              :accessory="form.accessory"
              :speaking="false"
              :show-label="true"
            />

            <div class="ec-stat-grid">
              <div class="ec-stat">
                <span>语气</span>
                <strong>{{ form.speechStyle }}</strong>
              </div>
              <div class="ec-stat">
                <span>资料</span>
                <strong>{{ mergedKnowledgeCount }}</strong>
              </div>
              <div class="ec-stat">
                <span>可见性</span>
                <strong>{{ form.visibility }}</strong>
              </div>
            </div>

            <p class="ec-tip compact">
              点击“应用到 STANDBY”后，主页中间 Echo 分身会立即更新。
            </p>
          </aside>
        </div>
      </div>

      <footer class="ec-footer">
        <button class="ec-btn ec-btn-ghost" type="button" @click="onSave">保存草稿</button>
        <button class="ec-btn ec-btn-primary" type="button" :disabled="applying" @click="onApply">
          {{ applying ? '同步中...' : '应用到 STANDBY' }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { showToast } from 'vant'
import EchoAvatar from './EchoAvatar.vue'
import { updateMyProfile, trainKnowledgeFile, getMyProfile } from '@/api/business'
import {
  type EchoAccessory,
  type EchoMood,
  type EchoPalette,
  type EchoProfile,
  type EchoSpecies,
  useEchoPersonaStore
} from '@/stores/echoPersona'

type FileItem = { key: string; file: File }

type MoodOption = { value: EchoMood; label: string }
type PaletteOption = { value: EchoPalette; label: string }
type SpeciesOption = { value: EchoSpecies; label: string }
type AccessoryOption = { value: EchoAccessory; label: string }
type SectionKey = 'persona' | 'appearance' | 'knowledge'

const props = defineProps<{ modelValue?: boolean }>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'save', payload: EchoProfile): void
  (e: 'apply', payload: EchoProfile): void
}>()

const visible = computed(() => props.modelValue ?? false)
const tab = ref<'persona' | 'knowledge'>('persona')
const echoStore = useEchoPersonaStore()
const form = ref<EchoProfile>({ ...echoStore.profile })
const fileInput = ref<HTMLInputElement | null>(null)
const files = ref<FileItem[]>([])
const applying = ref(false)
const sectionOpen = ref<Record<SectionKey, boolean>>({
  persona: true,
  appearance: true,
  knowledge: true
})

const styles = ['幽默', '严肃', '温柔', '冷静', '鼓励型'] as const
const visibilities: EchoProfile['visibility'][] = ['私有', '公开']
const moodOptions: MoodOption[] = [
  { value: 'calm', label: '平静' },
  { value: 'happy', label: '活跃' },
  { value: 'curious', label: '好奇' },
  { value: 'focus', label: '专注' }
]
const paletteOptions: PaletteOption[] = [
  { value: 'mint', label: '薄荷' },
  { value: 'sunset', label: '落日' },
  { value: 'aurora', label: '极光' },
  { value: 'mono', label: '灰阶' }
]
const speciesOptions: SpeciesOption[] = [
  { value: 'spark', label: '火花体' },
  { value: 'cat', label: '猫猫体' },
  { value: 'fox', label: '狐灵体' },
  { value: 'orb', label: '球灵体' }
]
const accessoryOptions: AccessoryOption[] = [
  { value: 'headset', label: '耳机' },
  { value: 'star', label: '星标' },
  { value: 'halo', label: '光环' },
  { value: 'none', label: '无' }
]

const mergedKnowledgeCount = computed(() => {
  const base = Math.max(0, Number(form.value.knowledgeCount || 0))
  return base + files.value.length
})

const resetWithProfile = () => {
  form.value = { ...echoStore.profile }
  files.value = []
  tab.value = 'persona'
  sectionOpen.value = {
    persona: true,
    appearance: true,
    knowledge: true
  }
}

watch(
  () => visible.value,
  (next) => {
    if (next) resetWithProfile()
  },
  { immediate: true }
)

const triggerPick = () => {
  fileInput.value?.click()
}

const toggleSection = (key: SectionKey) => {
  sectionOpen.value[key] = !sectionOpen.value[key]
}

const setCurrentSections = (expanded: boolean) => {
  if (tab.value === 'persona') {
    sectionOpen.value.persona = expanded
    sectionOpen.value.appearance = expanded
    return
  }
  sectionOpen.value.knowledge = expanded
}

const onPickFiles = (event: Event) => {
  const input = event.target as HTMLInputElement
  const picked = Array.from(input.files || [])
  if (!picked.length) return

  const existing = new Set(files.value.map((item) => item.key))
  for (const file of picked) {
    const key = `${file.name}-${file.size}-${file.lastModified}`
    if (!existing.has(key)) {
      files.value.push({ key, file })
      existing.add(key)
    }
  }

  input.value = ''
}

const removeFile = (index: number) => {
  files.value.splice(index, 1)
}

const formatSize = (bytes: number) => {
  const units = ['B', 'KB', 'MB', 'GB'] as const
  let value = bytes
  let i = 0
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024
    i += 1
  }
  return `${value.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

const payloadProfile = (): EchoProfile => ({
  ...form.value,
  knowledgeCount: mergedKnowledgeCount.value
})

const onSave = () => {
  const payload = payloadProfile()
  echoStore.saveDraft(payload)
  emit('save', payload)
  showToast('已保存草稿')
}

const toBackendProfilePayload = () => {
  const tags = String(form.value.expertise || '')
    .split(/[,，]/)
    .map((item) => item.trim())
    .filter(Boolean)
    .join(',')

  return {
    nickname: form.value.name || 'Echo',
    personalityPrompt: form.value.personaPrompt || '',
    voiceTone: form.value.speechStyle || '',
    tags,
    isPublic: form.value.visibility === '公开' ? 'Y' : 'N',
    avatar: `${form.value.species}:${form.value.palette}:${form.value.accessory}:${form.value.mood}`
  }
}

const extractUserIdFromToken = () => {
  const token = window.document?.cookie
    ?.split('; ')
    ?.find((item) => item.startsWith('access_token='))
    ?.split('=')
    ?.slice(1)
    ?.join('=')

  if (!token || !token.includes('.')) return null
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1] || ''))
    const candidates = [payload.user_id, payload.userId, payload.id, payload.uid, payload.sub]
    const matched = candidates.find((v) => v !== undefined && v !== null && `${v}`.trim() !== '')
    return matched ?? null
  } catch {
    return null
  }
}

const resolveUserId = async () => {
  const tokenId = extractUserIdFromToken()
  if (tokenId !== null && tokenId !== undefined && `${tokenId}`.trim() !== '') return tokenId

  try {
    const res = await getMyProfile()
    const data = res?.data?.data ?? res?.data ?? {}
    const candidates = [data.userId, data.id, data.echoId]
    const matched = candidates.find((v) => v !== undefined && v !== null && `${v}`.trim() !== '')
    return matched ?? null
  } catch {
    return null
  }
}

const onApply = async () => {
  if (applying.value) return
  applying.value = true

  try {
    const payload = payloadProfile()
    const baseKnowledgeCount = Math.max(0, Number(echoStore.profile.knowledgeCount || 0))
    const userId = await resolveUserId()

    try {
      await updateMyProfile(toBackendProfilePayload())
    } catch (error) {
      console.warn('更新分身资料失败，已保留本地配置', error)
    }

    let successUploads = 0
    let uploadBlockedByUserId = false
    if (files.value.length) {
      if (userId === null || userId === undefined || `${userId}`.trim() === '') {
        uploadBlockedByUserId = true
      }

      for (const item of files.value) {
        if (uploadBlockedByUserId) break
        try {
          await trainKnowledgeFile(item.file, userId)
          successUploads += 1
        } catch (error) {
          console.error(`知识文件上传失败: ${item.file.name}`, error)
        }
      }
    }

    const finalPayload = {
      ...payload,
      knowledgeCount: baseKnowledgeCount + successUploads
    }

    echoStore.applyProfile(finalPayload)
    files.value = []
    emit('apply', finalPayload)
    if (uploadBlockedByUserId) {
      showToast('已同步分身设定，但未解析到用户 ID，知识文件未上传')
    } else if (successUploads > 0) {
      showToast(`已同步并上传 ${successUploads} 份知识文件`)
    } else {
      showToast('已同步到主页 STANDBY')
    }
  } finally {
    applying.value = false
  }
}
</script>

<style scoped>
.ec-modal {
  width: 100%;
  height: 100%;
  min-height: 0;
}

.ec-shell {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 24px;
  background:
    linear-gradient(180deg, rgba(247, 249, 252, 0.96), rgba(242, 245, 249, 0.96));
  border: 1px solid rgba(198, 208, 222, 0.8);
  box-shadow: 0 36px 72px -34px rgba(15, 23, 42, 0.46);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ec-card-top {
  padding: 18px 24px 10px;
  border-bottom: 1px solid rgba(222, 229, 237, 0.88);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.78), rgba(255, 255, 255, 0.42));
}

.ec-status-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
}

.ec-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 34px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #cdd6e1;
  background: #ffffff;
  color: #0f172a;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.ec-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #22c55e;
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.12);
}

.ec-status-copy {
  color: #526173;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-align: right;
}

.ec-card-body {
  flex: 1;
  min-height: 0;
  padding: 10px 24px 0;
  overflow: hidden;
}

.ec-grid {
  height: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.88fr);
  gap: 20px;
  min-width: 0;
  min-height: 0;
  align-items: stretch;
  padding-bottom: 12px;
}

.ec-left,
.ec-right {
  min-width: 0;
}

.ec-left {
  border-radius: 16px;
  border: 1px solid #d7dee8;
  background: #ffffff;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.82);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.18) transparent;
}

.ec-tabs {
  padding: 14px 14px 10px;
  display: flex;
  gap: 10px;
  border-bottom: 1px solid #edf2f7;
  background: #f3f6fa;
}

.ec-left-content {
  flex: 1;
  min-height: 0;
  padding: 8px 14px 14px;
}

.ec-toggle-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding: 0 2px 10px;
}

.ec-mini-toggle {
  height: 26px;
  border-radius: 9px;
  border: 1px solid #d1d9e4;
  background: #f7f9fc;
  color: #334155;
  font-size: 11px;
  font-weight: 800;
  padding: 0 10px;
  cursor: pointer;
}

.ec-section {
  border: 1px solid #d9e1eb;
  border-radius: 10px;
  background: #fff;
  overflow: hidden;
}

.ec-section-head {
  width: 100%;
  border: 0;
  border-bottom: 1px solid #e7edf4;
  background: linear-gradient(180deg, #f6f8fb, #eef3f8);
  color: #0f172a;
  padding: 11px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  cursor: pointer;
}

.ec-section-head.open {
  background: linear-gradient(180deg, #eef3f8, #e8eef6);
}

.ec-section-title {
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 0.04em;
}

.ec-section-arrow {
  font-size: 14px;
  color: #64748b;
  transform: rotate(0deg);
  transition: transform 0.2s ease;
}

.ec-section-arrow.open {
  transform: rotate(180deg);
}

.ec-section-body {
  padding: 12px;
  display: grid;
  gap: 12px;
}

.ec-tab {
  height: 34px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d6dee8;
  background: #fff;
  color: #475569;
  cursor: pointer;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.ec-tab.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.ec-pane {
  display: grid;
  gap: 12px;
}

.ec-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.ec-block {
  border: 1px solid #dfe6ef;
  border-radius: 10px;
  padding: 12px;
  background: linear-gradient(180deg, #ffffff, #fbfcfe);
}

.ec-label {
  font-weight: 800;
  font-size: 13px;
  color: #0f172a;
}

.ec-desc {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

.ec-input,
.ec-textarea {
  margin-top: 10px;
  width: 100%;
  border-radius: 8px;
  border: 1px solid #d7dfeb;
  background: #fff;
  color: #0f172a;
  padding: 10px 12px;
  outline: none;
}

.ec-textarea {
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
}

.ec-input:focus,
.ec-textarea:focus {
  border-color: #0f172a;
  box-shadow: inset 0 0 0 1px #0f172a;
}

.ec-chip-row {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.ec-chip {
  height: 30px;
  border-radius: 8px;
  border: 1px solid #d5dde8;
  background: #f8fafc;
  padding: 0 12px;
  font-weight: 800;
  font-size: 12px;
  color: #334155;
  cursor: pointer;
}

.ec-chip.active {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.ec-upload-row {
  margin-top: 10px;
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 8px 10px;
}

.ec-upload-note {
  font-size: 12px;
  color: #64748b;
  grid-column: 1 / -1;
}

.ec-file {
  position: absolute;
  pointer-events: none;
  opacity: 0;
}

.ec-file-list {
  margin-top: 12px;
  display: grid;
  gap: 8px;
}

.ec-file-item {
  border: 1px solid #dbe3ed;
  border-radius: 10px;
  background: #f9fbfd;
  padding: 10px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 10px;
}

.ec-file-name {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
  max-width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ec-file-size {
  margin: 2px 0 0;
  color: #64748b;
  font-size: 11px;
}

.ec-mini-btn {
  border: 1px solid #d5dde8;
  background: #fff;
  color: #334155;
  border-radius: 8px;
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  cursor: pointer;
}

.ec-tip {
  border: 1px solid #d8e3ef;
  background: linear-gradient(180deg, #f5f8fc, #edf3f9);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 12px;
  color: #405264;
  line-height: 1.5;
  font-weight: 700;
}

.ec-tip.compact {
  margin-top: 16px;
}

.ec-right {
  border-radius: 16px;
  border: 1px solid #cfd8e3;
  background:
    linear-gradient(180deg, #f2f5f9, #e9eef5);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.75);
  padding: 16px;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  touch-action: pan-y;
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.18) transparent;
}

.ec-left::-webkit-scrollbar,
.ec-right::-webkit-scrollbar {
  width: 6px;
}

.ec-left::-webkit-scrollbar-track,
.ec-right::-webkit-scrollbar-track {
  background: transparent;
}

.ec-left::-webkit-scrollbar-thumb,
.ec-right::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.16);
  border-radius: 999px;
  border: 1px solid transparent;
}

.ec-left::-webkit-scrollbar-thumb:hover,
.ec-right::-webkit-scrollbar-thumb:hover {
  background: rgba(100, 116, 139, 0.24);
}

.ec-right-title {
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.ec-stat-grid {
  margin-top: 10px;
  display: grid;
  gap: 8px;
}

.ec-stat {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 11px;
  border-radius: 9px;
  border: 1px solid #d5dde8;
  background: #fff;
}

.ec-stat span {
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.ec-stat strong {
  color: #0f172a;
  font-size: 13px;
}

.ec-footer {
  border-top: 1px solid #e7ebf1;
  padding: 14px 22px 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  background: linear-gradient(180deg, #f8fafc, #eef2f7);
}

.ec-btn {
  height: 38px;
  border-radius: 10px;
  padding: 0 16px;
  font-weight: 800;
  font-size: 13px;
  border: 1px solid transparent;
  cursor: pointer;
}

.ec-btn-ghost {
  border-color: #d1d9e4;
  background: #ffffff;
  color: #0f172a;
}

.ec-btn-primary {
  background: #111827;
  color: #fff;
  border-color: #111827;
}

.ec-btn:disabled {
  opacity: 0.62;
  cursor: not-allowed;
}

@media (max-width: 980px) {
  .ec-card-top {
    padding: 16px 16px 10px;
  }

  .ec-status-strip {
    align-items: flex-start;
    flex-direction: column;
  }

  .ec-status-copy {
    text-align: left;
  }

  .ec-card-body {
    padding: 8px 14px 0;
  }

  .ec-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .ec-right {
    order: -1;
    padding: 12px;
  }

  .ec-row-2 {
    grid-template-columns: 1fr;
  }

  .ec-footer {
    padding: 12px 14px 14px;
    justify-content: stretch;
  }

  .ec-btn {
    flex: 1;
    min-width: 0;
  }

  .ec-toggle-row {
    justify-content: space-between;
    padding-bottom: 8px;
  }
}
</style>
