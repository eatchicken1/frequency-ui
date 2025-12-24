import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      // 路由懒加载
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true } // 需要登录才能访问
    },
    {
      path: '/chat-room/:targetId', // 动态路由，传入目标ID
      name: 'chat-room',
      component: () => import('../views/ChatRoomView.vue'),
      meta: { requiresAuth: true } // 需要登录才能访问
    }
  ]
})

// 路由守卫 - 检查用户是否登录
router.beforeEach((to, from, next) => {
  // 检查路由是否需要认证
  if (to.meta.requiresAuth) {
    // 获取本地存储的token
    const token = localStorage.getItem('access_token');
    // 如果有token，允许访问；否则跳转到登录页
    if (token) {
      next();
    } else {
      next('/');
    }
  } else {
    // 不需要认证的路由直接放行
    next();
  }
});

export default router