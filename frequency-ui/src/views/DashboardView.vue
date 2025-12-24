<template>
  <div class="dashboard-container">
    <!-- 顶部状态栏 -->
    <header class="cyber-header">
      <span class="status-dot"></span>
      <span class="status-text">SYSTEM ONLINE</span>
      <div class="user-info">ID: {{ myId }}</div>
    </header>

    <!-- 核心雷达区 -->
    <div class="radar-wrapper">
      <div class="radar-circle">
        <!-- 雷达扫描线 -->
        <div class="radar-scan"></div>
        
        <!-- 雷达同心圆 -->
        <div class="radar-ring ring-1"></div>
        <div class="radar-ring ring-2"></div>
        <div class="radar-ring ring-3"></div>
        
        <!-- 中心点 (我) -->
        <div class="core-point">ME</div>
        
        <!-- 扫描到的 Echo 光点 (模拟数据) -->
        <div 
          v-for="user in users" 
          :key="user.userId"
          class="echo-point"
          :style="userPositions[user.userId]"
          :class="getSchoolClass(user.school)"
          @click="handleConnect(user)"
          @mouseenter="hoveredUser = user"
          @mouseleave="hoveredUser = null"
        >
          <div class="echo-pulse"></div>
          <div class="echo-label">
            <span class="school">{{ user.school }}</span>
            <span class="name">{{ user.nickname }}</span>
          </div>
        </div>
        
        <!-- 悬停信息卡片 -->
        <div 
          v-if="hoveredUser" 
          class="user-tooltip"
          :style="{
            left: `calc(50% + ${userPositions[hoveredUser.userId]?.transform?.split('translate(')[1]?.split('vmin)')[0]}vmin)`,
            top: `calc(50% + ${userPositions[hoveredUser.userId]?.transform?.split('translate(')[1]?.split('vmin)')[0]}vmin)`
          }"
        >
          <div class="tooltip-title">{{ hoveredUser.nickname }}</div>
          <div class="tooltip-detail">School: {{ hoveredUser.school }}</div>
          <div class="tooltip-detail">MBTI: {{ hoveredUser.mbti }}</div>
          <div class="tooltip-detail">Heat: {{ hoveredUser.heat }}%</div>
        </div>
      </div>
    </div>

    <!-- 底部控制台 -->
    <footer class="cyber-console">
      <div class="console-line">> SCANNING NEARBY FREQUENCIES...</div>
      <div class="console-line">> FOUND {{ users.length }} ECHO SIGNALS.</div>
      <div class="console-line">> MATCHING CRITERIA: {{ matchCriteria }}</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { getRecommendedUsers } from '../api/business';

const router = useRouter();
const users = ref([]);
const userPositions = ref({});
const myId = ref(localStorage.getItem('username') || 'GUEST');
const hoveredUser = ref(null);

// 匹配标准显示
const matchCriteria = computed(() => {
  return 'AI-POWERED | REAL-TIME | HIGH-PRECISION';
});

// 为每个用户生成固定的位置
const generateUserPositions = (userList) => {
  const positions = {};
  userList.forEach(user => {
    positions[user.userId] = getRandomPosition();
  });
  return positions;
};

onMounted(async () => {
  // 获取周围用户
  const userList = await getRecommendedUsers();
  users.value = userList;
  // 为用户生成固定位置
  userPositions.value = generateUserPositions(userList);
});

// 生成随机位置 (在圆圈内)
const getRandomPosition = () => {
  const angle = Math.random() * 360;
  // 距离中心 20% - 80% 的位置
  const distance = 20 + Math.random() * 60; 
  return {
    transform: `rotate(${angle}deg) translate(${distance}vmin) rotate(-${angle}deg)`
  };
};

// 根据学校获取对应的CSS类
const getSchoolClass = (school) => {
  switch(school) {
    case 'THU': return 'school-thu';
    case 'CAFA': return 'school-cafa';
    case 'BSU': return 'school-bsu';
    case 'BUPT': return 'school-bupt';
    case 'BFA': return 'school-bfa';
    case 'CUC': return 'school-cuc';
    default: return 'school-default';
  }
};

const handleConnect = (user) => {
  console.log('Connecting to', user.nickname);
  // 跳转到聊天室，带上目标ID和昵称
  router.push({
    name: 'chat-room',
    params: { targetId: user.userId },
    query: { name: user.nickname }
  });
};
</script>

<style scoped>
.dashboard-container {
  background-color: #000;
  height: 100vh;
  width: 100vw;
  color: #0f0;
  font-family: 'Courier New', Courier, monospace;
  overflow: hidden;
  position: relative;
  background-image: 
    radial-gradient(circle at 20% 80%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%);
}

/* 顶部栏 */
.cyber-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 255, 0, 0.3);
  background: rgba(0, 0, 0, 0.9);
  z-index: 10;
  backdrop-filter: blur(5px);
}

