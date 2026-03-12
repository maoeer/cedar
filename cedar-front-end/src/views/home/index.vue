<script setup>
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
</script>

<template>
  <router-link to="/auth/login">登录页面</router-link>

  <div>
    <button @click="userStore.logout()">退出登录</button>
  </div>

</template>

<style scoped lang="scss">

</style>
