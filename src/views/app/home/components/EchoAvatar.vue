<template>
  <div
    class="echo-avatar"
    :class="[
      `palette-${palette}`,
      `mood-${mood}`,
      `species-${species}`,
      `mode-${mode}`,
      { small, speaking, breathing }
    ]"
    :style="lookStyle"
    role="img"
    :aria-label="`${name} avatar`"
  >
    <div class="avatar-halo"></div>
    <div class="avatar-stage">
      <span class="limb arm arm-left"></span>
      <span class="limb arm arm-right"></span>

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
        <span v-if="species === 'bunny'" class="ear bunny-ear ear-left"></span>
        <span v-if="species === 'bunny'" class="ear bunny-ear ear-right"></span>
        <span v-if="species === 'bear'" class="ear bear-ear ear-left"></span>
        <span v-if="species === 'bear'" class="ear bear-ear ear-right"></span>
        <span v-if="species === 'fox'" class="fox-mask"></span>
        <span v-if="species === 'orb'" class="orb-ring"></span>

        <span v-if="accessory === 'headset'" class="accessory headset"></span>
        <span v-if="accessory === 'star'" class="accessory star">✦</span>
        <span v-if="accessory === 'halo'" class="accessory halo"></span>
        <span v-if="accessory === 'glasses'" class="accessory glasses"></span>
        <span v-if="accessory === 'scarf'" class="accessory scarf"></span>
        <span v-if="accessory === 'leaf'" class="accessory leaf">🍃</span>
      </div>

      <span class="limb leg leg-left"></span>
      <span class="limb leg leg-right"></span>
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

type AvatarMode = 'idle' | 'listening' | 'thinking' | 'replying' | 'grooving'
type AvatarLookDirection = 'center' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right'

const moodTextMap: Record<EchoMood, string> = {
  calm: '待机',
  happy: '开心',
  curious: '好奇',
  focus: '专注'
}

const lookMap: Record<AvatarLookDirection, { x: string; y: string; faceTilt: string; coreTilt: string }> = {
  center: { x: '0px', y: '0px', faceTilt: '0deg', coreTilt: '0deg' },
  left: { x: '-3px', y: '0px', faceTilt: '-4deg', coreTilt: '-2deg' },
  right: { x: '3px', y: '0px', faceTilt: '4deg', coreTilt: '2deg' },
  'up-left': { x: '-3px', y: '-2px', faceTilt: '-5deg', coreTilt: '-3deg' },
  'up-right': { x: '3px', y: '-2px', faceTilt: '5deg', coreTilt: '3deg' },
  'down-left': { x: '-2px', y: '2px', faceTilt: '-3deg', coreTilt: '-2deg' },
  'down-right': { x: '2px', y: '2px', faceTilt: '3deg', coreTilt: '2deg' }
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
    mode?: AvatarMode
    lookDirection?: AvatarLookDirection
    musicEnergy?: number
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
    small: false,
    mode: 'idle',
    lookDirection: 'center',
    musicEnergy: 0
  }
)

const moodText = computed(() => moodTextMap[props.mood || 'calm'])
const lookStyle = computed(() => {
  const look = lookMap[props.lookDirection || 'center']
  const groove = Math.max(0, Math.min(1, Number(props.musicEnergy || 0)))
  const grooveShift = `${(groove * 10).toFixed(2)}px`
  const grooveScale = (1 + groove * 0.12).toFixed(3)
  return {
    '--look-x': look.x,
    '--look-y': look.y,
    '--face-tilt': look.faceTilt,
    '--core-tilt': look.coreTilt,
    '--groove-shift': grooveShift,
    '--groove-scale': grooveScale
  }
})
</script>

<style scoped>
.echo-avatar {
  --bg1: #75d9b9;
  --bg2: #8fd8ff;
  --ink: #12353a;
  --shell: rgba(255, 255, 255, 0.82);
  --look-x: 0px;
  --look-y: 0px;
  --face-tilt: 0deg;
  --core-tilt: 0deg;
  --groove-shift: 0px;
  --groove-scale: 1;
  display: grid;
  justify-items: center;
  gap: 8px;
  position: relative;
  min-width: 154px;
}

.avatar-halo {
  width: 154px;
  height: 154px;
  border-radius: 999px;
  background: radial-gradient(circle at center, color-mix(in oklab, var(--bg1) 45%, transparent), transparent 68%);
  filter: blur(3px);
  transition: transform 220ms ease, opacity 220ms ease;
}

