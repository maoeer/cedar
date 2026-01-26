const { Low } = require('lowdb');
const { JSONFile } = require('lowdb/node');
const path = require('path');

// 从环境变量读取配置
const PORT = process.env.PORT || 3000;
// 从环境变量读取数据库路径
const DB_PATH = path.resolve(__dirname, process.env.DB_PATH || './db.json');

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