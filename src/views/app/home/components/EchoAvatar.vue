<template>
  <div
    class="echo-avatar"
    :class="[
      `palette-${palette}`,
      `mood-${mood}`,
      `species-${species}`,
      { small, speaking, breathing }
    ]"
    role="img"
    :aria-label="`${name} avatar`"
  >
    <div class="avatar-halo"></div>
    <div class="avatar-core">
      <div class="face">
        <div class="eyes">
          <span class="eye"></span>
          <span class="eye"></span>
        </div>
        <div class="mouth" :class="mood"></div>
      </div>
      <span v-if="species === 'cat'" class="ear ear-left"></span>
      <span v-if="species === 'cat'" class="ear ear-right"></span>
      <span v-if="species === 'fox'" class="fox-mask"></span>
      <span v-if="species === 'orb'" class="orb-ring"></span>

      <span v-if="accessory === 'headset'" class="accessory headset"></span>
      <span v-if="accessory === 'star'" class="accessory star">✦</span>
      <span v-if="accessory === 'halo'" class="accessory halo"></span>
    </div>

    <div v-if="showLabel" class="avatar-label">
      <strong>{{ name }}</strong>
      <span>{{ moodText }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { EchoAccessory, EchoMood, EchoPalette, EchoSpecies } from '@/stores/echoPersona'

const moodTextMap: Record<EchoMood, string> = {
  calm: '待机',
  happy: '开心',
  curious: '好奇',
  focus: '专注'
}

const props = withDefaults(
  defineProps<{
    name?: string
    mood?: EchoMood
    palette?: EchoPalette
    species?: EchoSpecies
    accessory?: EchoAccessory
    speaking?: boolean
    breathing?: boolean
    showLabel?: boolean
    small?: boolean
  }>(),
  {
    name: 'Echo',
    mood: 'calm',
    palette: 'mint',
    species: 'spark',
    accessory: 'headset',
    speaking: false,
    breathing: true,
    showLabel: false,
    small: false
  }
)

const moodText = computed(() => moodTextMap[props.mood || 'calm'])
</script>

<style scoped>
.echo-avatar {
  --bg1: #75d9b9;
  --bg2: #8fd8ff;
  --ink: #12353a;
  --shell: rgba(255, 255, 255, 0.82);
  display: grid;
  justify-items: center;
  gap: 8px;
  position: relative;
}

.avatar-halo {
  width: 154px;
  height: 154px;
  border-radius: 999px;
  background: radial-gradient(circle at center, color-mix(in oklab, var(--bg1) 45%, transparent), transparent 68%);
  filter: blur(3px);
  transition: transform 220ms ease;
}

.avatar-core {
  position: absolute;
  top: 18px;
  width: 118px;
  height: 118px;
  border-radius: 999px;
  background: linear-gradient(150deg, var(--bg1), var(--bg2));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 18px 34px -22px rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
}

.face {
  width: 62px;
  height: 50px;
  border-radius: 28px;
  background: var(--shell);
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 8px;
}

.eyes {
  display: flex;
  align-items: center;
  gap: 12px;
}

.eye {
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: var(--ink);
}

.mouth {
  width: 20px;
  height: 7px;
  border-bottom: 2px solid var(--ink);
  border-radius: 0 0 12px 12px;
}

.mouth.happy {
  border-bottom-width: 3px;
}

.mouth.focus {
  border-bottom-width: 0;
  border-top: 2px solid var(--ink);
  border-radius: 12px 12px 0 0;
}

.mouth.curious {
  width: 12px;
  height: 12px;
  border: 2px solid var(--ink);
  border-radius: 999px;
}

.ear {
  position: absolute;
  top: -6px;
  width: 18px;
  height: 18px;
  background: color-mix(in oklab, var(--bg2) 80%, #fff 20%);
  transform: rotate(45deg);
  border-radius: 3px;
}

.ear-left {
  left: 20px;
}

.ear-right {
  right: 20px;
}

.fox-mask {
  position: absolute;
  inset: 21px;
  border-radius: 28px;
  border: 2px dashed color-mix(in oklab, var(--ink) 35%, transparent);
}

.orb-ring {
  position: absolute;
  inset: -6px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklab, var(--ink) 25%, transparent);
}

.accessory {
  position: absolute;
}

.headset {
  width: 84px;
  height: 52px;
  border: 3px solid rgba(15, 23, 42, 0.55);
  border-bottom: 0;
  border-radius: 80px 80px 0 0;
  top: 10px;
}

.star {
  right: 14px;
  top: 4px;
  color: #fef08a;
  text-shadow: 0 0 8px rgba(254, 240, 138, 0.8);
  font-size: 18px;
}

.halo {
  top: -8px;
  width: 64px;
  height: 13px;
  border-radius: 999px;
  border: 2px solid rgba(255, 241, 118, 0.9);
  background: rgba(255, 249, 194, 0.42);
}

.avatar-label {
  margin-top: 120px;
  display: grid;
  justify-items: center;
  gap: 1px;
}

.avatar-label strong {
  font-size: 14px;
  color: #111827;
}

.avatar-label span {
  font-size: 11px;
  color: #64748b;
}

.echo-avatar.speaking .eye {
  animation: blink 1.8s ease-in-out infinite;
}

.echo-avatar.speaking .avatar-core {
  animation: floatSpeak 1s ease-in-out infinite;
}

.echo-avatar.breathing .avatar-halo {
  animation: haloBreath 3.2s ease-in-out infinite;
}

.echo-avatar.small .avatar-halo {
  width: 106px;
  height: 106px;
}

.echo-avatar.small .avatar-core {
  top: 10px;
  width: 80px;
  height: 80px;
}

.echo-avatar.small .face {
  width: 44px;
  height: 34px;
  gap: 5px;
}

.echo-avatar.small .eye {
  width: 5px;
  height: 5px;
}

.echo-avatar.small .mouth {
  width: 14px;
}

.echo-avatar.small .avatar-label {
  margin-top: 84px;
}

.palette-mint {
  --bg1: #69d6b3;
  --bg2: #8ad6f6;
  --ink: #0d3b42;
}

.palette-sunset {
  --bg1: #ff9871;
  --bg2: #ffc674;
  --ink: #5b2d16;
}

.palette-aurora {
  --bg1: #70ccff;
  --bg2: #9b8dff;
  --ink: #1f1d5b;
}

.palette-mono {
  --bg1: #d1d5db;
  --bg2: #9ca3af;
  --ink: #1f2937;
}

@keyframes haloBreath {
  0%,
  100% {
    transform: scale(0.96);
    opacity: 0.7;
  }

  50% {
    transform: scale(1.05);
    opacity: 1;
  }
}

@keyframes floatSpeak {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-3px);
  }
}

@keyframes blink {
  0%,
  92%,
  100% {
    transform: scaleY(1);
  }

  94%,
  98% {
    transform: scaleY(0.15);
  }
}
</style>
