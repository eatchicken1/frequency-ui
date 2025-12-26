<template>
  <div class="h-screen w-full bg-[#F2F4F6] relative">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts" name="layout">
// 这里不需要任何 Header 相关的逻辑了
</script>