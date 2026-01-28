

# Cedar 后端管理系统

## 项目简介

Cedar 是一套完整的前后端分离的后台管理系统解决方案。该系统采用现代化的技术栈构建，前端基于 Vue.js 生态系统，后端采用 Node.js + Express 框架，数据存储使用轻量级数据库 LowDB。系统支持用户注册登录、邮箱验证等核心功能，可快速扩展以满足各类后台管理需求。

## 技术架构

### 前端技术栈

前端项目 `cedar-front-end` 采用以下核心技术构建：Vue 3 作为核心框架提供响应式组件化开发能力；Vite 作为构建工具提供极速的开发体验；Pinia 用于全局状态管理，替代了传统的 Vuex；Vue Router 处理页面路由与导航；Axios 封装 HTTP 请求实现与后端的数据交互；SCSS 预处理器提供灵活的样式编写能力。项目还包含自定义的 Toast 消息提示组件，优化用户交互体验。

### 后端技术栈

后端项目 `cedar-back-end` 基于以下技术构建：Express 框架提供简洁高效的 RESTful API 开发能力；CORS 中间件解决跨域资源共享问题；LowDB 作为本地 JSON 文件数据库，无需复杂配置即可实现数据持久化；Nodemailer 组件支持邮件发送功能，用于验证码和通知消息的推送。所有路由统一管理，支持用户管理、邮箱服务等接口扩展。

### 代码目录
- 前端代码目录: cedar-front-end
  - [前端文档](/cedar-front-end/README.md)
- 后端代码目录：cedar-back-end
  - [后端文档](/cedar-back-end/README.md) 