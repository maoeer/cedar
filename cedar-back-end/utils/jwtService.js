const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES = process.env.JWT_EXPIRES;

/**
 * 生成 JWT token
 * @param {Object} payload - 存入 Token 数据
 * @returns {String} 生成的 Token 字符串
 */
const generateToken = (email) => {
  try {
    return jwt.sign(
        { email }, 
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES }
    );
  } catch (err) {
    throw new Error('Token 生成失败');
  }
};

/**
 * 验证 Token 是否有效
 * @param {String} token - 前端传入的 Token 字符串
 * @returns {Object} 校验结果 { success: boolean, data: 解析后的载荷 }
 */
const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return {
      success: true,
      data: decoded
    };
  } catch (err) {
    let message = 'Token 无效';
    if (err.name === 'TokenExpiredError') {
      message = 'Token 已过期';
    } else if (err.name === 'JsonWebTokenError') {
      message = 'Token 格式错误或秘钥不匹配';
    }

    return {
      success: false,
      data: message
    };
  }
};

module.exports = {
  generateToken,
  verifyToken
};