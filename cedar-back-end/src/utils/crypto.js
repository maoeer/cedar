const bcrypt = require('bcryptjs');

// 加盐轮数
const SALT_ROUNDS = 10;

/**
 * 加密密码
 * @param {string} password - 原始密码
 * @returns {string} 哈希后的密码
 */
exports.encryptPassword = (password) => {
  // 生成盐 + 哈希密码
  const salt = bcrypt.genSaltSync(SALT_ROUNDS);
  const hashPassword = bcrypt.hashSync(password, salt);
  return hashPassword;
};

/**
 * 校验密码
 * @param {string} password - 用户输入的原始密码
 * @param {string} hashPassword - 数据库中存储的哈希密码
 * @returns {boolean} 密码是否匹配
 */
exports.verifyPassword = (password, hashPassword) => {
  // 对比原始密码和哈希密码
  return bcrypt.compareSync(password, hashPassword);
};