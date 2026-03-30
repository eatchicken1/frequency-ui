import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type EchoMood = 'calm' | 'happy' | 'curious' | 'focus'
export type EchoPalette = 'mint' | 'sunset' | 'aurora' | 'mono' | 'rose' | 'forest' | 'neon'
export type EchoSpecies = 'spark' | 'cat' | 'fox' | 'orb' | 'bunny' | 'bear'
export type EchoAccessory = 'headset' | 'star' | 'halo' | 'glasses' | 'scarf' | 'leaf' | 'none'

export type EchoProfile = {
  name: string
  personaPrompt: string
  speechStyle: string
  expertise: string
  visibility: '私有' | '公开'
  mood: EchoMood
  palette: EchoPalette
  species: EchoSpecies
  accessory: EchoAccessory
  knowledgeCount: number
}

const STORAGE_KEY = 'frequency.echo.profile.v1'

const defaultProfile: EchoProfile = {
  name: 'Echo',
  personaPrompt: '你是一个温柔、可靠、会主动鼓励我的 AI 分身。回答要有结构，先给结论。',
  speechStyle: '温柔',
  expertise: '生活建议, 学习规划',
  visibility: '私有',
  mood: 'calm',
  palette: 'mint',
  species: 'spark',
  accessory: 'headset',
  knowledgeCount: 0
}

const moodWhitelist: EchoMood[] = ['calm', 'happy', 'curious', 'focus']
const paletteWhitelist: EchoPalette[] = ['mint', 'sunset', 'aurora', 'mono', 'rose', 'forest', 'neon']
const speciesWhitelist: EchoSpecies[] = ['spark', 'cat', 'fox', 'orb', 'bunny', 'bear']
const accessoryWhitelist: EchoAccessory[] = ['headset', 'star', 'halo', 'glasses', 'scarf', 'leaf', 'none']

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null

const normalizeProfile = (input: unknown): EchoProfile => {
  if (!isRecord(input)) {
    return { ...defaultProfile }
  }

  const toStringSafe = (key: keyof EchoProfile, fallback: string) => {
    const value = input[key]
    return typeof value === 'string' && value.trim() ? value.trim() : fallback
  }

  const toNumberSafe = (value: unknown, fallback = 0) => {
    const next = Number(value)
    return Number.isFinite(next) ? Math.max(0, Math.floor(next)) : fallback
  }

  const mood = moodWhitelist.includes(input.mood as EchoMood) ? (input.mood as EchoMood) : defaultProfile.mood
  const palette = paletteWhitelist.includes(input.palette as EchoPalette)
    ? (input.palette as EchoPalette)
    : defaultProfile.palette
  const species = speciesWhitelist.includes(input.species as EchoSpecies)
    ? (input.species as EchoSpecies)
    : defaultProfile.species
  const accessory = accessoryWhitelist.includes(input.accessory as EchoAccessory)
    ? (input.accessory as EchoAccessory)
    : defaultProfile.accessory

  return {
    name: toStringSafe('name', defaultProfile.name),
    personaPrompt: toStringSafe('personaPrompt', defaultProfile.personaPrompt),
    speechStyle: toStringSafe('speechStyle', defaultProfile.speechStyle),
    expertise: toStringSafe('expertise', defaultProfile.expertise),
    visibility: input.visibility === '公开' ? '公开' : '私有',
    mood,
    palette,
    species,
    accessory,
    knowledgeCount: toNumberSafe(input.knowledgeCount, defaultProfile.knowledgeCount)
  }
}

const readProfile = (): EchoProfile => {
  if (typeof window === 'undefined') return { ...defaultProfile }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...defaultProfile }
    return normalizeProfile(JSON.parse(raw))
  } catch {
    return { ...defaultProfile }
  }
}

const writeProfile = (value: EchoProfile) => {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // ignore storage write errors
  }
}

export const useEchoPersonaStore = defineStore('echoPersona', () => {
  const profile = ref<EchoProfile>(readProfile())
  const draft = ref<EchoProfile>({ ...profile.value })

  const saveDraft = (next?: Partial<EchoProfile>) => {
    draft.value = normalizeProfile({
      ...profile.value,
      ...draft.value,
      ...(next || {})
    })
  }

  const applyProfile = (next?: Partial<EchoProfile>) => {
    const merged = normalizeProfile({
      ...profile.value,
      ...draft.value,
      ...(next || {})
    })
    profile.value = merged
    draft.value = { ...merged }
    writeProfile(merged)
  }

  const resetProfile = () => {
    profile.value = { ...defaultProfile }
    draft.value = { ...defaultProfile }
    writeProfile(profile.value)
  }

  const statusText = computed(() => {
    if (profile.value.mood === 'happy') return '情绪高涨，互动活跃'
    if (profile.value.mood === 'curious') return '探索模式，偏好多问'
    if (profile.value.mood === 'focus') return '专注模式，回答更直接'
    return '情绪稳定，长期待机'
  })

  return {
    profile,
    draft,
    statusText,
    saveDraft,
    applyProfile,
    resetProfile
  }
})
