<template>
  <div class="music-shell">
    <header class="music-hero">
      <div class="hero-copy">
        <p class="kicker">MINI PLAYER</p>
        <h1>听歌</h1>
        <p class="hero-subtitle">把本地音乐接入 Echo 的节奏场，让待机、聊天和播放保持同一条频率线。</p>
      </div>
      <div class="hero-side">
        <div class="hero-badges">
          <span class="hero-pill">{{ currentTrack ? 'TRACK READY' : 'NO TRACK' }}</span>
          <span class="hero-pill subtle">{{ tracks.length }} 首已接入</span>
        </div>
        <label class="import-btn">
          导入歌曲
          <input type="file" accept="audio/*" multiple @change="onPickFiles" />
        </label>
      </div>
    </header>

    <section class="now-playing">
      <div class="cover">{{ currentTrack ? '♪' : '•' }}</div>
      <div class="meta">
        <h2>{{ currentTrack?.name || '还没有歌曲' }}</h2>
        <p>{{ currentTrack ? formatDuration(currentTrack.duration) : '请导入本地音频文件' }}</p>
      </div>
    </section>

    <section class="controls">
      <button class="ctrl-btn" @click="prevTrack" :disabled="!tracks.length">上一首</button>
      <button class="ctrl-btn primary" @click="togglePlay" :disabled="!currentTrack">
        {{ playing ? '暂停' : '播放' }}
      </button>
      <button class="ctrl-btn" @click="nextTrack" :disabled="!tracks.length">下一首</button>
    </section>

    <section class="progress-panel">
      <span>{{ formatTime(currentTime) }}</span>
      <input
        v-model.number="seekPercentProxy"
        type="range"
        min="0"
        max="100"
        step="0.1"
        :disabled="!currentTrack"
      />
      <span>{{ formatTime(duration) }}</span>
    </section>

    <section class="volume-panel">
      <span>音量</span>
      <input v-model.number="volumePercentProxy" type="range" min="0" max="100" />
      <span>{{ volumePercent }}%</span>
    </section>

    <section class="playlist">
      <h3>播放列表</h3>
      <div v-if="!tracks.length" class="empty">暂无歌曲</div>
      <button
        v-for="(track, index) in tracks"
        :key="track.id"
        class="track-row"
        :class="{ active: index === activeIndex }"
        @click="playAt(index)"
      >
        <span>{{ track.name }}</span>
        <small>{{ formatDuration(track.duration) }}</small>
      </button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { showToast } from 'vant'
import { useMusicPlayerStore } from '@/stores/musicPlayer'

const playerStore = useMusicPlayerStore()
const { tracks, activeIndex, playing, currentTime, duration, seekPercent, volumePercent, currentTrack } = storeToRefs(playerStore)
const { togglePlay, playAt, prevTrack, nextTrack } = playerStore

onMounted(async () => {
  try {
    await playerStore.loadRemoteTracks()
  } catch (error: any) {
    showToast(error?.message || '加载音乐列表失败')
  }
})

const seekPercentProxy = computed({
  get: () => seekPercent.value,
  set: (value: number) => playerStore.setSeekPercent(value)
})

const volumePercentProxy = computed({
  get: () => volumePercent.value,
  set: (value: number) => playerStore.setVolumePercent(value)
})

const onPickFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = input.files
  if (!files || !files.length) return

  for (const file of Array.from(files)) {
    try {
      await playerStore.uploadAndAddTrack(file)
    } catch (error: any) {
      showToast(error?.message || `上传失败：${file.name}`)
    }
  }

  input.value = ''
}

const formatTime = (seconds: number) => {
  const value = Math.max(0, Math.floor(seconds || 0))
  const m = Math.floor(value / 60)
  const s = value % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

const formatDuration = (seconds: number) => formatTime(seconds)
</script>

<style scoped>
.music-shell {
  min-height: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 14px 24px;
  display: grid;
  gap: 12px;
  color: #17233b;
  font-family: "Space Grotesk", "Noto Sans SC", sans-serif;
}

.music-hero {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  padding: 18px;
  border: 1px solid #dbe4f0;
  border-radius: 20px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.94), rgba(244, 249, 255, 0.86));
  box-shadow: 0 24px 48px -36px rgba(23, 35, 59, 0.32);
}

.hero-copy {
  min-width: 0;
}