.status-dot {
  width: 8px;
  height: 8px;
  background-color: #0f0;
  border-radius: 50%;
  margin-right: 10px;
  box-shadow: 0 0 10px #0f0;
  animation: statusBlink 2s infinite;
}

.status-text {
  font-size: 12px;
  color: #0f0;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.user-info {
  margin-left: auto;
  color: #0aa;
  font-size: 12px;
  text-shadow: 0 0 5px #0aa;
}

/* 雷达主体 */
.radar-wrapper {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.radar-circle {
  width: 80vmin;
  height: 80vmin;
  border: 1px dashed rgba(0, 255, 0, 0.3);
  border-radius: 50%;
  position: relative;
  background: radial-gradient(circle, rgba(0, 255, 255, 0.05) 0%, transparent 70%);
}

/* 雷达同心圆 */
.radar-ring {
  position: absolute;
  border: 1px dashed rgba(0, 255, 0, 0.2);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 {
  width: 33%;
  height: 33%;
}

.ring-2 {
  width: 66%;
  height: 66%;
}

.ring-3 {
  width: 100%;
  height: 100%;
}

/* 扫描线动画 */
.radar-scan {
  width: 50%;
  height: 50%;
  background: linear-gradient(45deg, rgba(0, 255, 0, 0.3) 0%, transparent 50%);
  position: absolute;
  top: 0;
  right: 0;
  transform-origin: 0% 100%; /* 左下角为旋转中心，即圆心 */
  animation: scan 4s infinite linear;
  border-right: 1px solid rgba(0, 255, 0, 0.8);
  filter: blur(1px);
}

.core-point {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  background: #000;
  border: 2px solid #0f0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: bold;
  color: #0f0;
  box-shadow: 0 0 20px #0f0, inset 0 0 10px rgba(0, 255, 0, 0.3);
  z-index: 2;
  animation: coreGlow 2s ease-in-out infinite alternate;
}

/* Echo 光点 */
.echo-point {
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 5;
  transition: transform 0.3s ease;
}

.echo-point:hover {
  transform: scale(1.1);
}

.echo-pulse {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  box-shadow: 0 0 15px currentColor;
  animation: pulse 2s infinite;
}

/* 不同学校的光点颜色 */
.echo-point.school-thu .echo-pulse {
  background-color: #9d2235;
  color: #9d2235;
}

.echo-point.school-cafa .echo-pulse {
  background-color: #00a8e8;
  color: #00a8e8;
}

.echo-point.school-bsu .echo-pulse {
  background-color: #0077b6;
  color: #0077b6;
}

.echo-point.school-bupt .echo-pulse {
  background-color: #006400;
  color: #006400;
}

.echo-point.school-bfa .echo-pulse {
  background-color: #ff4500;
  color: #ff4500;
}

.echo-point.school-cuc .echo-pulse {
  background-color: #dc143c;
  color: #dc143c;
}

.echo-point.school-default .echo-pulse {
  background-color: #00ffff;
  color: #00ffff;
}

.echo-label {
  margin-top: 5px;
  font-size: 10px;
  text-align: center;
  text-shadow: 0 0 2px #000;
  pointer-events: none; /* 防止遮挡点击 */
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.echo-point:hover .echo-label {
  opacity: 1;
}

.echo-label .school {
  display: block;
  color: currentColor;
  font-weight: bold;
  font-size: 9px;
}

.echo-label .name {
  color: #fff;
}

/* 用户悬停信息卡片 */
.user-tooltip {
  position: absolute;
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid rgba(0, 255, 255, 0.5);
  border-radius: 8px;
  padding: 12px;
  min-width: 180px;
  z-index: 100;
  box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
  transform: translate(-50%, -120%);
  backdrop-filter: blur(10px);
}

.tooltip-title {
  color: #00ffff;
  font-weight: bold;
  margin-bottom: 8px;
  font-size: 12px;
  letter-spacing: 1px;
}

.tooltip-detail {
  color: #888;
  font-size: 10px;
  margin-bottom: 4px;
  display: flex;
  justify-content: space-between;
}

.tooltip-detail::after {
  color: #0f0;
  font-weight: bold;
}

/* 底部控制台 */
.cyber-console {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent);
  color: #0a0;
  font-size: 12px;
  z-index: 10;
}

.console-line {
  margin-bottom: 5px;
  opacity: 0.8;
  animation: consoleFade 0.5s ease-in-out;
}

/* 动画效果 */
@keyframes scan {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}

@keyframes statusBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes coreGlow {
  0% { box-shadow: 0 0 15px #0f0, inset 0 0 10px rgba(0, 255, 0, 0.3); }
  100% { box-shadow: 0 0 25px #0f0, inset 0 0 15px rgba(0, 255, 0, 0.5); }
}

@keyframes consoleFade {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 0.8; transform: translateY(0); }
}
</style>