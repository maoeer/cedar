// 加载环境变量
require('dotenv').config();

const express= require('express');
const cors = require('cors');
const path = require('path');
const userRouter = require('./routes/users');
const { initDB } = require('./db/index');

// 从环境变量读取配置
const PORT = process.env.PORT || 3000;

// 初始化 Express 实例
const app = express();
// 全局中间件配置
app.use(cors());
app.use(express.json());
app.use('/api/users', userRouter);

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