.hero-side {
  display: grid;
  justify-items: end;
  gap: 10px;
}

.hero-badges {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
}

.kicker {
  margin: 0;
  font-size: 11px;
  letter-spacing: 0.18em;
  color: #6e7d95;
  font-weight: 800;
  text-transform: uppercase;
}

.music-hero h1 {
  margin: 4px 0 0;
  font-size: 30px;
  line-height: 1.04;
}

.hero-subtitle {
  margin: 10px 0 0;
  max-width: 520px;
  color: #61738f;
  font-size: 13px;
  line-height: 1.6;
}

.hero-pill {
  display: inline-flex;
  align-items: center;
  min-height: 30px;
  padding: 0 10px;
  border-radius: 999px;
  border: 1px solid #d8e2ef;
  background: #ffffff;
  color: #0f172a;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.hero-pill.subtle {
  background: #f4f7fb;
  color: #5b6b82;
}

.import-btn {
  border: 1px solid #cfd8e8;
  background: #fff;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 12px;
  cursor: pointer;
}

.import-btn input {
  display: none;
}

.now-playing,
.controls,
.progress-panel,
.volume-panel,
.playlist {
  border: 1px solid #d6e0ef;
  border-radius: 14px;
  padding: 12px;
  background: #fff;
}

.now-playing {
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 10px;
  align-items: center;
}

.cover {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: grid;
  place-items: center;
  font-size: 22px;
  background: linear-gradient(135deg, #2f78ef, #4db7f1);
  color: #fff;
}

.meta h2 {
  margin: 0;
  font-size: 15px;
}

.meta p {
  margin: 4px 0 0;
  font-size: 12px;
  color: #6c7d97;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
}

.ctrl-btn {
  border: 1px solid #cad7ea;
  background: #fff;
  border-radius: 10px;
  padding: 8px;
  font-size: 12px;
  cursor: pointer;
}

.ctrl-btn.primary {
  background: #2f78ef;
  border-color: #2f78ef;
  color: #fff;
}

.ctrl-btn:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.progress-panel,
.volume-panel {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #5f728f;
}

.progress-panel input,
.volume-panel input {
  width: 100%;
}

.playlist h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.empty {
  font-size: 12px;
  color: #70839f;
}

.track-row {
  width: 100%;
  border: 1px solid #d5dff0;
  background: #f9fbff;
  border-radius: 10px;
  padding: 8px 10px;
  margin-bottom: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  cursor: pointer;
}

.track-row.active {
  border-color: #2f78ef;
  background: #ecf3ff;
}

.track-row span {
  max-width: 82%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.track-row small {
  font-size: 11px;
  color: #6f819a;
}

@media (prefers-color-scheme: dark) {
  .music-shell {
    color: #dfebff;
  }

  .music-hero {
    background: linear-gradient(135deg, rgba(19, 31, 51, 0.92), rgba(16, 28, 45, 0.94));
    border-color: #304867;
    box-shadow: 0 24px 48px -36px rgba(0, 0, 0, 0.52);
  }

  .kicker {
    color: #9bb0d2;
  }

  .hero-subtitle,
  .hero-pill.subtle {
    color: #9cb0cf;
  }

  .hero-pill {
    background: #162743;
    border-color: #36557d;
    color: #dce8ff;
  }

  .import-btn,
  .now-playing,
  .controls,
  .progress-panel,
  .volume-panel,
  .playlist {
    background: #131f33;
    border-color: #304867;
  }

  .meta p,
  .progress-panel,
  .volume-panel,
  .track-row small,
  .empty {
    color: #9cb0cf;
  }

  .ctrl-btn {
    background: #162743;
    border-color: #36557d;
    color: #d6e5ff;
  }

  .ctrl-btn.primary {
    background: #4a88e9;
    border-color: #4a88e9;
    color: #fff;
  }

  .track-row {
    background: #17263f;
    border-color: #314f73;
    color: #dce9ff;
  }

  .track-row.active {
    background: #1d3354;
    border-color: #5c96ee;
  }
}

@media (max-width: 720px) {
  .music-hero {
    flex-direction: column;
    padding: 16px;
  }

  .hero-side {
    width: 100%;
    justify-items: stretch;
  }

  .hero-badges {
    justify-content: flex-start;
  }

  .import-btn {
    text-align: center;
  }
}
</style>
