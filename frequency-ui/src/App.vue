<script setup>
import { onMounted, onUnmounted } from 'vue'
import { startTokenCheck } from './utils/tokenCheck'

let tokenCheckInterval = null

onMounted(() => {
  // 启动token定时检查
  // 配置token检查：
  // 1. 在开发环境下，可以设置autoRefresh为false避免未对接后端时强制退出
  // 2. 或者设置forceLogoutOnFailure为false，即使刷新失败也不强制退出
  tokenCheckInterval = startTokenCheck({
    // 可以根据环境变量或配置来决定是否自动刷新
    autoRefresh: true,
    // 错误处理函数，不强制退出登录
    onError: (error) => {
      console.error('Token check failed:', error)
      // 这里可以添加提示信息，而不是强制退出
      // 例如：ElMessage.error('Token刷新失败，请检查网络连接')
    }
  })
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
