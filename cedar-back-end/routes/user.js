const express = require('express');
const { success, serverError, clientError } = require('../utils/response');
const { db } = require('../db/index');
const { verifyEmailCode } = require('../utils/emailService');
const { generateToken } = require('../utils/jwtService');

// 创建路由实例
const router = express.Router();

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    // 读取 JSON 文件的最新数据到内存
    await db.read();
    const users = db.data?.users || [];

    success(res, '获取用户列表成功', users);
  } catch (err) {
    serverError(res, '获取用户列表失败', err);
  }
});

// 用户登录
router.post('/login', async () => {
  try {
    const { email, code } = req.body || {};

    // 校验必要性
    if (!email) {
      return clientError(res, '请传入登录邮箱');
    }
    if (!code) {
      return clientError(res, '请传入验证码');
    }

    // 校验验证码格式
    const verifyCode = String(code).trim();
    if (!/^\d{6}$/.test(verifyCode)) {
      return clientError(res, '请传入6位数字验证码');
    }

    // 校验邮箱是否注册
    await db.read();
    const users = db.data?.users || [];
    const existingUser = users.find(user => user.email === email);
    if (!existingUser) {
      return clientError(res, '该邮箱尚未注册');
    }

    // 校验验证码是否有效
    const codeVerifyResult = verifyEmailCode(email, verifyCode);
    if (!codeVerifyResult.success) {
      return clientError(res, codeVerifyResult.message);
    }

    // 生成 JWT 令牌
    const token = generateToken(email);

    // 返回登录成功响应
    success(res, '登录成功', {
      token,
      user: {
        email: existingUser.email,
        ...existingUser
      }
    });
  } catch (err) {
    serverError(res, '登录异常', err.message);
  }
});

// 导出路由
module.exports = router;
