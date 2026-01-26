import { createRouter, createWebHashHistory } from 'vue-router';
import Auth from '@/views/auth/index.vue';
import Login from '@/views/auth/components/Login.vue';
import Register from '@/views/auth/components/Register.vue';
import Home from '@/views/home/index.vue';

// 路由配置
const routes = [
  { 
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/auth',
    component: Auth,
    children: [
      {
        path: 'login',
        component: Login
      },
      {
        path: 'register',
        component: Register
      }
    ]
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
