# Cedar 后端管理系统前端文档
## 一、系统的创建
### 1. 核心技术栈：
- 核心技术：Nodejs、Express、dotenv、nodemailer、jsonwebtoken
- 数据库：LowDB
- 辅助工具：nodemon、cors
- VSCode插件：REST Client

### 2. 环境搭建
#### （1）初始化项目
```bash
npm init -y
```

#### (2) 安装依赖
```bash
npm install express lowdb@6 dotenv nodemailer jsonwebtoken
npm install nodemon cors --save-dev
```

#### (3) 结构目录
```plaintext
cedar-back-end/
├── db/                 # 数据库目录（手动新建）
├──├──index.js          # 数据库配置文件（手动新建）
├──├──db.json           # 数据库存储文件（手动新建）
├── node_modules/       # 依赖包目录（自动生成）
├── routes/             # 路由配置目录（手动新建）
├── test/               # 路由测试目录（手动新建）
├── utils/              # 工具函数目录（手动新建）
├── .env                # 环境变量配置文件（手动新建）
├── app.js              # 服务器入口文件（手动新建）
├── package-lock.json   # 依赖版本锁定文件（自动生成）
├── package.json        # 项目配置文件（自动生成）
└── README.md           # 文档文件（手动新建）
```

#### （4）配置环境变量（.env 文件）
```env
# 服务器端口
PORT=3000
# LowDB 数据库文件路径，在 /db 目录使用 
DB_PATH=db.json
# 邮箱配置
EMAIL_USER=发送的邮
EMAIL_PASS=SMTP授权码
# JWT 令牌配置
JWT_SECRET=jwt_maooer
JWT_EXPIRES=1d
```

### 3. 编写 app.js 入口文件
创建 app.js 文件
```javascript
// 加载环境变量
require('dotenv').config();

const express= require('express');
const cors = require('cors');

// 从环境变量读取配置
const PORT = process.env.PORT || 3000;

// 初始化 Express 实例
const app = express();
// 全局中间件配置
app.use(cors());
app.use(express.json());

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器已启动：http://localhost:${PORT}`);
});
```

### 4. 引入LowDB
#### （1）编写配置文件
```javascript
const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

// 从环境变量读取数据库路径
const DB_PATH = path.resolve(__dirname, process.env.DB_PATH || './db.json');

// 指定 JSON 文件存储数据
const adapter = new JSONFile(DB_PATH);
// 数据库默认数据
const defaultData = {};
// 初始化 LowDB 数据库
const db = new Low(adapter, defaultData);

// 初始化数据库 
const initDB = async () => {
  await db.read();
  console.log(`LowDB 数据库初始化成功！路径：${DB_PATH}`);
  return db;
};

module.exports = {
  db,
  initDB
};
```

#### （2）添加 db.json 文件
在 /db 下添加 db.json文件，并编写初始数据
> 先写一些测试数据
```json
{
  "users": [
    { "id": 1, "username": "admin", "age": 25 },
    { "id": 2, "username": "test", "age": 20 }
  ]
}
```

#### （3）在 app.js 引入
```javascript
const { initDB } = require('./db/index');

// 初始化数据库 + 启动服务器，自调用函数配合 async + await 
(async () => {
  try {
    // 先初始化数据库，再启动服务器
    await initDB();
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器已启动：http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('服务器启动失败：', err.message);
    process.exit(1); // 数据库初始化失败则退出进程
  }
})();
```

### 5. 编写路由
#### （1）创建路由文件
- [用户路由](./routes/user.js)
- [邮箱路由](./routes/email.js)

#### （2）创建路由主文件 /routes/index.js 文件
```javascript
const express = require('express');
// 引入所有子路由
const userRouter = require('./user');
const emailRouter = require('./email');

const router = express.Router();
router.use('/user', userRouter);
router.use('/email', emailRouter);
// 等等路由......

module.exports = router;
```

#### （3）在 app.js 引入
```javascript
const routes = require('./routes');

app.use('/api', routes);
```

### 6. 启动热部署
- 修改 package.json 文件
```json
{
  "scripts": {
    "dev": "nodemon app.js",
  }
}
```

- 启动项目
```bash
npm run dev
```

## 二、编写路由
### 1. 用户接口
- 获取全部用户列表
- /api/user/

```javascript
// 获取所有用户
router.get('/', async (req, res) => {
  try {
    // 读取 JSON 文件的最新数据到内存
    await db.read();
    const users = db.data.users || [];

    success(res, '获取用户列表成功', users);
  } catch (err) {
    serverError(res, '获取用户列表失败', err);
  }
});
```

### 2. 邮箱接口
- 发送邮箱
- /api/email/get-code
```json
{
  "email": "接受验证码邮箱"
}
```

```javascript
// 发送邮箱验证码
router.post('/get-code', async (req, res) => {
  try {
    // 校验邮箱
    const { email } = req.body;
    if (!email) {
      return clientError(res, '请传入邮箱地址');
    }

    // 发送验证码
    const result = await sendEmailVerifyCode(email);

    // 返回响应
    if (result.success) {
      success(res, result.message);
    } else {
      clientError(res, result.message);
    }
  } catch (err) {
    serverError(res, '发送验证码异常', err.message);
  }
});
```

## 三、工具函数
- [统一响应结构](./utils/response.js)
- [邮箱发送/验证工具](./utils/emailService.js)
- [jsonwebtoken工具](./utils/jwtService.js)