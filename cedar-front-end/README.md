# Cedar 后端管理系统前端文档
## 一、系统的创建
### 1.核心技术栈：
- 页面基础：HTML + CSS + JavaScript
- 框架核心：Vue3
- 构建工具：Vite
- 路由管理：VueRouter4
- 状态管理：Pinia、pinia-plugin-persistedstate
- 网络请求：Axios
- 版本控制：Git
- 样式预处理：Sass

### 2.项目创建
- 初始化项目 Vue3 项目
```bash
npm create vite@latest cedar-front-end -- --template vue
```

- 项目结构
```plaintext
cedar-front-end/
├── node_modules/        # 项目依赖包目录
├── public/              # 静态资源目录（不经过Vite构建）
├── src/                 # 业务代码核心目录（开发重点关注）
│   ├── assets/          # 可被Vite构建处理的静态资源
│   ├── components/      # 通用/业务组件目录
│   ├── App.vue          # 项目根组件
│   ├── main.js          # 项目入口文件
├── index.html           # Vite构建入口HTML文件
├── package-lock.json    # 依赖版本锁定文件
├── package.json         # 项目核心配置文件
├── README.md            # 项目说明文档
└── vite.config.js       # Vite构建配置文件
```

- 安装依赖
```bash
cd cedar-front-end
npm install vue-router@4 pinia axios pinia-plugin-persistedstate
npm install -D sass 
```

- 启动项目
```bash
npm run dev
```

### 3. 引入Git进行管理
- 初始化仓库
```bash
git init
```

- 创建 .gitignore 文件
```plaintext
*/node_modules
```

- 关联远程仓库
```bash
git remote add origin <仓库地址>
git add .
git commit -m "初始化仓库"
git push -u origin master
```

### 4. 配置相对路径
- 配置 vite.config.js
```typescript
import path from 'path';

export default defineConfig({
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
})
```

### 5. 封装Axios
- 在 src/utils/request.js 中
```javascript
// 导入 Axios
import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:3000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('请求发送失败（拦截器）：', error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //（后端统一返回格式：{ code: 数字, data: 数据, msg: 提示语 }）
    const res = response.data;

    // 成功
    if (res.code === 200) {
      return res.data;
    }

    // 失败
    console.error('请求失败（业务逻辑）：', res.msg || '未知错误');
    // 抛出错误
    return Promise.reject(new Error(res.msg || '未知错误'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;
```

### 6. 配置路由
- 创建组件 src/views/login/index.vue 和 src/views/home/index.vue

- 编写路由配置 src/router/index.js，使用 Hash 模式
```javascript
import { createRouter, createWebHashHistory } from 'vue-router';
import Login from '@/views/login/index.vue';
import Home from '@/views/home/index.vue';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  next();
});

export default router;
```

- 挂载路由，在 src/main.js 中
```javascript
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

- 添加路由挂载点，在 src/App.vue 中
```vue
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
```

### 7. 配置 Pinia
- 创建文件 src/stores/user.js

- 编写用户仓库
```javascript
import { defineStore } from 'pinia';

// setup 风格
export const useUserStore = defineStore('user', () => {
  return {};
});
```

- 在 src/main.js 中, 挂载 Pinia
```javascript
import { createPinia } from 'pinia';

const pinia = createPinia();

app.use(pinia);
```

- 在 src/main.js 中，挂载 pinia-plugin-persistedstate 插件进行持久化
```javascript
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
```

### 8. 全局样式
- 创建全局样式文件 src/assets/styles/index.scss 

- 编写全局样式
```scss
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  font-size: 14px;
  color: #333;
}

a {
  text-decoration: none;
  color: inherit;
}

ul {
  list-style: none;
}

button {
  border: none;
  outline: none;
  cursor: pointer;
}
```

- 在 src/main.js 中，引入
```javascript
import '@/assets/styles/index.scss';
```

- 创建全局样式变量文件，src/assets/styles/variables.scss

- vite 全局引入，在 vite.config.js 中
```javascript
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@use "@/assets/styles/variables" as *;'
      }
    }
  }
});
```

## 二、页面开发
### 1. auth 认证页面
- [index页面](./src/views/auth/index.vue)
  - [login组件](./src/views/atuh/components/Login.vue)
  - [register组件](./src/views/auth/components/Register.vue)
  - [FormItem组件](./src/views/auth/components/FormItem.vue)
  - [useCode封装公共函数](./src/views/auth/composables)
  - [form.scss公共表格样式](./src/views/auth/style/form.scss)

## 三、组件开发
### 1. Toast 消息提醒组件，src/components/Toast
- [Toast组件](./src/components/Toast/Toast.vue)
- [Toast插件](./src/components/Toast/toastPlugin.js)
将 Toast 挂载到 Vue 中:
```js
import toastPlugin from '@/components/Toast/toastPlugin';

// 挂载 Toast
app.use(toastPlugin);
```

## 四、Api 接口开发
### 1. 新建 /apis/emailApi.js, 用于编写邮箱相关的接口
- [emailApi文件](./src/apis/emailApi.js)

## 五、Pinia 的 Store
### 1. 创建 src/stores/codeStore.js
- [codeStore文件](./src/stores/codeStore.js)  