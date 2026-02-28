<script setup>
import FormItem from './FormItem.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCodeStore } from '@/stores/codeStore';
import { useUserStore } from '@/stores/userStore';
import { useForm } from '../composables/useForm';
import '../style/form.scss';

const validScenes = ['login-code', 'login-password'];
const currentScene = ref(validScenes[0]);

const codeStore = useCodeStore();
const userStore = useUserStore();
const router = useRouter();

const formInstance = computed(() => useForm(
  currentScene.value, 
  { codeStore, userStore, router } // 把外部获取的实例传进去
));
const form = computed(() => formInstance.value.form);
const handleSendCode = computed(() => formInstance.value.handleSendCode);
const sceneText = computed(() => currentScene.value === validScenes[0] 
  ? '密码登录' 
  : '验证码登录'
);

// 切换场景
const changeScene = () => {
  currentScene.value = currentScene.value === validScenes[0] 
    ? validScenes[1] 
    : validScenes[0];
};

// 处理登录逻辑
const handleLogin = (e) => {
  e.preventDefault();

  // 登录处理
   formInstance.value.handleSubmit();
};
</script>

<template>
  <form class="form" @submit.prevent="handleLogin">
    <FormItem
      v-model="form.email"
      label="邮箱"
      id="email"
      name="email"
      placeholder="请输入邮箱"/>

    <FormItem
      v-if="currentScene === validScenes[0]"
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="handleSendCode"/>

    <FormItem
      v-if="currentScene === validScenes[1]"
      v-model="form.password"
      label="密码"
      id="password"
      name="password"
      placeholder="请输入密码"/>

    <button class="form-submit-btn" type="submit">登录</button>
  </form>

  <div class="sceneText" >
    <span @click="changeScene">使用{{ sceneText }}</span>
  </div>
</template>

<style scoped lang="scss">
.sceneText {
  cursor: pointer;
  text-align: center;
  color: $primary-color;
  margin-top: 20px;
  font-size: 14px;
}
</style>
