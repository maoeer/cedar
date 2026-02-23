<script setup>
import FormItem from './FormItem.vue';
import { useForm } from '../composables/useForm';
import '../style/form.scss';

const { form, handleSendCode, validateForm, handleLogin } = useForm();

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
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="handleSendCode"/>

    <button class="form-submit-btn" @click="login">登录</button>
  </form>
</template>

<style scoped lang="scss">
</style>
