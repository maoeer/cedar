const express = require('express');
const { sendEmailVerifyCode, verifyEmailCode } = require('../utils/emailService');
const { generateToken } = require('../utils/jwtService.js');
const { success, clientError, serverError } = require('../utils/response');

const router = express.Router();

// 发送邮箱验证码
router.post('/get-code', async (req, res) => {
  try {
    // 校验邮箱
    const { email } = req.body;
    if (!email) {
      return clientError(res, '请传入邮箱地址');
    }

    // 查询邮箱是否已注册
    await db.read();
    const existingUser = db.get('users')
      .find({ email })
      .value();
    if (!existingUser) {
      return clientError(res, '该邮箱尚未注册');
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

// 校验验证码
router.post('/verify-code', (req, res) => {
  try {
    const { email, code } = req.body || {};

    // 校验邮箱是否为空
    if (!email) {
      return clientError(res, '请传入接收验证码的邮箱地址');
    }
    // 校验验证码是否为空
    if (!code) {
      return clientError(res, '请传入6位验证码');
    }
    // 校验验证码格式
    const verifyCode = String(code).trim();
    if (!/^\d{6}$/.test(verifyCode)) {
      return clientError(res, '验证码格式错误');
    }
    
    // 校验验证码是否正确
    const result = verifyEmailCode(email, verifyCode);
    if (!result.success) {
      return clientError(res, result.message);
    }

    // 生成令牌
    const token = generateToken({
      email
    });

    success(res, result.message, token);
  } catch (err) {
    serverError(res, '校验验证码异常', err.message);
  }
});

module.exports = router;