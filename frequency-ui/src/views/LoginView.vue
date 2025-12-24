<template>
  <div class="login-container">
    <!-- 装饰性光环 -->
    <div class="neon-circle" :class="schoolColor"></div>
    
    <h1 class="title">FREQUENCY</h1>
    <h2 class="slogan">Let our Echoes meet first.</h2>

    <div class="form-box">
      <!-- 绑定表单数据 -->
      <input 
        v-model="form.username" 
        type="text" 
        placeholder="School ID / Email" 
        class="cyber-input" 
        @keyup.enter="handleLogin"
        @input="detectSchool"
      />
      <input 
        v-model="form.password" 
        type="password" 
        placeholder="Password" 
        class="cyber-input" 
        @keyup.enter="handleLogin"
      />
      
      <button @click="handleLogin" class="cyber-btn" :disabled="loading">
        <span v-if="!loading">CONNECT</span>
        <span v-else>SYNCING...</span>
      </button>
    </div>
    
    <!-- 学校徽章预览 -->
    <div class="school-badge" v-if="schoolName">
      <span class="badge-label">{{ schoolName }}</span>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';
import { showToast } from 'vant';
import 'vant/es/toast/style';

const router = useRouter();
const loading = ref(false);
const schoolName = ref('');

const form = reactive({
  username: '',
  password: ''
});

// 根据检测到的学校设置颜色
const schoolColor = computed(() => {
  if (schoolName.value.includes('北大') || schoolName.value.includes('Peking')) {
    return 'beida-red';
  } else if (schoolName.value.includes('清华') || schoolName.value.includes('Tsinghua')) {
    return 'qinghua-purple';
  } else if (schoolName.value.includes('复旦') || schoolName.value.includes('Fudan')) {
    return 'fudan-blue';
  } else if (schoolName.value.includes('浙大') || schoolName.value.includes('Zhejiang')) {
    return 'zheda-green';
  } else if (schoolName.value.includes('上海交大') || schoolName.value.includes('SJTU')) {
    return 'sjtu-red';
  } else if (schoolName.value.includes('中国科大') || schoolName.value.includes('USTC')) {
    return 'ustc-orange';
  } else {
    return 'default-blue';
  }
});

// 检测学校信息
const detectSchool = () => {
  const email = form.username.toLowerCase();
  
  if (email.includes('pku.edu.cn') || email.includes('peking')) {
    schoolName.value = '北京大学';
  } else if (email.includes('tsinghua.edu.cn') || email.includes('tsinghua')) {
    schoolName.value = '清华大学';
  } else if (email.includes('fudan.edu.cn') || email.includes('fudan')) {
    schoolName.value = '复旦大学';
  } else if (email.includes('zju.edu.cn') || email.includes('zhejiang')) {
    schoolName.value = '浙江大学';
  } else if (email.includes('sjtu.edu.cn') || email.includes('sjtu')) {
    schoolName.value = '上海交通大学';
  } else if (email.includes('ustc.edu.cn') || email.includes('ustc')) {
    schoolName.value = '中国科学技术大学';
  } else {
    schoolName.value = '';
  }
};

const handleLogin = async () => {
  if (!form.username || !form.password) {
    showToast({
      message: '请输入账号和密码',
      position: 'top',
      duration: 2000
    });
    return;
  }

  loading.value = true;

  try {
    // 调用 PIG 后端登录接口
    const res = await login(form.username, form.password);
    console.log('登录成功', res.data);
    
    // 1. 保存 Token 到本地
    localStorage.setItem('access_token', res.data.access_token);
    localStorage.setItem('refresh_token', res.data.refresh_token);
    // 保存用户名
    localStorage.setItem('username', form.username);
    
    // 2. 跳转到首页
    router.push('/dashboard');
  } catch (error) {
    console.error(error);
    showToast({
      message: '连接失败: 账号或密码错误',
      position: 'top',
      duration: 2000
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 赛博朋克极简风样式 
  这里使用原生 CSS 以确保霓虹光影效果的精确控制
*/
.login-container {
  background-color: #050505;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Courier New', Courier, monospace;
  overflow: hidden;
}

.neon-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 2px solid #0ff;
  box-shadow: 0 0 20px #0ff, inset 0 0 20px #0ff;
  margin-bottom: 2rem;
  animation: pulse 2s infinite;
}

/* 学校专属颜色 */
.neon-circle.default-blue {
  border-color: #0ff;
  box-shadow: 0 0 20px #0ff, inset 0 0 20px #0ff;
}

.neon-circle.beida-red {
  border-color: #ff0000;
  box-shadow: 0 0 20px #ff0000, inset 0 0 20px #ff0000;
}

.neon-circle.qinghua-purple {
  border-color: #9d2235;
  box-shadow: 0 0 20px #9d2235, inset 0 0 20px #9d2235;
}

.neon-circle.fudan-blue {
  border-color: #225d91;
  box-shadow: 0 0 20px #225d91, inset 0 0 20px #225d91;
}

.neon-circle.zheda-green {
  border-color: #006633;
  box-shadow: 0 0 20px #006633, inset 0 0 20px #006633;
}

.neon-circle.sjtu-red {
  border-color: #cc0000;
  box-shadow: 0 0 20px #cc0000, inset 0 0 20px #cc0000;
}

.neon-circle.ustc-orange {
  border-color: #ff7f00;
  box-shadow: 0 0 20px #ff7f00, inset 0 0 20px #ff7f00;
}

.title {
  font-size: 2.5rem;
  letter-spacing: 5px;
  text-shadow: 0 0 10px #f0f;
  margin: 0;
  font-weight: bold;
}

.slogan {
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 3rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.form-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 0 20px;
}

.cyber-input {
  display: block;
  background: transparent;
  border: none;
  border-bottom: 1px solid #333;
  color: #0ff;
  width: 100%;
  max-width: 300px;
  padding: 10px;
  margin-bottom: 25px;
  outline: none;
  transition: 0.3s;
  font-family: inherit;
  font-size: 1rem;
}

.cyber-input::placeholder {
  color: #444;
}

.cyber-input:focus {
  border-bottom-color: #f0f;
  box-shadow: 0 10px 10px -10px rgba(255, 0, 255, 0.3);
}

.cyber-btn {
  background: transparent;
  border: 1px solid #f0f;
  color: #f0f;
  padding: 12px 50px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: 0.3s;
  margin-top: 10px;
  font-weight: bold;
  font-family: inherit;
}

.cyber-btn:hover {
  background: #f0f;
  color: #000;
  box-shadow: 0 0 20px #f0f;
}

.cyber-btn:disabled {
  border-color: #444;
  color: #444;
  cursor: not-allowed;
  box-shadow: none;
}

/* 学校徽章样式 */
.school-badge {
  margin-top: 1.5rem;
  padding: 8px 20px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.badge-label {
  font-size: 0.9rem;
  color: #0ff;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.8; }
}
</style>