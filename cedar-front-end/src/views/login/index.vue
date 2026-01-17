<script setup>

</script>

<template>
  <div class="container">
    <div class="login-card">
      <header>
        <div class="logo"></div>
        <h1>欢迎回来</h1>
        <p>使用验证码登录您的账户</p>
      </header>
      <main>
        <form class="form">
          <div class="form-item">
            <label for="email">邮箱:</label>
            <input type="text" placeholder="请输入邮箱" id="email" name="email">
          </div>
          
          <div class="form-item">
            <label for="captcha">验证码:</label>
            <div class="form-item-captcha">
              <input type="text" placeholder="请输入验证码" id="captcha" name="captcha">
              <button>获取验证码</button>
            </div>
          </div>

          <button class="login-btn">登录</button>
        </form>
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 页面的容器
.container {
  width: 100vw;
  height: 100vh;
  background: #f8fafc;
  display: flex;
  justify-content: center;
  align-items: center;
}

// login卡片
.login-card {
  width: 460px;
  max-width: 100%;
  display: grid;

  header {
    text-align: center;
    padding: 40px;
  }

  main {
    padding: 0 40px;
  }
}

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