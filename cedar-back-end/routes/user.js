const express = require('express');
const { db } = require('../db/index');

// 创建路由实例
const router = express.Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = db.data.users;
    res.send({
      code: 200,
      message: '获取用户列表成功',
      data: users
    });
  } catch (err) {
    res.status(500).send({
      code: 500,
      message: '获取用户列表失败',
      error: err.message
    });
  }
});

// 导出路由
module.exports = router;