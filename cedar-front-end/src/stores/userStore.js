import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

// setup 风格
export const useUserStore = defineStore('user', () => {
  // 存储用户 token
  const token = ref('');
  // 用户信息
  const user = ref({});
  const router = useRouter();

  // 存储用户信息
  const setUser = (data) => {
    token.value = data.token;
    user.value = data.user;
  };

  // 退出登录
  const logout = () => {
    token.value = '';
    user.value = {};
    router.push('/auth/login')
  };

  // 判断是否登录
  const isLogin = () => {
    return !!token.value;
  };

  return {
    token,
    user,
    setUser,
    logout,
    isLogin
  };
}, {
  persist: true
});
