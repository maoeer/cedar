import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/login/index.vue';
import Home from '@/views/home/index.vue';

// 路由配置
const routes = [
  { 
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  next();
});

export default router;