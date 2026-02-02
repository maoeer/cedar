<script setup>
import Tab from './components/Tab.vue';
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
        <Tab></Tab>
        <RouterView></RouterView>
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
  position: relative;
  background: #fff;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  z-index: 1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 180px;
    background: linear-gradient(135deg, $primary-color);
    clip-path: ellipse(100% 65% at 50% 0);
    z-index: -1;
  }

  header {
    text-align: center;
    color: #fff;
    padding: 40px;
  }

  main {
    padding: 0 40px 40px;
  }
}
</style>
