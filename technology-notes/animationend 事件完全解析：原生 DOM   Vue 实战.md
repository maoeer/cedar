# animationend 事件完全解析：原生 DOM + Vue 实战

## 一、浏览器原生 animationend 事件

### 1. 核心定义

`animationend` 是浏览器提供的**原生 DOM 事件**，专门用于监听 `CSS @keyframes 关键帧动画` 的执行结束。当元素的 CSS 动画完成全部执行周期（包括指定的延迟、循环次数）后，浏览器会自动在该元素上触发 `animationend` 事件。

关键区分：与 `transitionend` 事件不同——`transitionend` 监听 CSS `transition` 过渡效果结束，而 `animationend` 仅针对 `@keyframes` 动画，二者不可混用。

### 2. 核心特性

- **触发时机**：动画完整执行完毕后触发（若设置 `animation-iteration-count: infinite` 无限循环，不会触发）；

- **事件冒泡**：支持冒泡，可在父元素监听子元素的 `animationend` 事件；

- **浏览器兼容**：现代浏览器（Chrome/Firefox/Safari/Edge）全支持，Safari 早期版本需加私有前缀 `webkitAnimationEnd`（无需手动处理，Vue 会自动兼容）。

### 3. 原生 DOM 用法

#### （1）基础绑定方式（两种核心写法）

##### 写法1：HTML 内联绑定（不推荐，耦合性高）

```HTML

<!-- 内联绑定事件，直接调用全局函数 -->
<div class="progress" onanimationend="handleAnimationEnd()"></div>

<script>
// 全局回调函数
function handleAnimationEnd() {
  console.log("原生动画执行完毕");
  // 业务逻辑：移除动画元素
  document.querySelector('.progress').remove();
}
</script>
```

##### 写法2：JS addEventListener 绑定（推荐，解耦）

```HTML

<!-- 定义带CSS关键帧动画的元素 -->
<div class="progress"></div>

<style>
.progress {
  width: 100%;
  height: 3px;
  background: #409eff;
  /* 定义3秒线性进度条动画 */
  animation: progress 3s linear forwards;
}

/* 进度条动画：从100%收缩到0% */
@keyframes progress {
  0% { width: 100%; }
  100% { width: 0%; }
}
</style>

<script>
// 1. 获取DOM元素
const progressElement = document.querySelector('.progress');

// 2. 绑定animationend事件
progressElement.addEventListener('animationend', function(e) {
  console.log("动画结束事件触发");
  console.log("触发动画名称：", e.animationName); // 输出：progress
  console.log("触发事件的元素：", e.target); // 输出：<div class="progress"></div>
  // 动画结束后移除元素
  e.target.remove();
});

// 兼容Safari早期版本（可选，现代浏览器无需）
progressElement.addEventListener('webkitAnimationEnd', function(e) {
  e.target.remove();
});
</script>
```

### 4. animationend 事件对象核心属性

触发事件时，回调函数会接收一个 `Event` 对象，包含以下关键属性（开发中高频使用）：

|属性名|说明|
|---|---|
|`animationName`|触发事件的动画名称（对应 CSS `@keyframes` 后的名称，如上述的 "progress"）|
|`target`|触发事件的 DOM 元素（即动画所在的元素）|
|`bubbles`|布尔值，标识事件是否冒泡|
|`elapsedTime`|动画执行的总时长（秒），不包含 `animation-delay` 延迟时间|
### 5. 原生使用注意事项

1. 无限循环动画（`animation-iteration-count: infinite`）不会触发 `animationend`；

2. 动画执行前元素被移除/隐藏（如 `display: none`），动画终止，不会触发事件；

3. 一个元素绑定多个 CSS 动画时，每个动画结束都会触发一次 `animationend`；

4. 事件支持冒泡，若不需要冒泡，可通过 `e.stopPropagation()` 阻止。

## 二、Vue 中使用 @animationend（语法糖）

Vue 对原生 DOM 事件做了封装，`@animationend` 是 `animationend` 事件的**模板语法糖**（类似 `@click` 对应原生 `click` 事件），用法更简洁，且自动兼容浏览器私有前缀（如 `webkitAnimationEnd`）。

### 1. Vue 基础用法

#### （1）基础绑定与回调

```Plain Text

<template>
  <!-- 绑定@animationend事件，调用回调函数 -->
  <div 
    class="progress"
    @animationend="handleAnimationEnd"
  ></div>
</template>

<script setup>
// 动画结束回调函数
const handleAnimationEnd = (e) => {
  console.log("Vue 中动画结束", e.animationName);
  // 业务逻辑：修改响应式数据/操作DOM
};
</script>

<style scoped>
.progress {
  width: 100%;
  height: 3px;
  background: #409eff;
  animation: progress 3s linear forwards;
}

@keyframes progress {
  0% { width: 100%; }
  100% { width: 0%; }
}
</style>
```

#### （2）传递自定义参数（如元素ID）

实际开发中常需传递额外参数（如 Toast 的唯一 ID），可通过箭头函数实现：

