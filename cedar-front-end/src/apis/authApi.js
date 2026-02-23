/**
 * 登录接口
 * @param {Object} form - 登录表单（邮箱、验证码）
 * @returns {Promise} 
 */
export const login = (form) => {
  return request.post('/auth/login', {
    email: form.email,
    code: form.code
  })
};

/**
 * 注册表单
 * @param {Object} form - 注册表单（邮箱、验证码、密码、确认密码）
 * @returns {Promise}
 */
export const register = (form) => {
  return request.post('/auth/register', {
    email: form.email,
    code: form.code,
    password: form.password,
    confirmPassword: form.confirmPassword
  });
};
