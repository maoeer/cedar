/**
 * 邮箱格式校验
 * @param {string} email - 待校验的邮箱地址
 * @returns {boolean} 校验结果：true=格式正确，false=格式错误/空值
 */
exports.isEmailValid = (email) => {
  // 空值返回 false
  if (!email || email.trim() === '') return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim());
};

/**
 * 校验验证码格式
 * @param {number} code - 待校验的验证码
 * @returns {boolean} 校验结果：true=格式正确，false=格式错误/空值
 */
exports.isCodeValid = (code) => {
  // 空值返回 false
  if (!code) return false;

  // 转字符串去除左右空格
  const verifyCode = String(code).trim();

  // 空字符串返回 false
  if (verifyCode === '') return false;

  const codeRegex = /^\d{6}$/;
  return codeRegex.test(verifyCode);
};