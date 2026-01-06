<script setup>
import { onMounted, onUnmounted } from 'vue'
import { startTokenCheck } from './utils/tokenCheck'

let tokenCheckInterval = null

onMounted(() => {
  // 启动token定时检查
  tokenCheckInterval = startTokenCheck()
})

onUnmounted(() => {
  // 清除定时器
  if (tokenCheckInterval) {
    clearInterval(tokenCheckInterval)
  }
})
</script>

<template>
  <router-view />
</template>

<style scoped></style>
