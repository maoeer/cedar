<script setup>
import FormItem from './FormItem.vue';
import { getCurrentInstance } from 'vue';
import '../style/form.scss';

// 获取 vue 实例
const {proxy} = getCurrentInstance();
// 发送验证码
const sendCaptcha = () => {
  proxy.$toast('成功发送验证码');
}
</script>

<template>
  <form class="form">
    <FormItem
      label="邮箱"
      id="email"
      name="email"
      placeholder="请输入邮箱"
    />
    <FormItem
      label="验证码"
      id="captcha"
      name="captcha"
      placeholder="请输入验证码"
      isCaptcha
      @sendCaptcha="sendCaptcha"
    />

    <button class="form-submit-btn">登录</button>
  </form>
</template>

<style scoped lang="scss">
</style>
