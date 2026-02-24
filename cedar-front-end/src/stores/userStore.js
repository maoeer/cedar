import { defineStore } from 'pinia';
import { ref } from 'vue';

// setup 风格
export const useUserStore = defineStore('user', () => {
  // 存储用户 token
  const token = ref('');
  // 用户信息
  const userInfo = ref({
    email: ''
  });

  // 存储用户信息
  const setUser = (data) => {
    token.value = data.token;
    userInfo.value.email = data.email;
  };

  // 退出登录
  const logout = () => {
    token.value = '';
    userInfo.value = {};
  };

  // 判断是否登录
  const isLogin = () => {
    return !!token.value;
  };

  return {
    token,
    userInfo,
    setUser,
    logout,
    isLogin
  };
}, {
  persist: true
});
