<template>
  <div
    class="min-h-screen w-full relative overflow-hidden
           flex items-center justify-center
           bg-zinc-950 text-zinc-200"
  >
    <!-- 暗色背景气息 -->
    <div class="absolute -top-40 -left-40 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px]"></div>
    <div class="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-zinc-700/30 rounded-full blur-[200px]"></div>

    <div class="relative z-10 w-full max-w-[420px] px-8">
      <transition name="fade" mode="out-in">

        <!-- 唤醒 -->
        <div
          v-if="!isAwake"
          key="splash"
          class="flex flex-col items-center py-32 cursor-pointer"
          @click="wakeUp"
        >
          <div class="w-24 h-24 rounded-full border border-zinc-700 flex items-center justify-center mb-20">
            <span class="text-3xl text-zinc-500">〰️</span>
          </div>

          <h1 class="text-4xl font-serif tracking-[0.35em] mb-6 text-zinc-100">
            频率
          </h1>
          <p class="text-xs tracking-[0.4em] text-zinc-500 uppercase">
            Find your resonance
          </p>

          <div class="mt-36 text-[10px] tracking-widest text-zinc-500 animate-pulse">
            点击唤醒
          </div>
        </div>

        <!-- 登录 -->
        <div v-else key="login">
          <!-- 标题 -->
          <div class="mb-28 text-center">
            <h2 class="text-2xl font-serif mb-4 text-zinc-100">入定</h2>
            <p class="text-[10px] tracking-[0.3em] text-zinc-500 uppercase">
              Frequency Access
            </p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-28">

            <!-- 输入层 -->
            <div class="space-y-20">
              <input
                v-model="loginForm.username"
                type="text"
                placeholder="ID"
                class="zen-input-dark"
                @input="clearError"
              />

              <input
                v-model="loginForm.password"
                type="password"
                placeholder="Key"
                class="zen-input-dark"
                @input="clearError"
              />

              <!-- 验证码：仅失败后出现 -->
              <transition name="fade">
                <div
                  v-if="showCode"
                  class="flex items-end gap-12"
                >
                  <input
                    v-model="loginForm.code"
                    type="text"
                    maxlength="5"
                    placeholder="Code"
                    class="zen-input-dark flex-1 uppercase tracking-widest"
                    @input="clearError"
                  />

                  <div
                    class="code-box-dark"
                    @click="refreshCode"
                  >
                    <img
                      v-if="codeUrl"
                      :src="codeUrl"
                      alt="验证码"
                    />
                    <span v-else>···</span>
                  </div>
                </div>
              </transition>
            </div>

            <!-- 低声提示 -->
            <transition name="hint">
              <p
                v-if="errorHint"
                class="text-[11px] tracking-widest text-zinc-500 text-center"
              >
                {{ errorHint }}
              </p>
            </transition>

            <!-- 行动层 -->
            <div class="pt-28 space-y-14">
              <button
                type="submit"
                :disabled="isLoading"
                class="zen-btn-dark"
              >
                {{ isLoading ? '连接中' : '进入频率' }}
              </button>

              <button
                type="button"
                @click="isAwake = false"
                class="zen-sub-btn-dark"
              >
                返回休眠
              </button>
            </div>
          </form>
        </div>

      </transition>
    </div>
  </div>

  <!-- footer -->
  <footer class="fixed inset-x-0 bottom-0 pb-4 text-center pointer-events-none">
    <p class="text-[10px] tracking-[0.3em] text-zinc-500/50">
      © {{ currentYear }} FREQUENCY LAB
    </p>
  </footer>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Cookies from 'js-cookie'
import { login, getCodeImg } from '@/api/app-auth'

const router = useRouter()
const route = useRoute()

const isAwake = ref(false)
const isLoading = ref(false)
const currentYear = new Date().getFullYear()
const codeUrl = ref('')
const errorHint = ref('')
const showCode = ref(false)

const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  randomStr: ''
})

const wakeUp = () => {
  isAwake.value = true
}

const clearError = () => {
  errorHint.value = ''
}

const generateRandomStr = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })

const refreshCode = () => {
  loginForm.code = ''
  loginForm.randomStr = generateRandomStr()
  if (codeUrl.value) URL.revokeObjectURL(codeUrl.value)
  codeUrl.value = ''

  getCodeImg(loginForm.randomStr).then((res: any) => {
    const blob = res.data || res
    if (blob instanceof Blob) {
      codeUrl.value = URL.createObjectURL(blob)
    }
  })
}

const handleLogin = async () => {
  if (!loginForm.username || !loginForm.password || (showCode.value && !loginForm.code)) {
    errorHint.value = '信息尚未完整'
    return
  }

  isLoading.value = true
  try {
    const tokenData: any = await login(
      loginForm.username,
      loginForm.password,
      loginForm.code,
      loginForm.randomStr
    )

    if (tokenData?.access_token) {
      Cookies.set('access_token', tokenData.access_token)
      Cookies.set('refresh_token', tokenData.refresh_token)
      Cookies.set('tenant_id', '1')

      router.push(route.query?.redirect as string || '/app/home')
    }
  } catch {
    isLoading.value = false
    errorHint.value = '频率未能对齐'
    showCode.value = true
    refreshCode()
  }
}
</script>

<style scoped>
/* 暗色输入呼吸 */
.zen-input-dark {
  width: 100%;
  padding: 14px 0;
  background: transparent !important;
  border: none;
  border-bottom: 1px solid #3f3f46;
  outline: none;
  font-size: 14px;
  letter-spacing: 0.22em;
  color: #e4e4e7;
  transition: border-color 0.3s, transform 0.25s;
}

.zen-input-dark::placeholder {
  color: #71717a;
  letter-spacing: 0.35em;
}

.zen-input-dark:focus {
  border-bottom-color: #22d3ee;
  transform: scaleX(1.025);
}

/* 验证码轻感 */
.code-box-dark {
  width: 96px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.35;
  cursor: pointer;
  transition: opacity 0.3s;
}

.code-box-dark:hover {
  opacity: 0.85;
}

/* 主按钮 */
.zen-btn-dark {
  width: 100%;
  padding: 14px 0;
  font-size: 13px;
  letter-spacing: 0.5em;
  text-transform: uppercase;
  color: #e4e4e7;
  border: 1px solid #52525b;
  border-radius: 9999px;
  transition: all 0.3s;
}

.zen-btn-dark:hover {
  border-color: #22d3ee;
  color: #22d3ee;
}

/* 次按钮 */
.zen-sub-btn-dark {
  width: 100%;
  font-size: 11px;
  letter-spacing: 0.4em;
  color: #71717a;
  transition: color 0.3s;
}

.zen-sub-btn-dark:hover {
  color: #22d3ee;
}

/* 提示 */
.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.4s, transform 0.4s;
}
.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* fade */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
