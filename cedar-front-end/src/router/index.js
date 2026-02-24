import { createRouter, createWebHashHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
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
  const userStore = useUserStore();
  const isLogin = userStore.isLogin();

  // 已登录的用户访问 /auth（包括子路由）跳转到主页
  if (to.path.includes('/auth') && isLogin) {
    next('/home');
    return;
  }

  // 未登录用户，访问 /auth（包括子路由）以外的页面，跳转到登录页
  if (!to.path.startsWith('/auth') && !isLogin) {
    next('/auth/login');
    return;
  }

  next();
});

export default router;
