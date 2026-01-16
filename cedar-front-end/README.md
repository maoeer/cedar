# Cedar 后端管理系统文档
## 一、系统的创建
### 1.核心技术栈：
- 页面基础：HTML + CSS + JavaScript
- 框架核心：Vue3
- 构建工具：Vite
- 路由管理：VueRouter4
- 状态管理：Pinia
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
npm install vue-router@4 pinia axios 
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

###6. 配置路由
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
export { router };
```

- 挂载路由
```javascript
import router from './router';

const app = createApp(App);
app.use(router);
app.mount('#app');
```

- 添加路由挂载点
```vue
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
```