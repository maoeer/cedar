<script setup>
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
</script>

<template>
  <!-- layout -->
  <div class="layout">
    <!-- topbar -->
    <div class="topbar"></div>

    <!-- sidebar -->
    <div class="sidebar"></div>

    <!-- content -->
    <div class="content"></div>
  </div>
</template>

<style scoped lang="scss">
$topbar-heigth: 70px;
$sidebar-width: 268px;

.layout {
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .topbar {
    position: fixed;
    left: $sidebar-width;
    right: 0;
    height: $topbar-heigth;
    background-color: brown;
  }

  .sidebar {
    position: fixed;
    top: 0;
    bottom: 0;
    width: $sidebar-width;
    background-color: cornflowerblue;
  }

  .content {
    margin-top: $topbar-heigth;
    margin-left: $sidebar-width;
    min-height: 80vh;
    background-color: darkgreen;
  }
}
</style>
