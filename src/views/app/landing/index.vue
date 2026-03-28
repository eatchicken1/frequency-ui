<template>
  <div class="page-container">
    <div class="bg-orb-cyan"></div>
    <div class="bg-orb-ink"></div>

    <div class="main-content">
      <transition name="fade" mode="out-in">

        <div v-if="!isAwake" class="splash-screen" @click="wakeUp">
          <div class="logo-circle">〰️</div>
          <h1 class="title">频率</h1>
          <p class="subtitle">FIND YOUR RESONANCE</p>
          <div class="click-hint">点击唤醒</div>
        </div>

        <div v-else class="login-screen">
          
          <div class="header-area">
            <h2 class="header-title">入定</h2>
            <p class="header-subtitle">FREQUENCY ACCESS</p>
          </div>

          <form @submit.prevent="handleLogin">
            
            <div class="input-section">
              
              <div class="input-wrapper">
                <input
                  v-model="loginForm.username"
                  type="text"
                  placeholder="ID"
                  class="zen-input"
                  @input="clearError"
                  autocomplete="off"
                />
              </div>

              <div class="input-wrapper">
                <input
                  v-model="loginForm.password"
                  type="password"
                  placeholder="Key"
                  class="zen-input"
                  @input="clearError"
                  autocomplete="new-password"
                />
              </div>

              <div class="input-wrapper code-wrapper">
                <input
                  v-model="loginForm.code"
                  type="text"
                  placeholder="Code"
                  class="zen-input code-input"
                  @input="clearError"
                  autocomplete="off"
                />
                <div class="code-img-box" @click="refreshCode">
                   <img v-if="codeUrl" :src="codeUrl" class="code-img" />
                   <span v-else class="text-[10px] tracking-widest text-zinc-400">LOADING</span>
                </div>
              </div>

            </div>

            <div class="error-area">
               <transition name="fade">
                 <p v-if="errorHint" class="error-text">{{ errorHint }}</p>
               </transition>
            </div>

            <div class="action-section">
              <button type="submit" :disabled="isLoading" class="zen-btn">
                {{ isLoading ? '连接中...' : '进入频率' }}
              </button>
              
              <div class="btn-spacer"></div>

              <button type="button" @click="isAwake = false" class="zen-sub-btn">
                返回休眠
              </button>
            </div>

          </form>
        </div>

      </transition>
    </div>

    <footer class="footer">
      <p>© {{ currentYear }} FREQUENCY LAB</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Cookies from 'js-cookie'
import { login, getCodeImg } from '@/api/app-auth'
import { encrypt } from '@/utils/encryption'

const router = useRouter()
const route = useRoute()
const isAwake = ref(false)
const isLoading = ref(false)
const currentYear = new Date().getFullYear()
const codeUrl = ref('')
const errorHint = ref('')
// showCode 变量虽然不再控制显示隐藏，但保留逻辑以防万一，或者直接删掉v-if即可
const loginForm = reactive({ username: '', password: '', code: '', randomStr: '' })

const wakeUp = () => {
  isAwake.value = true
  // 唤醒时立即刷新验证码
  refreshCode() 
}

const clearError = () => errorHint.value = ''

const generateRandomStr = () => Math.random().toString(36).substring(2)

const refreshCode = () => {
  loginForm.code = ''
  loginForm.randomStr = generateRandomStr()
  getCodeImg(loginForm.randomStr).then((res: any) => {
    const blob = res.data || res
    if (blob instanceof Blob) codeUrl.value = URL.createObjectURL(blob)
  })
}

// 页面加载时也可以预加载一次，虽然这时候还在 Splash 状态
onMounted(() => {
  refreshCode()
})

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password || !loginForm.code) {
    errorHint.value = '信息尚未完整'
    return
  }
  isLoading.value = true
  try {
    const encryptedPassword = encrypt(loginForm.password)
    const tokenData: any = await login(loginForm.username, encryptedPassword, loginForm.code, loginForm.randomStr)
    if (tokenData?.access_token) {
      Cookies.set('access_token', tokenData.access_token, { expires: 7 })
      Cookies.set('refresh_token', tokenData.refresh_token, { expires: 30 })
      Cookies.set('tenant_id', '1', { expires: 30 })
      router.push(route.query?.redirect as string || '/app/home')
    }
  } catch (err) {
    console.error(err)
    isLoading.value = false
    errorHint.value = '频率未能对齐'
    refreshCode()
  }
}
</script>

<style scoped>
/* ===========================================
   Theme: Neo-Chinese Light (Cloud White)
   Layout: Rigid/Violent Spacing
   ===========================================
*/

.page-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
  /* 背景色：云峰白/淡灰 (#F2F4F6) - 护眼且高级 */
  background-color: #F2F4F6; 
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  /* 文本色：墨色 (#27272a) - 深灰接近黑 */
  color: #27272a;
  font-family: sans-serif;
}

