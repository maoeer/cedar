<script setup>
import FormItem from './FormItem.vue';
import { useForm } from '../composables/useForm';
import '../style/form.scss';

const { form, handleSendCode, handleRegister } = useForm('register');

// 处理注册逻辑
const handleRegisterSubmit = (e) => {
  e.preventDefault();

 // 2. 调用注册核心方法
  handleRegister();
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
      v-model="form.code"
      label="验证码"
      id="code"
      name="code"
      placeholder="请输入验证码"
      isCode
      @sendCode="handleSendCode"
    />
    <button class="form-submit-btn" @click="handleRegisterSubmit">注册</button>
  </form>
</template>

<style scoped lang="scss">
</style>
