const express = require('express');
const { sendEmailVerifyCode } = require('../utils/emailService');
const { success, clientError, serverError } = require('../utils/response');
const { db } = require('../db/index');
const { isEmailValid } = require('../utils/validate');

const router = express.Router();

// 发送邮箱验证码
router.post('/get-code', async (req, res) => {
  try {
    // 校验邮箱
    const { email, scene } = req.body;
    const validScenes = ['login-code', 'register'];
    // 非有效场景
    const finalScene = validScenes.includes(scene) ? scene : validScenes[0];

    // 校验邮箱非空
    if (!email) {
      return clientError(res, '请传入邮箱地址');
    }

    // 邮箱格式校验
    if (!isEmailValid(email)) {
      return clientError(res, '请传入有效的邮箱地址');
    }

    // 查询邮箱是否已注册
    await db.read();
    const users = db.data?.users || [];
    const existingUser = users.find(user => user.email === email);

    // register 场景，邮箱必须非注册
    if (finalScene === validScenes[1]) {
      if (existingUser) {
        return clientError(res, '该邮箱已注册，请勿重复注册');
      }
    } else {
      // login/forget 场景：邮箱必须已经注册
      if (!existingUser) {
        return clientError(res, '该邮箱尚未注册');
      }
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