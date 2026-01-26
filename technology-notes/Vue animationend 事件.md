# Vue animationend 事件解析：原生 DOM + Vue 实战
## 一、浏览器原生 animationend 事件
### 1. 核心定义
`animationend` 是浏览器提供的**原生 DOM 事件**，专门用于监听 `CSS @keyframes 关键帧动画` 的执行结束。当元素的 CSS 动画完成全部执行周期（包括指定的延迟、循环次数）后，浏览器会自动在该元素上触发 `animationend` 事件。
关键区分：与 `transitionend` 事件不同——`transitionend` 监听 CSS `transition` 过渡效果结束，而 `animationend` 仅针对 `@keyframes` 动画，二者不可混用。

### 2. 原生 DOM 用法
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

### 3. animationend 事件对象核心属性
触发事件时，回调函数会接收一个 `Event` 对象，包含以下关键属性（开发中高频使用）：
|属性名|说明|
|---|---|
|`animationName`|触发事件的动画名称（对应 CSS `@keyframes` 后的名称，如上述的 "progress"）|
|`target`|触发事件的 DOM 元素（即动画所在的元素）|
|`bubbles`|布尔值，标识事件是否冒泡|
|`elapsedTime`|动画执行的总时长（秒），不包含 `animation-delay` 延迟时间|

### 4. 原生使用注意事项
1. 无限循环动画（`animation-iteration-count: infinite`）不会触发 `animationend`；
2. 动画执行前元素被移除/隐藏（如 `display: none`），动画终止，不会触发事件；
3. 一个元素绑定多个 CSS 动画时，每个动画结束都会触发一次 `animationend`；
4. 事件支持冒泡，若不需要冒泡，可通过 `e.stopPropagation()` 阻止。

## 二、Vue 中使用 @animationend（语法糖）
Vue 对原生 DOM 事件做了封装，`@animationend` 是 `animationend` 事件的**模板语法糖**（类似 `@click` 对应原生 `click` 事件），用法更简洁，且自动兼容浏览器私有前缀（如 `webkitAnimationEnd`）。

### Vue 基础用法
#### 基础绑定与回调

```vue
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

## 三、核心总结
1. **原生层面**：`animationend` 是监听 CSS `@keyframes` 动画结束的原生事件，与 `transitionend` 分工明确，需注意无限循环动画不触发、多动画需过滤；
2. **Vue 层面**：`@animationend` 是原生事件的语法糖，自动兼容浏览器前缀，支持传递自定义参数、阻止冒泡；
3. **最佳实践**：替代定时器实现“动画结束后执行业务逻辑”（如 Toast 自动移除），精准无时序冲突、零内存泄漏风险。
