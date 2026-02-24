const express = require('express');
const bcrypt = require('bcryptjs');
const { success, serverError, clientError } = require('../utils/response');
const { db, generateID } = require('../db/index');
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
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    // 校验必要性
    if (!email) {
      return clientError(res, '请传入登录邮箱');
    }
    if (!password) {
      return clientError(res, '请传入登录密码');
    }

    // 2. 校验邮箱格式
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailReg.test(email)) {
      return clientError(res, '请传入有效的邮箱地址');
    }

    // 校验邮箱是否注册
    await db.read();
    const users = db.data?.users || [];
    const existingUser = users.find(user => user.email === email);
    if (!existingUser) {
      return clientError(res, '该邮箱尚未注册');
    }

    // 校验密码
    const isPasswordValid = bcrypt.compareSync(password, existingUser.password);
    if (!isPasswordValid) {
      return clientError(res, '密码错误，请重新输入');
    }

    // 生成 JWT 令牌
    const token = generateToken(email);

    // 返回登录成功响应
    success(res, '登录成功', {
      token,
      user: {
        id: existingUser.id,
        email: existingUser.email,
        username: existingUser.username
      }
    });
  } catch (err) {
    serverError(res, '登录异常', err.message);
  }
});

// 用户注册
router.post('/register', async (req, res) => {
  try {
    const { email, code, password, confirmPassword } = req.body || {};

    // 基础参数非空校验
    if (!email) {
      return clientError(res, '请传入注册邮箱');
    }
    if (!code) {
      return clientError(res, '请传入验证码');
    }
    if (!password) {
      return clientError(res, '请设置登录密码');
    }
    if (!confirmPassword) {
      return clientError(res, '请确认登录密码');
    }

    // 邮箱格式校验
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailReg.test(email)) {
      return clientError(res, '请输入有效的邮箱地址');
    }
    // 验证码格式校验（6位数字）
    const verifyCode = String(code).trim();
    if (!/^\d{6}$/.test(verifyCode)) {
      return clientError(res, '请传入6位数字验证码');
    }
    // 密码长度校验
    if (password.length < 6) {
      return clientError(res, '密码长度不能少于6位');
    }
    // 密码一致性校验（核心）
    if (password !== confirmPassword) {
      return clientError(res, '两次输入的密码不一致，请重新输入');
    }

    // 校验邮箱是否已注册
    await db.read();
    const users = db.data?.users || [];
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
      return clientError(res, '该邮箱已注册');
    }

    // 校验验证码是否有效
    const codeVerifyResult = verifyEmailCode(email, verifyCode);
    if (!codeVerifyResult.success) {
      return clientError(res, codeVerifyResult.message);
    }

    // 密码加密
    const saltRounds = 10;
    const hashedPassword = bcrypt.hashSync(password, saltRounds);

    // 构造用户数据并写入数据库
    const newUser = {
      id: generateID(),
      email: email.trim(),
      password: hashedPassword,
      createTime: new Date().toISOString()
    };

    // 写入LowDB并持久化
    users.push(newUser);
    db.data.users = users;
    await db.write();

    // 返回注册成功响应
    success(res, '注册成功', {
      user: {
        id: newUser.id,
        email: newUser.email
      }
    });
  } catch (error) {
    // 全局异常捕获
    serverError(res, '注册异常', error.message);
  }
});

// 导出路由
module.exports = router;
