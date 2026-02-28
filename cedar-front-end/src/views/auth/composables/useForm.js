import { ref } from 'vue';
import { sendEmailCode } from '@/apis/emailApi';
import { login, register } from '@/apis/userApi';
import { showToast } from '@/components/Toast/toastPlugin';

// 使用表单的场景
const validScenes = ['login-code', 'login-password', 'register'];

export const useForm = (scene, { codeStore, userStore, router }) => {
  console.log('当前场景:', scene);

  // 校验场景参数
  const currentScene = validScenes.includes(scene) ? scene : validScenes[0];

  const loading = ref(false);

  // 根据 currentScene 来拼接字段
  const form = ref({
    email: '',
    ...(currentScene === validScenes[0] || currentScene === validScenes[2] ? { code: '' } : {}), // 验证码字段
    ...(currentScene === validScenes[1] || currentScene === validScenes[2] ? { password: '' } : {}), // 密码字段
    ...(currentScene === validScenes[2] ? { confirmPassword: '' } : {}) // 确认密码字段
  });

  // 发送验证码方法（login-code/register场景可用）
  const handleSendCode = async () => {
    // 非验证码场景禁止调用
     if (currentScene !== validScenes[0] && currentScene !== validScenes[2]) {
      showToast('当前场景无需发送验证码');
      return;
    }

    // 校验邮箱为空
    if (!form.value.email) {
      showToast('请输入邮箱');
      return;
    }

    // 校验倒计时未结束
    if (codeStore.emailRemainSeconds > 0) {
      showToast('请勿重复发送验证码');
      return;
    }

    try {
      // 触发倒计时
      codeStore.setEmailSendTime();
      // 调用发送验证码接口
      await sendEmailCode({
        email: form.value.email,
        scene: currentScene
      });
      showToast('验证码发送成功');
    } catch (error) {
      showToast(error.response.data.message || '验证码发送失败');
      console.error(error);
    } finally {
      // 重置倒计时
      codeStore.resetEmailCode();
    }
  };

  // 表单校验
  const validateForm = () => {
    if (!form.value.email) {
      showToast('请输入邮箱');
      return false;
    }

    // 验证码场景校验（login-code/register）
    if ((currentScene === validScenes[0] || currentScene === validScenes[2]) && !form.value.code) {
      showToast('请输入验证码');
      return false;
    }

    // 密码场景校验（login-password/register）
    if ((currentScene === validScenes[1] || currentScene === validScenes[2]) && !form.value.password) {
      showToast('请输入密码');
      return false;
    }

    // 注册表单额外校验
    if (currentScene === validScenes[2] && form.value.password !== form.value.confirmPassword) {
      showToast('两次密码输入不一致');
      return false;
    }

    return true;
  };

  // 重置表单
  const resetForm = () => {
    form.value = { email: '' };

    if (currentScene === validScenes[0] || currentScene === validScenes[2]) {
      form.value.code = '';
    }
    if (currentScene === validScenes[1] || currentScene === validScenes[2]) {
      form.value.password = '';
    }
    if (currentScene === validScenes[2]) {
      form.value.confirmPassword = '';
    }

    // 重置验证码倒计时
    codeStore.resetEmailCode();
  };

  // 统一提交：根据 currentScene 区分
  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (loading.value) return;

    try {
      loading.value = true;

      // 注册场景
      if (currentScene === validScenes[2]) {
        await register(form.value);
        showToast('注册成功');
        router.push('/auth/login');
        return;
      }

      // 登录场景：区分验证码/密码登录
      let loginParams = { email: form.value.email };
      if (currentScene === validScenes[0]) {
        // 验证码登录
        loginParams.code = form.value.code;
      } else if (currentScene === validScenes[1]) {
        // 密码登录
        loginParams.password = form.value.password;
      }

      // 调用登录接口
      const res = await login(loginParams);
      // 存储用户信息
      userStore.setUser(res);
      showToast('登录成功');
      // 跳转到主页
      router.push('/home');
    } catch (error) {
      // 按场景定制错误提示
       const errorMsgMap = {
        [validScenes[0]]: '验证码错误或已过期',
        [validScenes[1]]: '密码错误',
        [validScenes[2]]: '注册失败'
      };
      showToast(error.response.data.message || errorMsgMap[currentScene]);
      console.error(error);
    } finally {
      loading.value = false;
    }
  };

  return {
    form,
    handleSendCode,
    validateForm,
    resetForm,
    handleSubmit
  }
};