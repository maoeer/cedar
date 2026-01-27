const express = require('express');
const { success, serverError } = require('../utils/response');
const { db } = require('../db/index');

// 创建路由实例
const router = express.Router();

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



// 导出路由
module.exports = router;