.avatar-stage {
  position: absolute;
  inset: 0;
  animation: idleFloat 5.8s ease-in-out infinite;
}

.limb {
  position: absolute;
  display: block;
  background: linear-gradient(180deg, color-mix(in oklab, var(--bg1) 78%, #fff 22%), color-mix(in oklab, var(--bg2) 78%, #fff 22%));
  border: 1px solid rgba(255, 255, 255, 0.42);
  box-shadow: 0 10px 18px -16px rgba(15, 23, 42, 0.42);
  transition: transform 220ms ease, opacity 220ms ease;
  opacity: 0.9;
}

.arm {
  top: 62px;
  width: 14px;
  height: 42px;
  border-radius: 999px;
  z-index: 0;
  transform-origin: 50% 8px;
}

.arm-left {
  left: 14px;
  transform: rotate(18deg);
}

.arm-right {
  right: 14px;
  transform: rotate(-18deg);
}

.leg {
  top: 128px;
  width: 14px;
  height: 24px;
  border-radius: 12px 12px 16px 16px;
  z-index: 0;
  transform-origin: 50% 4px;
}

.leg-left {
  left: 48px;
  transform: rotate(6deg);
}

.leg-right {
  right: 48px;
  transform: rotate(-6deg);
}

.avatar-core {
  position: absolute;
  top: 18px;
  left: 18px;
  width: 118px;
  height: 118px;
  border-radius: 999px;
  background: linear-gradient(150deg, var(--bg1), var(--bg2));
  border: 1px solid rgba(255, 255, 255, 0.62);
  box-shadow: 0 18px 34px -22px rgba(0, 0, 0, 0.45);
  display: grid;
  place-items: center;
  z-index: 1;
  transform: rotate(var(--core-tilt));
  transition: transform 220ms ease;
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
  transform: rotate(var(--face-tilt));
  transition: transform 220ms ease;
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
  transform: translate(var(--look-x), var(--look-y));
  transition: transform 220ms ease, height 180ms ease, width 180ms ease;
}

.mouth {
  width: 20px;
  height: 7px;
  border-bottom: 2px solid var(--ink);
  border-radius: 0 0 12px 12px;
  transition: transform 180ms ease, width 180ms ease, height 180ms ease;
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

.bunny-ear {
  width: 12px;
  height: 28px;
  border-radius: 999px;
  transform: none;
  top: -14px;
}

.bear-ear {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  transform: none;
  top: -4px;
  background: color-mix(in oklab, var(--bg1) 72%, #fff 28%);
  border: 1px solid rgba(255, 255, 255, 0.42);
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

.glasses {
  width: 52px;
  height: 18px;
  top: 47px;
  border-top: 2px solid color-mix(in oklab, var(--ink) 65%, transparent);
  border-radius: 8px;
}

.glasses::before,
.glasses::after {
  content: '';
  position: absolute;
  top: -2px;
  width: 16px;
  height: 12px;
  border: 2px solid color-mix(in oklab, var(--ink) 65%, transparent);
  border-radius: 7px;
}

.glasses::before {
  left: 2px;
}

.glasses::after {
  right: 2px;
}

.scarf {
  width: 62px;
  height: 16px;
  bottom: 22px;
  border-radius: 999px;
  background: linear-gradient(135deg, color-mix(in oklab, var(--bg1) 32%, #fff 68%), color-mix(in oklab, var(--bg2) 35%, #fff 65%));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.leaf {
  right: 18px;
  top: 6px;
  font-size: 14px;
  filter: drop-shadow(0 2px 3px rgba(15, 23, 42, 0.18));
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

.echo-avatar.speaking:not(.mode-replying):not(.mode-grooving) .avatar-stage {
  animation: floatSpeak 1s ease-in-out infinite;
}

.echo-avatar.breathing .avatar-halo {
  animation: haloBreath 3.2s ease-in-out infinite;
}

.echo-avatar.mode-idle .eye {
  animation: curiousBlink 6.6s ease-in-out infinite;
}

.echo-avatar.mode-idle.mood-happy .avatar-stage {
  animation-duration: 4.6s;
}

.echo-avatar.mode-idle.mood-curious .face {
  animation: curiousTilt 4.4s ease-in-out infinite;
}

.echo-avatar.mode-idle.mood-focus .arm-left,
.echo-avatar.mode-idle.mood-focus .arm-right {
  opacity: 0.82;
}

.echo-avatar.mode-listening .avatar-stage {
  animation: listenLean 1.5s ease-in-out infinite;
}

.echo-avatar.mode-listening .avatar-halo {
  animation-duration: 2.4s;
}

.echo-avatar.mode-listening .eye {
  width: 8px;
  height: 8px;
}

.echo-avatar.mode-listening .mouth {
  width: 14px;
  transform: scaleY(0.86);
}

.echo-avatar.mode-thinking .avatar-stage {
  animation: thinkFloat 2s ease-in-out infinite;
}

.echo-avatar.mode-thinking .avatar-halo {
  animation: thinkHalo 1.8s ease-in-out infinite;
}

.echo-avatar.mode-thinking .face {
  animation: thinkFace 1.8s ease-in-out infinite;
}

.echo-avatar.mode-thinking .mouth {
  width: 10px;
  height: 10px;
  border: 2px solid var(--ink);
  border-radius: 999px;
  border-bottom-width: 2px;
  animation: thinkMouth 1.4s ease-in-out infinite;
}

.echo-avatar.mode-thinking .arm-left {
  animation: thinkArmLeft 1.6s ease-in-out infinite;
}

.echo-avatar.mode-thinking .arm-right {
  animation: thinkArmRight 1.6s ease-in-out infinite;
}

.echo-avatar.mode-grooving .avatar-stage {
  animation: grooveBody 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .avatar-halo {
  animation: grooveHalo 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .mouth {
  animation: grooveSmile 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .arm-left {
  animation: grooveArmLeft 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .arm-right {
  animation: grooveArmRight 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .leg-left {
  animation: grooveLegLeft 1.12s ease-in-out infinite;
}

.echo-avatar.mode-grooving .leg-right {
  animation: grooveLegRight 1.12s ease-in-out infinite;
}

.echo-avatar.mode-replying .avatar-stage {
  animation: replyBody 0.74s ease-in-out infinite;
}

.echo-avatar.mode-replying .avatar-halo {
  animation: replyHalo 0.92s ease-in-out infinite;
}

.echo-avatar.mode-replying .mouth {
  animation: speakMouth 0.24s ease-in-out infinite alternate;
}

.echo-avatar.mode-replying .arm-left {
  animation: replyArmLeft 0.68s ease-in-out infinite;
}

.echo-avatar.mode-replying .arm-right {
  animation: replyArmRight 0.68s ease-in-out infinite;
}

.echo-avatar.mode-replying .leg-left {
  animation: replyLegLeft 0.68s ease-in-out infinite;
}

.echo-avatar.mode-replying .leg-right {
  animation: replyLegRight 0.68s ease-in-out infinite;
}

.echo-avatar.small .avatar-halo {
  width: 106px;
  height: 106px;
}

.echo-avatar.small {
  min-width: 106px;
}

.echo-avatar.small .arm {
  top: 42px;
  width: 10px;
  height: 30px;
}

.echo-avatar.small .arm-left {
  left: 9px;
}

.echo-avatar.small .arm-right {
  right: 9px;
}

.echo-avatar.small .avatar-core {
  top: 10px;
  left: 13px;
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

.echo-avatar.small .leg {
  top: 88px;
  width: 10px;
  height: 16px;
}

.echo-avatar.small .leg-left {
  left: 31px;
}

.echo-avatar.small .leg-right {
  right: 31px;
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

.palette-rose {
  --bg1: #f69ab8;
  --bg2: #f8c3d4;
  --ink: #6b2745;
}

.palette-forest {
  --bg1: #58b08a;
  --bg2: #95d0b0;
  --ink: #1e4a3a;
}

.palette-neon {
  --bg1: #55d9ff;
  --bg2: #9f7dff;
  --ink: #212159;
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

@keyframes idleFloat {
  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-4px);
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

@keyframes curiousBlink {
  0%,
  92%,
  100% {
    transform: translate(var(--look-x), var(--look-y)) scaleY(1);
  }

  94%,
  98% {
    transform: translate(var(--look-x), var(--look-y)) scaleY(0.12);
  }
}

@keyframes curiousTilt {
  0%,
  100% {
    transform: rotate(var(--face-tilt));
  }

  50% {
    transform: rotate(calc(var(--face-tilt) + 6deg)) translateY(-1px);
  }
}

@keyframes listenLean {
  0%,
  100% {
    transform: translateY(0px) rotate(-2deg);
  }

  50% {
    transform: translateY(-2px) rotate(-5deg);
  }
}

@keyframes thinkFloat {
  0%,
  100% {
    transform: translateY(0px) rotate(-1deg);
  }

  50% {
    transform: translateY(-6px) rotate(2deg);
  }
}

@keyframes thinkHalo {
  0%,
  100% {
    transform: scale(0.98);
    opacity: 0.72;
  }

  50% {
    transform: scale(1.06);
    opacity: 0.92;
  }
}

@keyframes thinkFace {
  0%,
  100% {
    transform: rotate(calc(var(--face-tilt) - 1deg));
  }

  50% {
    transform: rotate(calc(var(--face-tilt) + 5deg)) translateY(-1px);
  }
}

@keyframes thinkMouth {
  0%,
  100% {
    transform: scale(0.9);
  }

  50% {
    transform: scale(1.08);
  }
}

@keyframes thinkArmLeft {
  0%,
  100% {
    transform: rotate(24deg);
  }

  50% {
    transform: rotate(-6deg) translateY(-4px);
  }
}

@keyframes thinkArmRight {
  0%,
  100% {
    transform: rotate(-18deg);
  }

  50% {
    transform: rotate(-34deg) translateY(-2px);
  }
}

@keyframes grooveBody {
  0%,
  100% {
    transform: translateX(calc(-4px - var(--groove-shift))) translateY(0px) rotate(-4deg) scale(var(--groove-scale));
  }

  25% {
    transform: translateX(calc(4px + var(--groove-shift))) translateY(-2px) rotate(3deg) scale(var(--groove-scale));
  }

  50% {
    transform: translateX(0px) translateY(calc(-4px - var(--groove-shift))) rotate(0deg) scale(var(--groove-scale));
  }

  75% {
    transform: translateX(calc(5px + var(--groove-shift))) translateY(-1px) rotate(4deg) scale(var(--groove-scale));
  }
}

@keyframes grooveHalo {
  0%,
  100% {
    transform: scale(calc(0.96 + (var(--groove-scale) - 1) * 0.5));
    opacity: 0.74;
  }

  50% {
    transform: scale(calc(1.08 + (var(--groove-scale) - 1) * 0.8));
    opacity: 1;
  }
}

@keyframes grooveSmile {
  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(1.18) translateY(1px);
  }
}

@keyframes grooveArmLeft {
  0%,
  100% {
    transform: rotate(16deg);
  }

  50% {
    transform: rotate(-14deg) translateY(-2px);
  }
}

@keyframes grooveArmRight {
  0%,
  100% {
    transform: rotate(-16deg);
  }

  50% {
    transform: rotate(14deg) translateY(-2px);
  }
}

@keyframes grooveLegLeft {
  0%,
  100% {
    transform: rotate(6deg);
  }

  50% {
    transform: rotate(-10deg) translateY(2px);
  }
}

@keyframes grooveLegRight {
  0%,
  100% {
    transform: rotate(-6deg);
  }

  50% {
    transform: rotate(10deg) translateY(2px);
  }
}

@keyframes replyBody {
  0%,
  100% {
    transform: translateY(0px) scale(1);
  }

  35% {
    transform: translateY(-5px) scale(1.02);
  }

  70% {
    transform: translateY(-1px) scale(0.99);
  }
}

@keyframes replyHalo {
  0%,
  100% {
    transform: scale(0.97);
    opacity: 0.78;
  }

  50% {
    transform: scale(1.1);
    opacity: 1;
  }
}

@keyframes speakMouth {
  from {
    width: 12px;
    height: 8px;
    border-width: 2px;
    border-radius: 999px;
  }

  to {
    width: 18px;
    height: 10px;
    border-width: 3px;
    border-radius: 999px;
  }
}

@keyframes replyArmLeft {
  0%,
  100% {
    transform: rotate(20deg);
  }

  40% {
    transform: rotate(-28deg) translateY(-6px);
  }

  70% {
    transform: rotate(8deg) translateY(1px);
  }
}

@keyframes replyArmRight {
  0%,
  100% {
    transform: rotate(-20deg);
  }

  40% {
    transform: rotate(30deg) translateY(-7px);
  }

  70% {
    transform: rotate(-10deg) translateY(1px);
  }
}

@keyframes replyLegLeft {
  0%,
  100% {
    transform: rotate(8deg);
  }

  50% {
    transform: rotate(-14deg) translateY(2px);
  }
}

@keyframes replyLegRight {
  0%,
  100% {
    transform: rotate(-8deg);
  }

  50% {
    transform: rotate(14deg) translateY(2px);
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
