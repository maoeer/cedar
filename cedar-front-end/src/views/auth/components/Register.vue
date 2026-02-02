<script setup>
import FormItem from './FormItem.vue';
import { useCaptcha } from '../composables/useCaptcha';
import '../style/form.scss';

const { form, handleSendCaptcha, validateForm } = useCaptcha('register');

// 处理注册逻辑
const handleRegister = (e) => {
  e.preventDefault();

  // 表单校验
  if (!validateForm()) return;

  console.log('注册表单数据：', form.value);
};
</script>

<template>
  <form class="form">
    <FormItem
      v-model="form.email"
      label="邮箱"
      id="email"
      name="email"
      placeholder="请输入邮箱"
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

    <FormItem
      v-model="form.captcha"
      label="验证码"
      id="captcha"
      name="captcha"
      placeholder="请输入验证码"
      isCaptcha
      @sendCaptcha="handleSendCaptcha"
    />
    <button class="form-submit-btn" @click="handleRegister">注册</button>
  </form>
</template>

<style scoped lang="scss">
</style>
