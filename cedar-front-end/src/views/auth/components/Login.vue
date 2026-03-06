<script setup>
import FormItem from './FormItem.vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCodeStore } from '@/stores/codeStore';
import { useUserStore } from '@/stores/userStore';
import { useLogin  } from '../composables/useLogin';
import '../style/form.scss';

const codeStore = useCodeStore();
const userStore = useUserStore();
const router = useRouter();

// 初始化登录逻辑
const {
  currentScene,
  form,
  toggleScene,
  sendLoginCode,
  handleLogin,
  LOGIN_SCENES
} = useLogin({ codeStore, userStore, router });

// 场景文案
const sceneText = computed(() => currentScene.value === LOGIN_SCENES.CODE ? '密码登录' : '验证码登录');
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
      v-if="currentScene === LOGIN_SCENES.CODE"
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="sendLoginCode"/>

    <FormItem
      v-if="currentScene === LOGIN_SCENES.PASSWORD"
      v-model="form.password"
      label="密码"
      id="password"
      name="password"
      type="password"
      placeholder="请输入密码"/>

    <button class="form-submit-btn" type="submit">登录</button>
  </form>

  <div class="sceneText" >
    <span @click="toggleScene">使用{{ sceneText }}</span>
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
