<script setup>
import { ref, onUnmounted } from 'vue';

// 维护 Toast 列表，每个 Toast 有唯一ID、文本、进度
const toastList = ref([]);
// 自增ID：确保每个 toast 有唯一ID
let toastId = 0;

// 对外暴露的方法：触发 Toast 显示
const openToast = (msg) => {
  // 创建新 Toast 对象
  const newToast = {
    id: ++toastId,
    message: msg
  };

  // 添加新 Toast 到列表
  toastList.value.push(newToast);
  // 超过3条删除最旧的
  if (toastList.value.length > 3) {
    // 先删除最旧 Toast 的定时器
    const oldToast = toastList.value.shift();
  }
};

// 动画结束后移除对应 Toast
const handleAnimationEnd = (toastId) => {
  toastList.value = toastList.value.filter(item => item.id !== toastId);
};


// 卸载时清理定时器
onUnmounted(() => {
  timers.forEach(timer => clearTimeout(timer));
  timers.clear();
});

// 暴露方法给外部调用
defineExpose({
  openToast
});
</script>

<template>
  <!-- Toast容器: 固定右上角 -->
  <div class="toast-container">
    <!-- 循环渲染 Toast 列表: 每条 Toast 垂直偏移 60px (50px高度 + 10px 间距) -->
    <div
      v-for="(toast, index) in toastList"
      :key="toast.id"
      class="toast-item">
      
      <!-- 提示内容 -->
      <div class="toast-content">{{ toast.message }}</div>

      <!-- 进度条 -->
      <div
        class="toast-progress"
        @animationend="handleAnimationEnd(toast.id)">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// 固定在右上角，层级最高 
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

// 单个 Toast 样式
.toast-item {
  width: 300px;
  height: 50px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
}

// Toast 内容居中
.toast-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: #333;
}

// 进度条样式
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: #409eff;
  width: 100%;
  animation: toastProgress 3s linear forwards;
}

// 定义进度条动画
@keyframes toastProgress {
  0% {
    width: 100%;
  }

  100% {
    width: 0%;
  }
}
</style>