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
// 最大用户 id
let maxUserId = 0;

// 初始化数据库 
const initDB = async () => {
  await db.read();
  console.log(`LowDB 数据库初始化成功！路径：${DB_PATH}`);

  const users = db.data.users || [];
  // 无用户数据，从 0 开始自增
  if (users.length <= 0) {
    maxUserId = 0; 
    return db;
  }

  // 最大 id 非正数，从 0 开始自增
  const validIds = users
    .map(user => user.id)
    .filter(id => typeof id === 'number' && id > 0);
  if (validIds.length <= 0) {
    maxUserId = 0; 
    return db;
  }

 // 获取到最大的 userId
  maxUserId = Math.max(...validIds);
  return db;
};

// 获得最大的 userId
const getMaxUserId = () => maxUserId;
// 赋值最大的 userId
const setMaxUserId = (newId) => {
  if (typeof newId === 'number' && newId > maxUserId) {
    maxUserId = newId;
  }
};

module.exports = {
  db,
  initDB,
  getMaxUserId,
  setMaxUserId
};
