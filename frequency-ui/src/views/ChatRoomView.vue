<template>
  <div class="chat-room">
    <!-- 顶部信息 -->
    <div class="room-header">
      <div class="target-info">
        <span class="label">TARGET:</span>
        <span class="value">{{ targetName }}</span>
      </div>
      <div class="status-badge" :class="{ active: isLive }">
        {{ statusText }}
      </div>
    </div>

    <!-- 聊天内容区 -->
    <div class="chat-viewport" ref="chatBox">
      <!-- Loading 状态 -->
      <div v-if="loading" class="terminal-loader">
        <div class="line">> ESTABLISHING NEURAL LINK...</div>
        <div class="line">> DOWNLOADING PERSONA DATA...</div>
        <div class="line">> SYNCHRONIZING AI CORES...</div>
        <div class="line blink">_</div>
      </div>

      <!-- 对话列表 -->
      <div v-else class="message-list">
        <div 
          v-for="(msg, index) in messages" 
          :key="index"
          class="message-row"
          :class="msg.role === 'A' ? 'left' : 'right'"
        >
          <div class="avatar" :class="msg.role === 'A' ? 'my-avatar' : 'their-avatar'">
            {{ msg.role === 'A' ? 'ME' : 'TA' }}
          </div>
          <div class="bubble" :class="msg.role === 'A' ? 'my-bubble' : 'their-bubble'">
            <div class="content">
              {{ msg.displayContent }}
              <span v-if="msg.isTyping" class="cursor blink">_</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 用户弹幕输入 -->
      <div v-if="!loading && isLive" class="barrage-input">
        <input 
          type="text" 
          placeholder="SEND BARRAGE TO YOUR AI..."
          v-model="barrageText"
          @keyup.enter="sendBarrage"
          :disabled="!isLive"
        />
        <button @click="sendBarrage" :disabled="!isLive">FIRE</button>
      </div>
    </div>

    <!-- 结果结算面板 (对话结束后显示) -->
    <div v-if="result" class="result-modal">
      <div class="score-circle">{{ result.score }}%</div>
      <div class="match-text">SYNCHRONIZATION RATE</div>
      <p class="summary-text">"{{ result.summary }}"</p>
      
      <div class="action-btns">
        <button class="action-btn cancel" @click="$router.back()">DISCONNECT</button>
        <button v-if="result.score > 75" class="action-btn confirm" @click="unlockContact">UNLOCK CONTACT</button>
      </div>
    </div>
    
    <!-- 弹幕显示 -->
    <div class="barrage-container">
      <div 
        v-for="(barrage, index) in barrages" 
        :key="index"
        class="barrage-item"
        :style="{
          top: barrage.top + 'px',
          animationDuration: barrage.duration + 's'
        }"
      >
        {{ barrage.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { startVibeCheck } from '../api/business';
import { Toast } from 'vant';

const route = useRoute();
const router = useRouter();
const targetId = route.params.targetId;
const targetName = route.query.name || 'UNKNOWN';

const loading = ref(true);
const isLive = ref(false);
const statusText = ref('INITIALIZING');
const messages = ref([]);
const result = ref(null);
const chatBox = ref(null);

// 弹幕功能
const barrageText = ref('');
const barrages = ref([]);

onMounted(async () => {
  try {
    // 1. 开始调用后端 AI 接口
    // 注意：这是一个长连接请求，可能会等 10-30 秒
    statusText.value = 'AI COMPUTING...';
    
    // 调用 API
    const res = await startVibeCheck(targetId);
    const data = res.data; // 注意 axios 返回的数据在 data 字段里

    loading.value = false;
    isLive.value = true;
    statusText.value = 'LIVE FEED';

    // 2. 模拟打字机效果逐条显示消息
    const fullDialogue = data.dialogue || [];
    
    for (const msg of fullDialogue) {
      await typeWriterEffect(msg);
    }

    // 3. 显示结果
    isLive.value = false;
    statusText.value = 'SESSION ENDED';
    result.value = {
      score: data.score,
      summary: data.summary
    };

  } catch (error) {
    console.error(error);
    Toast('连接中断: AI 响应超时');
    loading.value = false;
  }
});

// 逐字打字机效果
const typeWriterEffect = (msg) => {
  return new Promise(resolve => {
    // 克隆消息对象，添加打字状态
    const typingMsg = {
      ...msg,
      displayContent: '',
      isTyping: true
    };
    
    messages.value.push(typingMsg);
    
    // 滚动到底部
    nextTick(() => {
      if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
    });
    
    // 逐字显示
    let index = 0;
    const typingInterval = setInterval(() => {
      if (index < msg.content.length) {
        typingMsg.displayContent += msg.content.charAt(index);
        index++;
        // 滚动到底部
        nextTick(() => {
          if (chatBox.value) chatBox.value.scrollTop = chatBox.value.scrollHeight;
        });
      } else {
        clearInterval(typingInterval);
        typingMsg.isTyping = false;
        // 随机延迟 1-2秒，模拟阅读时间
        setTimeout(resolve, Math.random() * 1000 + 500);
      }
    }, 30); // 打字速度：30ms/字
  });
};

// 发送弹幕
const sendBarrage = () => {
  if (!barrageText.value.trim() || !isLive.value) return;
  
  // 创建弹幕对象
  const newBarrage = {
    text: barrageText.value,
    top: Math.random() * (window.innerHeight - 100),
    duration: Math.random() * 3 + 3 // 3-6秒
  };
  
  barrages.value.push(newBarrage);
  
  // 清空输入
  barrageText.value = '';
  
  // 3秒后移除弹幕
  setTimeout(() => {
    barrages.value.shift();
  }, newBarrage.duration * 1000);
};

// 解锁联系方法
const unlockContact = () => {
  Toast.success('联系方式已解锁！');
  // 可以添加更多逻辑，比如显示联系方式弹窗
  router.back();
};
</script>

<style scoped>
.chat-room {
  background: #111;
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  color: #fff;
}

.room-header {
  padding: 15px;
  background: #000;
  border-bottom: 2px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.target-info .label {
  color: #888;
  font-size: 12px;
  margin-right: 5px;
}
.target-info .value {
  color: #f0f;
  font-weight: bold;
  letter-spacing: 1px;
}

.status-badge {
  font-size: 10px;
  padding: 2px 8px;
  background: #333;
  border-radius: 4px;
}
.status-badge.active {
  background: #f00; /* LIVE 红色 */
  animation: blink 1s infinite;
}

/* 视口 */
.chat-viewport {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-image: 
    linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9));
  position: relative;
}

/* Terminal Loader */
.terminal-loader {
  color: #0f0;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  margin-top: 50px;
}
.line { margin-bottom: 10px; }
.blink { animation: blink 0.5s infinite; }

/* 消息气泡 */
.message-row {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
  opacity: 0;
  animation: fadeIn 0.5s forwards;
}

.message-row.left { flex-direction: row; }
.message-row.right { flex-direction: row-reverse; }

.avatar {
  width: 40px;
  height: 40px;
  background: #333;
  border: 1px solid #666;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  flex-shrink: 0;
}
.left .avatar { margin-right: 10px; border-color: #0ff; color: #0ff; }
.right .avatar { margin-left: 10px; border-color: #f0f; color: #f0f; }

.bubble {
  max-width: 70%;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}
.left .bubble {
  background: #002222;
  color: #0ff;
  border: 1px solid #055;
  border-top-left-radius: 0;
}
.right .bubble {
  background: #220022;
  color: #f0f;
  border: 1px solid #505;
  border-top-right-radius: 0;
}

/* 结算弹窗 */
.result-modal {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(0, 0, 0, 0.95);
  border-top: 2px solid #f0f;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: slideUp 0.5s ease-out;
}

.score-circle {
  font-size: 48px;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 20px #f0f;
  margin-bottom: 10px;
}
.match-text {
  color: #888;
  font-size: 12px;
  letter-spacing: 2px;
  margin-bottom: 20px;
}
.summary-text {
  color: #ccc;
  text-align: center;
  font-style: italic;
  margin-bottom: 30px;
  padding: 0 20px;
}

.action-btns {
  display: flex;
  gap: 20px;
}
.action-btn {
  padding: 10px 30px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  text-transform: uppercase;
}
.cancel {
  background: #333;
  color: #fff;
}
.confirm {
  background: #f0f;
  color: #fff;
  box-shadow: 0 0 15px #f0f;
}

/* 弹幕样式 */
.barrage-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}

.barrage-item {
  position: absolute;
  left: 100%;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  animation: barrageMove linear forwards;
  background: rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  border-radius: 20px;
  opacity: 0.9;
}

@keyframes barrageMove {
  from { transform: translateX(0); }
  to { transform: translateX(-200%); }
}

/* 打字光标 */
.cursor {
  font-weight: bold;
  margin-left: 2px;
}

/* 弹幕输入区 */
.barrage-input {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
  width: 90%;
  max-width: 600px;
}

.barrage-input input {
  flex: 1;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.7);
  border: 1px solid #f0f;
  border-radius: 20px;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.barrage-input input:focus {
  box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
}

.barrage-input button {
  padding: 10px 20px;
  background: #f0f;
  border: none;
  border-radius: 20px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
}

.barrage-input button:hover:not(:disabled) {
  box-shadow: 0 0 15px rgba(255, 0, 255, 0.7);
}

.barrage-input button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes blink { 50% { opacity: 0; } }
@keyframes fadeIn { to { opacity: 1; } }
@keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
</style>