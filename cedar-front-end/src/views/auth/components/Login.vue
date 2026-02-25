<script setup>
import FormItem from './FormItem.vue';
import { ref, computed } from 'vue';
import { useForm } from '../composables/useForm';
import '../style/form.scss';

const { form, handleSendCode, handleLogin } = useForm();
const scene = ref('code');
const sceneText = computed(() => {
  return scene.value === 'code' ? '密码登录' : '验证码登录'
});

// 切换 Scene
const changeScene = () => { 
  scene.value = scene.value === 'code' ? 'password' : 'code'; 
}

// 处理登录逻辑
const login = (e) => {
  e.preventDefault();

  // 登录处理
  handleLogin();
}
</script>

<template>
  <form class="form">
    <FormItem
      v-model="form.email"
      label="邮箱"
      id="email"
      name="email"
      placeholder="请输入邮箱"/>

    <FormItem
      v-if="scene === 'code'"
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="handleSendCode('login')"/>

    <FormItem
      v-if="scene === 'password'"
      v-model="form.password"
      label="密码"
      id="password"
      name="password"
      placeholder="请输入密码"/>

    <button class="form-submit-btn" @click="login">登录</button>
  </form>

  <div class="sceneText" >
    <span @click="changeScene">{{ sceneText }}</span>
  </div>
</template>

<style scoped lang="scss">
.sceneText {
  cursor: pointer;
  text-align: center;
  color: $primary-color;
}
</style>
