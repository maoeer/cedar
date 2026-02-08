<script setup>
import FormItem from './FormItem.vue';
import { useCaptcha } from '../composables/useCaptcha';
import '../style/form.scss';

const { form, handleSendCaptcha, validateForm } = useCaptcha();

// 处理登录逻辑
const handleLogin = (e) => {
  e.preventDefault();

  // 表单校验
  if (!validateForm()) return;

  console.log('登录表单数据：', form.value);
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
      v-model="form.captcha"
      label="验证码"
      id="captcha"
      name="captcha"
      placeholder="请输入验证码"
      isCaptcha
      @sendCaptcha="handleSendCaptcha"/>

    <button class="form-submit-btn" @click="handleLogin">登录</button>
  </form>
</template>

<style scoped lang="scss">
</style>
