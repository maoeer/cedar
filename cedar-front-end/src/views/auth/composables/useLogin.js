import { ref, onMounted, onUnmounted } from 'vue';
import { sendEmailCode } from '@/apis/emailApi';
import { login } from '@/apis/userApi';
import { showToast } from '@/components/Toast/toastPlugin';
import { isEmailValid } from '@/utils/validate';

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
      showToast(error.response.data.message || '验证码发送失败');
      codeStore.resetEmailCode();
    }
  };

  // 登录表单校验
  const validateLogin = () => {
    // 邮箱非空
    if (!form.value.email) {
      showToast('请输入邮箱');
      return false;
    }
    // 邮箱格式是否合法
    if (!isEmailValid(form.value.email)) {
      showToast('邮箱格式错误');
      return false;
    }
    // 验证码登录
    if (currentScene.value === LOGIN_SCENES.CODE && !form.value.code) {
      showToast('请输入验证码');
      return false;
    }
    // 密码登录
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
        scene: currentScene.value
      };
      if (currentScene.value === LOGIN_SCENES.CODE) loginParams.code = form.value.code;
      if (currentScene.value === LOGIN_SCENES.PASSWORD) loginParams.password = form.value.password;

      // 调用登录接口
      const res = await login(loginParams);
      console.log(res)
      userStore.setUser(res);
      showToast('登录成功');
      router.push('/home');
    } catch (error) {
      // 场景化错误提示
      const errMsg = currentScene.value === LOGIN_SCENES.CODE
        ? '验证码错误或已过期'
        : '密码错误';
      showToast(error.response.data.message || errMsg);
    } finally {
      loading.value = false;
    }
  };

  // 监听回车键
  const handleEnterKeyDown = (e) => {
    if (e.keyCode === 13 && currentScene.value === LOGIN_SCENES.CODE) {
      e.preventDefault();
      handleLogin();
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', handleEnterKeyDown);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', handleEnterKeyDown);
  });

  return {
    currentScene,
    form,
    toggleScene,
    sendLoginCode,
    handleLogin,
    LOGIN_SCENES
  };
};
