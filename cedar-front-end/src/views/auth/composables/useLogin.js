import { ref } from 'vue';
import { sendEmailCode } from '@/apis/emailApi';
import { login, register } from '@/apis/userApi';
import { showToast } from '@/components/Toast/toastPlugin';

// 使用表单的场景
const LOGIN_SCENES = {
  CODE: 'login-code',
  PASSWORD: 'login-password'
};

/**
 * 登录专属逻辑
 * @param {Object} options 外部依赖
 * @param {Object} options.codeStore 验证码状态仓库
 * @param {Object} options.userStore 用户状态仓库
 * @param {Object} options.router 路由实例
 */
export const useLogin = ({ codeStore, userStore, router }) => {
  // 当前登录场景（默认验证码登录）
  const currentScene = ref(LOGIN_SCENES.CODE);
  // 核心表单数据（固定字段，无动态拼接）
  const form = ref({
    email: '',
    code: '',
    password: ''
  });
  // 提交加载状态（防重复提交)
  const loading = ref(false);

  // 切换登录场景
  const toggleScene = () => {
    const oldEmail = form.value.email;
    currentScene.value = currentScene.value === LOGIN_SCENES.CODE
      ? LOGIN_SCENES.PASSWORD
      : LOGIN_SCENES.CODE;
    // 保留已输入的邮箱，重置其他字段
    form.value = { email: oldEmail, code: '', password: '' };
  };

  // 发送登录验证码
  const sendLoginCode = async () => {
    // 非验证码场景禁止调用
    if (currentScene.value !== LOGIN_SCENES.CODE) return;
    // 邮箱非空校验
    if (!form.value.email) return showToast('请输入邮箱');
    // 倒计时未结束禁止重复发送
    if (codeStore.emailRemainSeconds > 0) return showToast('请勿重复发送验证码');

    try {
      // 触发倒计时
      codeStore.setEmailSendTime();
      // 调用接口（指定登录场景）
      await sendEmailCode({ email: form.value.email, scene: LOGIN_SCENES.CODE });
      showToast('验证码发送成功');
    } catch (error) {
      showToast(error.message || '验证码发送失败');
      codeStore.resetEmailCode();
    }
  };

  // 登录表单校验（极简核心规则）
  const validateLogin = () => {
    // 邮箱非空
    if (!form.value.email) {
      showToast('请输入邮箱');
      return false;
    }
    // 场景专属校验
    if (currentScene.value === LOGIN_SCENES.CODE && !form.value.code) {
      showToast('请输入验证码');
      return false;
    }
    if (currentScene.value === LOGIN_SCENES.PASSWORD && !form.value.password) {
      showToast('请输入密码');
      return false;
    }
    return true;
  };

  // 登录提交
  const handleLogin = async () => {
    if (!validateLogin() || loading.value) return;

    try {
      loading.value = true;
      // 构造登录参数（按场景筛选）
      const loginParams = {
        email: form.value.email,
        scene: currentScene.value === LOGIN_SCENES.CODE ? 'code' : 'password'
      };
      if (currentScene.value === LOGIN_SCENES.CODE) loginParams.code = form.value.code;
      if (currentScene.value === LOGIN_SCENES.PASSWORD) loginParams.password = form.value.password;

      // 调用登录接口
      const res = await login(loginParams);
      userStore.setUser(res);
      showToast('登录成功');
      router.push('/home');
    } catch (error) {
      // 场景化错误提示
      const errMsg = currentScene.value === LOGIN_SCENES.CODE
        ? '验证码错误或已过期'
        : '密码错误';
      showToast(error.message || errMsg);
    } finally {
      loading.value = false;
    }
  };

  return {
    currentScene,
    form,
    toggleScene,
    sendLoginCode,
    handleLogin,
    LOGIN_SCENES
  };
};

// // 发送验证码方法（login-code/register场景可用）
// const handleSendCode = async () => {
//   // 非验证码场景禁止调用
//   if (currentScene !== validScenes[0] && currentScene !== validScenes[2]) {
//     showToast('当前场景无需发送验证码');
//     return;
//   }

//   // 校验邮箱为空
//   if (!form.value.email) {
//     showToast('请输入邮箱');
//     return;
//   }

//   // 校验倒计时未结束
//   if (codeStore.emailRemainSeconds > 0) {
//     showToast('请勿重复发送验证码');
//     return;
//   }

//   try {
//     // 触发倒计时
//     codeStore.setEmailSendTime();
//     // 调用发送验证码接口
//     await sendEmailCode({
//       email: form.value.email,
//       scene: currentScene
//     });
//     showToast('验证码发送成功');
//   } catch (error) {
//     showToast(error.response.data.message || '验证码发送失败');
//     console.error(error);
//     // 重置倒计时
//     codeStore.resetEmailCode();
//   }
// };

// // 表单校验
// const validateForm = () => {
//   if (!form.value.email) {
//     showToast('请输入邮箱');
//     return false;
//   }

//   // 验证码场景校验（login-code/register）
//   if ((currentScene === validScenes[0] || currentScene === validScenes[2]) && !form.value.code) {
//     showToast('请输入验证码');
//     return false;
//   }

//   // 密码场景校验（login-password/register）
//   if ((currentScene === validScenes[1] || currentScene === validScenes[2]) && !form.value.password) {
//     showToast('请输入密码');
//     return false;
//   }

//   // 注册表单额外校验
//   if (currentScene === validScenes[2] && form.value.password !== form.value.confirmPassword) {
//     showToast('两次密码输入不一致');
//     return false;
//   }

//   return true;
// };

// // 重置表单
// const resetForm = () => {
//   form.value = { email: '' };

//   if (currentScene === validScenes[0] || currentScene === validScenes[2]) {
//     form.value.code = '';
//   }
//   if (currentScene === validScenes[1] || currentScene === validScenes[2]) {
//     form.value.password = '';
//   }
//   if (currentScene === validScenes[2]) {
//     form.value.confirmPassword = '';
//   }

//   // 重置验证码倒计时
//   codeStore.resetEmailCode();
// };

// // 统一提交：根据 currentScene 区分
// const handleSubmit = async () => {
//   if (!validateForm()) return;
//   if (loading.value) return;

//   try {
//     loading.value = true;

//     // 注册场景
//     if (currentScene === validScenes[2]) {
//       await register(form.value);
//       showToast('注册成功');
//       router.push('/auth/login');
//       return;
//     }

//     // 登录场景：区分验证码/密码登录
//     let loginParams = { email: form.value.email };
//     if (currentScene === validScenes[0]) {
//       // 验证码登录
//       loginParams.code = form.value.code;
//     } else if (currentScene === validScenes[1]) {
//       // 密码登录
//       loginParams.password = form.value.password;
//     }

//     // 调用登录接口
//     const res = await login(loginParams);
//     // 存储用户信息
//     userStore.setUser(res);
//     showToast('登录成功');
//     // 跳转到主页
//     router.push('/home');
//   } catch (error) {
//     // 按场景定制错误提示
//     const errorMsgMap = {
//       [validScenes[0]]: '验证码错误或已过期',
//       [validScenes[1]]: '密码错误',
//       [validScenes[2]]: '注册失败'
//     };
//     showToast(error.response.data.message || errorMsgMap[currentScene]);
//     console.error(error);
//   } finally {
//     loading.value = false;
//   }
// };

