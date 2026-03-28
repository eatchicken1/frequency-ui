import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchMusicTrackBlob, listMusicTracks, uploadMusicTrack } from '@/api/business'

type Track = {
  id: string
  name: string
  url: string
  duration: number
  remote?: boolean
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

export const useMusicPlayerStore = defineStore('musicPlayer', () => {
  const tracks = ref<Track[]>([])
  const activeIndex = ref(0)
  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const seekPercent = ref(0)
  const volumePercent = ref(70)
  const remoteBlobCache = new Map<string, string>()

  const currentTrack = computed(() => tracks.value[activeIndex.value] || null)

  const audio = new Audio()
  audio.preload = 'metadata'
  audio.volume = volumePercent.value / 100

  const syncDuration = () => {
    const value = audio.duration || currentTrack.value?.duration || 0
    duration.value = Number.isFinite(value) ? value : 0
  }

  const syncTime = () => {
    currentTime.value = audio.currentTime || 0
    if (duration.value <= 0) {
      seekPercent.value = 0
      return
    }
    seekPercent.value = (currentTime.value / duration.value) * 100
  }

  audio.addEventListener('loadedmetadata', () => {
    syncDuration()
    syncTime()
  })

  audio.addEventListener('timeupdate', syncTime)

  audio.addEventListener('play', () => {
    playing.value = true
  })

  audio.addEventListener('pause', () => {
    playing.value = false
  })

  const resolveRemoteTrackUrl = async (track: Track) => {
    if (!track.id) {
      throw new Error('歌曲ID缺失，无法播放')
    }
    const cached = remoteBlobCache.get(track.id)
    if (cached) {
      return cached
    }
    const response = await fetchMusicTrackBlob(track.id)
    const raw = response?.data
    const blob = raw instanceof Blob ? raw : new Blob([raw], { type: 'audio/mpeg' })
    const blobUrl = URL.createObjectURL(blob)
    remoteBlobCache.set(track.id, blobUrl)
    return blobUrl
  }

  const loadCurrentTrack = async (autoplay = false) => {
    const track = currentTrack.value
    if (!track) {
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      currentTime.value = 0
      duration.value = 0
      seekPercent.value = 0
      return
    }

    const sourceUrl = track.remote ? await resolveRemoteTrackUrl(track) : track.url
    if (!sourceUrl) {
      throw new Error('未找到可播放地址')
    }
    audio.src = sourceUrl
    audio.load()
    duration.value = track.duration || 0
    currentTime.value = 0
    seekPercent.value = 0

    if (!autoplay) return

    try {
      await audio.play()
    } catch {
      playing.value = false
    }
  }

  const setActiveTrack = async (index: number, autoplay = playing.value) => {
    if (!tracks.value.length) return
    const normalizedIndex = (index + tracks.value.length) % tracks.value.length
    activeIndex.value = normalizedIndex
    await loadCurrentTrack(autoplay)
  }

  const addTracksFromFiles = async (files: FileList | File[]) => {
    const fileList = Array.from(files || [])
    if (!fileList.length) return

    const newTracks: Track[] = []
    for (const file of fileList) {
      const url = URL.createObjectURL(file)
      const tempAudio = new Audio(url)
      const trackDuration = await new Promise<number>((resolve) => {
        tempAudio.addEventListener('loadedmetadata', () => resolve(tempAudio.duration || 0), { once: true })
        tempAudio.addEventListener('error', () => resolve(0), { once: true })
      })

      newTracks.push({
        id: `${Date.now()}-${Math.random()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        url,
        duration: Number.isFinite(trackDuration) ? trackDuration : 0,
        remote: false
      })
    }

    const emptyBefore = tracks.value.length === 0
    tracks.value = [...tracks.value, ...newTracks]

    if (emptyBefore && tracks.value.length) {
      activeIndex.value = 0
      await loadCurrentTrack(false)
    }
  }

  const togglePlay = async () => {
    if (!currentTrack.value) return

    if (playing.value) {
      audio.pause()
      return
    }

    try {
      await audio.play()
    } catch {
      playing.value = false
    }
  }

  const playAt = async (index: number) => {
    await setActiveTrack(index, true)
  }

  const prevTrack = async () => {
    if (!tracks.value.length) return
    await setActiveTrack(activeIndex.value - 1, playing.value)
  }

  const nextTrack = async (forcePlay = false) => {
    if (!tracks.value.length) return
    await setActiveTrack(activeIndex.value + 1, forcePlay || playing.value)
  }

  audio.addEventListener('ended', () => {
    void nextTrack(true)
  })

  const setSeekPercent = (value: number) => {
    const next = clamp(value, 0, 100)
    seekPercent.value = next
    if (duration.value <= 0) return
    audio.currentTime = (next / 100) * duration.value
    currentTime.value = audio.currentTime || 0
  }

  const setVolumePercent = (value: number) => {
    const next = clamp(value, 0, 100)
    volumePercent.value = next
    audio.volume = next / 100
  }

  const estimateDuration = async (file: File) => {
    const url = URL.createObjectURL(file)
    const tempAudio = new Audio(url)
    const result = await new Promise<number>((resolve) => {
      tempAudio.addEventListener('loadedmetadata', () => resolve(tempAudio.duration || 0), { once: true })
      tempAudio.addEventListener('error', () => resolve(0), { once: true })
    })
    URL.revokeObjectURL(url)
    return Number.isFinite(result) ? Math.max(0, Math.floor(result)) : 0
  }

  const appendTrack = (track: Track) => {
    const exists = tracks.value.some((item) => item.id === track.id || (track.url && item.url === track.url))
    if (exists) return
    const emptyBefore = tracks.value.length === 0
    tracks.value = [...tracks.value, track]
    if (emptyBefore) {
      activeIndex.value = 0
      void loadCurrentTrack(false)
    }
  }

  const loadRemoteTracks = async () => {
    const response = await listMusicTracks(500)
    const data = response?.data?.data || []
    if (!Array.isArray(data)) return
    const mapped = data
      .filter((item) => typeof item?.fileUrl === 'string' && item.fileUrl)
      .map((item) => ({
        id: String(item.id),
        name: item.trackName || item.fileName || '未命名歌曲',
        url: item.fileUrl,
        duration: Number(item.durationSeconds || 0),
        remote: true
      }))
    if (!mapped.length) return
    tracks.value = mapped
    if (activeIndex.value >= tracks.value.length) {
      activeIndex.value = 0
    }
    await loadCurrentTrack(false)
  }

  const uploadAndAddTrack = async (file: File) => {
    const durationSeconds = await estimateDuration(file)
    const response = await uploadMusicTrack(file, durationSeconds)
    const payload = response?.data?.data
    if (!payload?.fileUrl) {
      throw new Error('上传失败：未返回文件地址')
    }
    appendTrack({
      id: String(payload.id),
      name: payload.trackName || payload.fileName || file.name.replace(/\.[^/.]+$/, ''),
      url: payload.fileUrl || '',
      duration: Number(payload.durationSeconds || 0),
      remote: true
    })
  }

  return {
    tracks,
    activeIndex,
    playing,
    currentTrack,
    currentTime,
    duration,
    seekPercent,
    volumePercent,
    addTracksFromFiles,
    togglePlay,
    playAt,
    prevTrack,
    nextTrack,
    setSeekPercent,
    setVolumePercent,
    loadRemoteTracks,
    uploadAndAddTrack
  }
})
