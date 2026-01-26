# 笔记：index.scss 与 variables.scss 引入方式不同的原因

## 核心前提

根本原因是 **「文件职责不同」「生效阶段不同」**，需匹配Vite工具定位配置，实现高效无冗余。

|文件名称|核心职责|内容特性|生效阶段|
|---|---|---|---|
|`variables.scss`|提供全局工具类（变量/混合器）|仅定义`$xxx`、`@mixin`，无渲染规则|SCSS编译阶段|
|`index.scss`|提供全局渲染样式|含具体CSS规则（如`* {}`），作用于DOM|浏览器运行阶段|
## 一、variables.scss：配置在vite.config.js的additionalData中

### 引入方式

```JavaScript

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables" as *;`
      }
    }
  }
});
```

### 核心原因

1. 组件内免手动导入，直接使用变量/混合器，提升效率；

2. 编译阶段生效，`@use`自带去重，无运行时冗余；

3. 匹配additionalData“注入编译工具类”的设计定位。

## 二、index.scss：在main.js中一次性导入

### 引入方式

```JavaScript
// src/main.js
import '@/assets/styles/index.scss';
```

### 核心原因

1. main.js为入口仅执行一次，确保全局样式加载一次；

2. 避免组件编译时重复注入，控制打包体积；

3. 适配运行时逻辑，兼容空白电脑打包使用场景。

## 三、配合逻辑

1. 编译阶段：自动注入variables.scss，提供工具类支持；

2. 构建阶段：index.scss引用变量，编写全局样式；

3. 运行阶段：main.js导入index.scss，全局样式生效，组件直接用变量。

## 四、核心总结

本质是 **「职责匹配工具，阶段分离配置」**：

1. 工具类（variables.scss）→ 配vite.config.js，编译阶段高效无冗余；

2. 渲染类（index.scss）→ 配main.js，运行阶段全局仅加载一次；

3. 最终实现极简配置、优化打包，适配空白电脑使用。