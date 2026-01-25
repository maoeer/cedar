// 加载环境变量
require('dotenv').config();

const express= require('express');
const cors = require('cors');
const path = require('path');
const { Low } = require('lowdb');
const { JsonFile, JSONFile } = require('lowdb/node');

// 初始化 Express 实例
const app = express();

// 从环境变量读取配置
const PORT = process.env.PORT || 3000;
const DB_PATH = path.resolve(__dirname, process.env.DB_PATH || './db.json');

// 全局中间件配置
app.use(cors());
app.use(express.json());

// 指定 JSON 文件存储数据
const adapter = new JSONFile(DB_PATH);
// 数据库默认数据
const defaultData = {
  users: [
    { id: 1, username: 'admin', age: 25 },
    { id: 2, username: 'test', age: 20 }
  ]
};
// 初始化 LowDB 数据库
const db = new Low(adapter, defaultData);
// 预加载数据库
db.read().then(() => {
  console.log('LowDB 数据库初始化成功');
});

// 启动数据库
app.listen(PORT, () => {
  console.log(`服务器启动：http://localhost:${PORT}`);
  console.log(`数据库文件：${DB_PATH}`);
});