<script setup>
import { getCurrentInstance } from 'vue';

// 获取 vue 实例
const {proxy} = getCurrentInstance();
// 发送验证码
const sendCaptcha = () => {
  proxy.$toast('成功发送验证码');
}
</script>

<template>
  <form class="form">
    <div class="form-item">
      <label for="email">邮箱:</label>
      <input type="text" placeholder="请输入邮箱" id="email" name="email">
    </div>
    
    <div class="form-item">
      <label for="captcha">验证码:</label>
      <div class="form-item-captcha">
        <input type="text" placeholder="请输入验证码" id="captcha" name="captcha">
        <button @click="sendCaptcha">获取验证码</button>
      </div>
    </div>

    <button class="login-btn">登录</button>
  </form>
</template>

<style scoped lang="scss">
// 表单
.form {
  display: grid;
  gap: 20px;
}

// 表单列表
.form-item {
  display: grid;
  gap: 5px;

  // 表单输入框
  input {
    padding: 14px 16px;
    border: 1px solid $input-border-color;
    border-radius: 12px;

    &:focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
    }
  }

  // 表单验证码
  .form-item-captcha {
    display: flex;
    align-items: center;
    gap: 10px;

    // 表单验证码中的输入框
    input {
      flex: 1;
    }
    
    // 表单验证码中的按钮
    button {
      height: 100%;
      padding: 0 16px;
      border-radius: 12px;
      min-width: 120px;
      font-weight: 600;
    }
  }
}

.login-btn {
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
}
</style>