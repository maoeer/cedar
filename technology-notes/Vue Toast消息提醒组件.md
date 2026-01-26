# Vue 右上角 Toast 组件实现笔记

## 一、需求背景

开发 Vue 项目中的 Toast 提示组件，核心要求：
1. 显示位置：页面右上角；
2. 显示时长：每条 Toast 展示 3 秒后自动消失；
3. 视觉效果：底部带剩余时间进度条；
4. 数量控制：最多同时显示 3 条，新 Toast 触发时替换最旧的 Toast；
5. 稳定性：无动画失效、定时器时序冲突、内存泄漏等问题。

## 二、核心设计思路
### CSS 原生动画 + 事件驱动
- 进度条动画：用 CSS `@keyframes` 原生实现 100% → 0% 的线性进度变化，摆脱 JS 数值控制；
- 自动移除：通过 `animationend` 事件（动画结束）触发 Toast 移除，替代定时器；
- 数量控制：仅维护 Toast 列表，超过 3 条时删除最旧项，状态极简。

## 三、完整实现代码
### 1. Toast 组件文件（src/components/Toast/Toast.vue）
```vue
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
    toastList.value.shift();
  }
};

// 动画结束后移除对应 Toast
const handleAnimationEnd = (toastId) => {
  toastList.value = toastList.value.filter(item => item.id !== toastId);
};


// 卸载时清理 Toast 列表
onUnmounted(() => {
  toastList.value = [];
});

// 暴露方法给外部调用
defineExpose({
  openToast
});
</script>

<template>
  <!-- Toast容器: 固定右上角 -->
  <div class="toast-container">
    <!-- 循环渲染 Toast 列表 -->
    <div
      v-for="toast in toastList"
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
```

### 2. 全局注册插件（src/plugins/toastPlugin.js）
```javascript
import { createVNode, render } from 'vue';
import Toast from '@/components/Toast/Toast.vue';

// 创建 Dom 容器，用于挂载 Toast 组件
const container = document.createElement('div');
document.body.appendChild(container);

// 创建 Toast 组件的虚拟节点（VNode），并渲染到容器中
let toastVNode = null;
const initToast = () => {
  toastVNode = createVNode(Toast);
  render(toastVNode, container);
};

// 全局 Toast 方法，方便调用组件的 openToast
const showToast = (message) => {
  if (!toastVNode) {
    // 初次调用时初始化组件
    initToast();
  }
  toastVNode.component.exposed.openToast(message);
};

// 注册为 Vue 组件
export default {
  install(app) {
    /**
     * 挂载到全局，调用方式：
     * import { getCurrentInstance } from 'vue'; 
     * 
     * const { proxy } = getCurrentInstance();
     * proxy.$toast('全局提示');
     */
    app.config.globalProperties.$toast = showToast;
  }
};
```

### 3. 入口文件注册（src/main.js）
```javascript
import { createApp } from 'vue';
import App from './App.vue';
import toastPlugin from './plugins/toastPlugin.js';

const app = createApp(App);
app.use(toastPlugin); // 注册Toast插件
app.mount('#app');
```

## 四、全局调用（任意组件内）
```vue
<template>
  <button @click="showToast">触发Toast</button>
</template>

<script setup>
import { getCurrentInstance } from 'vue';

const { proxy } = getCurrentInstance();

// 基础调用（默认3秒）
const showToast = () => {
  proxy.$toast('操作成功！');
};
</script>
```