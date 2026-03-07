/**
 * 邮箱格式校验（仅返回布尔值）
 * @param {string} email - 待校验的邮箱地址
 * @returns {boolean} 校验结果：true=格式正确，false=格式错误/空值
 */
export const isEmailValid = (email) => {
  if (!email || email.trim() === '') return false;

  const emailRegex = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  return emailRegex.test(email.trim());
};