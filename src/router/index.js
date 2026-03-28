import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: () => import('@/views/app/landing/index.vue'),
      meta: {
        isAuth: false,
        title: 'Frequency - 寻找共鸣'
      }
    },
    {
      path: '/app',
      component: () => import('@/views/app/layout/index.vue'),
      redirect: '/app/home',
      meta: { requiresAuth: true },
      children: [
        {
          path: 'home',
          name: 'AppHome',
          component: () => import('@/views/app/home/index.vue'),
          meta: { title: '当下' }
        },
        {
          path: 'resonance',
          name: 'AppResonance',
          component: () => import('@/views/app/resonance/index.vue'),
          meta: { title: '共鸣' }
        },
        {
          path: 'me',
          name: 'AppMe',
          component: () => import('@/views/app/me/index.vue'),
          meta: { title: '本我' }
        },
        {
          path: 'music',
          name: 'AppMusic',
          component: () => import('@/views/app/music/index.vue'),
          meta: { title: '听歌' }
        }
      ]
    }
  ]
})

// 路由守卫 - 检查用户是否登录
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    // access_token 实际保存在 Cookie 中
    const token = Cookies.get('access_token')
    // 如果有token，允许访问；否则跳转到登录页
    if (token) {
      next()
    } else {
      next('/')
    }
  } else {
    // 不需要认证的路由直接放行
    next()
  }
})

export default router
