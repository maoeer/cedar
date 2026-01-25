# Cedar 后端管理系统前端文档
## 一、系统的创建
### 1. 核心技术栈：
- 核心技术：Nodejs、Express、LowDB、dotenv
- 辅助工具：nodemon、cors
- VSCode插件：REST Client

### 2. 环境搭建
#### （1）初始化项目
```bash
npm init -y
```

#### (2) 安装依赖
```bash
npm install express lowdb@6 dotenv
npm install nodemon cors --save-dev
```

#### (3) 结构目录
```plaintext
cedar-back-end/
├── node_modules/       # 依赖包目录（自动生成）
├── .env                # 环境变量配置文件（手动新建）
├── app.js              # 服务器入口文件（手动新建）
├── package.json        # 项目配置文件（自动生成）
└── package-lock.json   # 依赖版本锁定文件（自动生成）
```

### 3. LowDB实现
#### (1)  配置环境变量（.env 文件）
```env
# 服务器端口
PORT=3000
# LowDB 数据库文件路径
DB_PATH=./db.json
```
