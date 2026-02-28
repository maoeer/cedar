import { ref } from 'vue';
import { useCodeStore } from '@/stores/codeStore';
import { useUserStore } from '@/stores/userStore';
import { sendEmailCode } from '@/apis/emailApi';
import { login, register } from '@/apis/userApi';
import { showToast } from '@/components/Toast/toastPlugin';
import { useRouter } from 'vue-router';

export const useForm = (formType = 'login') => {
  // 获取验证码store
  const codeStore = useCodeStore();
  const userStore = useUserStore();
  const router = useRouter();
  const loading = ref(false);

  // 表单数据
  const form = ref({
    email: '',
    code: '',
    /**
     * 写法解析
     * 利用 A && B 的短路特性 
     * 
     * 场景一：
     * formType === 'register' 为 true，则展开 { password, confirmPassword }
     * 
     * 场景二：
     * formType === 'register 为 false，则展开 false（无属性添加）
     */
    ...(formType === 'register' && {
      password: '',
      confirmPassword: ''
    })
  });

  // 发送验证码方法
  const handleSendCode = async (scene = 'login') => {
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
        scene
      });
      showToast('验证码发送成功');
    } catch (error) {
      showToast(error.response.data.message);
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

    if (!form.value.code) {
      showToast('请输入验证码');
      return false;
    }

    // 注册表单额外校验
    if (formType === 'register') {
      if (!form.value.password) {
        showToast('请输入密码');
        return false;
      }

      if (form.value.password !== form.value.confirmPassword) {
        showToast('两次密码输入不一致');
        return false;
      }
    }

    return true;
  };

  // 重置表单
  const resetForm = () => {
    form.value = ref({
      email: '',
      code: '',
    });

    if (formType === 'register') {
      form.value.password = '';
      form.value.confirmPassword = '';
    }

    // 重置倒计时
    codeStore.resetEmailCode();
  };

  // 登录处理
  const handleLogin = async () => {
    if (!validateForm()) return;
    if (loading.value) return;

    try {
      loading.value = true;

      const res = await login(form.value);
      // 存储用户信息
      userStore.setUser(res);
      showToast('登录成功');
      
      // 跳转到主页
      router.push('/home');
    } catch (error) {
      showToast(error.message || '登录失败');
      console.error('登录失败', error);
    } finally {
      loading.value = false;
    }
  };

  // 注册处理
  const handleRegister = async () => {
    if (!validateForm()) return;
    if (loading.value) return;

    try {
      loading.value = true;
      const res = await register(form.value);
      showToast('注册成功');
      router.push('/auth/login');
    } catch (error) {
      showToast(error.message || '注册失败');
      console.error('注册失败', error.message);
    } finally {
      loading.value = false;
    }
  };

  return {
    form,
    handleSendCode,
    validateForm,
    resetForm,
    handleLogin,
    handleRegister
  }
};