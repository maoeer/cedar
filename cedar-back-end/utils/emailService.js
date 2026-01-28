const nodemailer = require('nodemailer');

// 配置邮件传输器
const transporter = nodemailer.createTransport({
  host: 'smtp.qq.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 存储验证码
// 结构：{ toEmail: { code: 验证码（string）, expire: 过期时间（number） } }
const emailCodeStore = {};

// 生成 6 位验证码
const generateVerifyCode = () => {
  // 0-9 A-Z
  const charPool = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let verifyCode = '';

  for (let i = 0; i < 6; i++) {
    // 生成 0 到 (charPool.length - 1) 的下标
    const randomIndex = Math.floor(Math.random() * charPool.length);
    verifyCode += charPool[randomIndex];
  }

  return verifyCode;
};

// 发送邮箱验证码
const sendEmailVerifyCode = async (toEmail) => {
  try {
    const emailRegex =  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(toEmail)) {
      return {
        success: false,
        message: '邮箱格式不正确'
      }
    }

    // 生成验证码和过期时间（有效期 5 分钟）
    const verifyCode = generateVerifyCode();
    const expireTime = Date.now() + 5 * 60 * 1000;

    // 存储验证码
    emailCodeStore[toEmail] = {
      code: verifyCode,
      expire: expireTime
    };

    // 配置邮箱内容
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: '邮箱验证码（有效期 5 分钟）',
      html: `
        <div>
          <span style="font-size: 24px; font-weight: bold;">${verifyCode}</span>
        </div>
      `
    };

    // 发送邮箱
    await transporter.sendMail(mailOptions);

    return {
      success: true,
      message: '验证码发送成功'
    }
  } catch (err) {
    return {
      success: false,
      message: '验证码发送失败'
    }
  }
};

// 邮箱验证是否有效
const verifyEmailCode = (toEmail, inputCode) => {
  // 检查是否发送验证码
  const codeInfo = emailCodeStore[toEmail];
  if (!codeInfo) {
    return {
      success: false,
      message: '邮箱未发送验证码'
    }
  }

  // 检查验证码是否过期
  if (Date.now() > codeInfo.expire) {
    delete emailCodeStore[toEmail];
    return {
      success: false,
      message: '验证码已过期'
    }
  }

  // 检查验证码是否匹配
  if (codeInfo.code !== inputCode) {
    return {
      success: false,
      message: '验证码输入错误'
    }
  }

  // 验证码通过
  delete emailCodeStore[toEmail];
  return {
    success: true,
    message: '验证码正确'
  }
};

module.exports = {
  sendEmailVerifyCode,
  verifyEmailCode
}