```Plain Text

<template>
  <!-- 循环渲染Toast，传递每个Toast的ID -->
  <div 
    v-for="toast in toastList"
    :key="toast.id"
    class="toast-progress"
    @animationend="() => handleToastEnd(toast.id)"
  ></div>
</template>

<script setup>
import { ref } from 'vue';

const toastList = ref([
  { id: 1, message: "操作成功" },
  { id: 2, message: "数据加载完成" }
]);

// 动画结束后移除对应ID的Toast
const handleToastEnd = (toastId) => {
  toastList.value = toastList.value.filter(item => item.id !== toastId);
};
</script>
```

### 2. Vue 实战案例：Toast 组件自动移除

结合 `animationend` 实现 Toast 进度条动画结束后自动移除，替代传统定时器方案，彻底解决时序冲突、内存泄漏问题：

```Plain Text

<template>
  <!-- Toast容器：固定在页面右上角 -->
  <div class="toast-container">
    <div 
      v-for="(toast, index) in toastList"
      :key="toast.id"
      class="toast-item"
      :style="{ top: `${index * 60}px` }"
    >
      <div class="toast-content">{{ toast.message }}</div>
      <!-- 进度条：动画结束触发移除逻辑 -->
      <div
        class="toast-progress"
        @animationend="() => removeToast(toast.id)"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 维护Toast列表
const toastList = ref([]);
let toastId = 0;

// 对外暴露：触发Toast显示
const openToast = (message) => {
  toastList.value.push({
    id: ++toastId,
    message
  });
  // 最多显示3条，超过则移除最旧的
  if (toastList.value.length > 3) {
    toastList.value.shift();
  }
};

// 动画结束移除对应Toast
const removeToast = (toastId) => {
  toastList.value = toastList.value.filter(item => item.id !== toastId);
};

// 暴露方法供外部调用
defineExpose({ openToast });
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.toast-item {
  width: 300px;
  height: 50px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  position: relative;
  overflow: hidden;
}

.toast-content {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 16px;
  font-size: 14px;
  color: #333;
}

.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: #409eff;
  /* 3秒线性进度条动画 */
  animation: progress 3s linear forwards;
}

@keyframes progress {
  0% { width: 100%; }
  100% { width: 0%; }
}
</style>
```

### 3. Vue 进阶使用技巧

#### （1）区分多动画（结合事件对象）

当一个元素绑定多个 CSS 动画时，可通过事件对象的 `animationName` 过滤目标动画：

```Plain Text

<template>
  <div 
    class="box"
    @animationend="(e) => handleMultiAnimation(e, toast.id)"
  ></div>
</template>

<script setup>
const handleMultiAnimation = (e, toastId) => {
  // 仅处理进度条动画（过滤掉其他动画）
  if (e.animationName === 'progress') {
    removeToast(toastId);
  }
};
</script>

<style>
.box {
  /* 元素绑定多个动画 */
  animation: progress 3s linear forwards, fade 0.5s ease;
}

/* 渐隐动画 */
@keyframes fade {
  0% { opacity: 0; }
  100% { opacity: 1; }
}
</style>
```

#### （2）阻止事件冒泡

避免子元素的 `animationend` 事件冒泡到父元素，干扰其他逻辑：

```Plain Text

<template>
  <div class="toast-item" @animationend="parentHandle">
    <!-- 子元素进度条：阻止事件冒泡 -->
    <div 
      class="toast-progress"
      @animationend="(e) => {
        e.stopPropagation(); // 阻止冒泡
        removeToast(toast.id);
      }"
    ></div>
  </div>
</template>
```

#### （3）全局注册 Toast 组件后使用

将 Toast 封装为全局插件，在任意组件中通过 `this.$toast` 调用：

```JavaScript

// src/plugins/toast.js
import { createVNode, render } from 'vue';
import Toast from '../components/Toast.vue';

// 创建DOM容器
const container = document.createElement('div');
document.body.appendChild(container);

let toastVNode = null;
// 全局Toast方法
const openToast = (message) => {
  if (!toastVNode) {
    toastVNode = createVNode(Toast);
    render(toastVNode, container);
  }
  toastVNode.component.exposed.openToast(message);
};

// 注册为Vue插件
export default {
  install(app) {
    app.config.globalProperties.$toast = openToast;
  }
};

// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import toastPlugin from './plugins/toast.js';

const app = createApp(App);
app.use(toastPlugin); // 注册插件
app.mount('#app');

// 任意组件中调用
<script setup>
import { getCurrentInstance } from 'vue';
const { proxy } = getCurrentInstance();
// 触发全局Toast
proxy.$toast("全局调用的Toast提示");
</script>
```

## 三、核心总结

1. **原生层面**：`animationend` 是监听 CSS `@keyframes` 动画结束的原生事件，与 `transitionend` 分工明确，需注意无限循环动画不触发、多动画需过滤；

2. **Vue 层面**：`@animationend` 是原生事件的语法糖，自动兼容浏览器前缀，支持传递自定义参数、阻止冒泡；

3. **最佳实践**：替代定时器实现“动画结束后执行业务逻辑”（如 Toast 自动移除），精准无时序冲突、零内存泄漏风险。
> （注：文档部分内容可能由 AI 生成）