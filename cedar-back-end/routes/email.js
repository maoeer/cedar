const express = require('express');
const { sendEmailVerifyCode } = require('../utils/emailService');
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

module.exports = router;