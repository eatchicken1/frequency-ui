import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vant/lib/index.css'
import './style.css'

import App from './App.vue'
import router from './router'
// 引入 Tailwind 样式 (确保这一行在 Element Plus 样式之后，方便覆盖)
import './index.css' 

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