/* 背景光效：改为淡雅的水墨色 */
.bg-orb-cyan { 
  position: absolute; top: -100px; left: -100px; width: 500px; height: 500px; 
  background: rgba(34, 211, 238, 0.08); /* 极淡的青色 */
  border-radius: 50%; filter: blur(140px); pointer-events: none; 
}
.bg-orb-ink { 
  position: absolute; bottom: -100px; right: -100px; width: 600px; height: 600px; 
  background: rgba(0, 0, 0, 0.03); /* 极淡的墨迹 */
  border-radius: 50%; filter: blur(180px); pointer-events: none; 
}

.main-content {
  position: relative;
  z-index: 10;
  width: 100%;
  max-width: 420px;
  padding: 0 32px;
}

/* Splash */
.splash-screen { display: flex; flex-direction: column; align-items: center; padding: 60px 0; cursor: pointer; }
.logo-circle { 
  width: 96px; height: 96px; border-radius: 50%; 
  border: 1px solid #d4d4d8; /* 浅灰边框 */
  display: flex; justify-content: center; align-items: center; margin-bottom: 80px; 
  font-size: 30px; color: #52525b; /* 深灰图标 */
  transition: all 0.5s;
}
.splash-screen:hover .logo-circle { border-color: #27272a; color: #000; }

.title { font-size: 36px; letter-spacing: 0.35em; margin-bottom: 24px; color: #18181b; font-family: serif; font-weight: bold; }
.subtitle { font-size: 12px; letter-spacing: 0.4em; color: #71717a; text-transform: uppercase; }
.click-hint { margin-top: 140px; font-size: 10px; letter-spacing: 0.2em; color: #a1a1aa; animation: pulse 2s infinite; }

/* Login Header */
.header-area { text-align: center; margin-bottom: 80px; }
.header-title { font-size: 24px; font-family: serif; margin-bottom: 16px; color: #18181b; font-weight: 600; }
.header-subtitle { font-size: 10px; letter-spacing: 0.3em; color: #a1a1aa; text-transform: uppercase; }

/* ------------------------------------
   输入框样式 (白底适配版)
   ------------------------------------
*/
.input-section { display: flex; flex-direction: column; }
.input-wrapper { margin-bottom: 35px; /* 硬间距保持 */ position: relative; }

.zen-input {
  width: 100%;
  padding: 14px 0;
  background: transparent;
  border: none;
  /* 边框改为浅灰 (#e4e4e7) */
  border-bottom: 1px solid #d4d4d8; 
  /* 文字改为深黑 */
  color: #18181b; 
  font-size: 14px;
  letter-spacing: 0.15em;
  outline: none;
  transition: all 0.3s;
}

.zen-input::placeholder { color: #a1a1aa; letter-spacing: 0.25em; }

/* Focus 效果：保持青色，但在白底上稍微加深一点以便识别 */
.zen-input:focus { 
  border-bottom-color: #06b6d4; /* Cyan-600 (稍微深一点的青) */
  transform: scaleX(1.025);
}

/* 验证码 */
.code-wrapper { display: flex; gap: 40px; align-items: flex-end; }
.code-input { flex: 1; text-transform: uppercase; }
.code-img-box { 
  width: 96px; height: 36px; display: flex; align-items: center; justify-content: center; 
  cursor: pointer; opacity: 0.8; /* 白底上不需要太透明 */
  filter: grayscale(1); /* 验证码图片黑白化，更高级 */
  transition: all 0.3s;
}
.code-img-box:hover { opacity: 1; filter: grayscale(0); }
.code-img { width: 100%; height: 100%; object-fit: contain; }

/* ------------------------------------
   按钮样式 (白底适配版)
   ------------------------------------
*/
.error-area { height: 20px; display: flex; justify-content: center; align-items: center; margin-bottom: 30px; }
.error-text { font-size: 11px; color: #ef4444; /* 红色提示在白底更明显 */ letter-spacing: 0.1em; }

.action-section { margin-top: 20px; }

.zen-btn {
  width: 100%;
  padding: 14px 0;
  background: transparent;
  /* 边框深灰 */
  border: 1px solid #52525b; 
  color: #52525b;
  border-radius: 9999px;
  font-size: 13px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.3s;
}

/* Hover 效果：青色文字 + 青色边框 */
.zen-btn:hover { 
  border-color: #06b6d4; 
  color: #06b6d4; 
  background-color: rgba(6, 182, 212, 0.05); /* 极淡背景增强交互感 */
}

.btn-spacer { height: 25px; /* 硬间距保持 */ }

.zen-sub-btn {
  width: 100%;
  background: transparent;
  border: none;
  color: #a1a1aa;
  font-size: 11px;
  letter-spacing: 0.4em;
  cursor: pointer;
  transition: color 0.3s;
}
.zen-sub-btn:hover { color: #06b6d4; }

/* Footer */
.footer {
  position: fixed;
  bottom: 20px;
  width: 100%;
  text-align: center;
  pointer-events: none;
  z-index: 100;
}
.footer p { font-size: 10px; letter-spacing: 0.3em; color: #a1a1aa; }

/* Autofill Hack (白底版) 
  强制浏览器记住密码后的背景色为白色，文字为黑色
*/
input:-webkit-autofill,
input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px #F2F4F6 inset !important; /* 背景色同页面背景 */
    -webkit-text-fill-color: #18181b !important; /* 文字色同页面文字 */
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .4; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>