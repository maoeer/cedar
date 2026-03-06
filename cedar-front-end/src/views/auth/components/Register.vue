<script setup>
import FormItem from './FormItem.vue';
import { useCodeStore } from '@/stores/codeStore';
import { useUserStore } from '@/stores/userStore';
import { useRouter } from 'vue-router';
import { useRegister } from '../composables/useRegister';
import '../style/form.scss';

const codeStore = useCodeStore();
const userStore = useUserStore();
const router = useRouter();

const {
  form,
  sendRegisterCode,
  handleRegister
} = useRegister({ codeStore, userStore, router });
</script>

<template>
  <form class="form" @submit.prevent="handleRegister">
    <FormItem
      v-model="form.email"
      label="邮箱"
      id="email"
      name="email"
      placeholder="请输入邮箱"
    />
    
    <FormItem
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="sendRegisterCode"
    />

    <FormItem
      v-model="form.password"
      label="密码"
      id="password"
      name="password"
      placeholder="请输入密码"
      type="password"
    />

    <FormItem
      v-model="form.confirmPassword"
      label="确认密码"
      id="confirm-password"
      name="confirm-password"
      placeholder="请输入确认密码"
      type="password"
    />

    <button class="form-submit-btn" type="submit">注册</button>
  </form>
</template>

<style scoped lang="scss">
</style>
