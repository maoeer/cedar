import { ref } from 'vue';
import { sendEmailCode } from '@/apis/emailApi';
import { register } from '@/apis/userApi';
import { showToast } from '@/components/Toast/toastPlugin';
import { isEmailValid } from '@/utils/validate';

/**
 * 注册专属逻辑
 * @param {Object} options 外部依赖
 * @param {Object} options.codeStore 验证码状态仓库
 * @param {Object} options.userStore 用户状态仓库
 * @param {Object} options.router 路由实例
 */
export const useRegister = ({ codeStore, userStore, router }) => {
  // 注册表单数据（固定字段，无动态逻辑）
  const form = ref({
    email: '',
    code: '',
    password: '',
    confirmPassword: ''
  });
  // 提交加载状态
  const loading = ref(false);

  // 发送注册验证码
  const sendRegisterCode = async () => {
    // 邮箱非空校验
    if (!form.value.email) return showToast('请输入邮箱');
    // 倒计时校验
    if (codeStore.emailRemainSeconds > 0) return showToast('请勿重复发送验证码');

    try {
      codeStore.setEmailSendTime();
      // 调用接口（指定注册场景）
      await sendEmailCode({ email: form.value.email, scene: 'register' });
      showToast('验证码发送成功');
    } catch (error) {
      showToast(error.response.data.message || '验证码发送失败');
      codeStore.resetEmailCode();
    }
  };

  // 注册表单校验
  const validateRegister = () => {
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
    // 验证码非空
    if (!form.value.code) {
      showToast('请输入验证码');
      return false;
    }
    // 密码长度
    if (!form.value.password || form.value.password.length < 6) {
      showToast('密码长度不少于6位');
      return false;
    }
    // 密码一致性
    if (form.value.password !== form.value.confirmPassword) {
      showToast('两次密码输入不一致');
      return false;
    }
    return true;
  };

  // 注册提交
  const handleRegister = async () => {
    if (!validateRegister() || loading.value) return;

    try {
      loading.value = true;
      // 调用注册接口
      const res = await register({
        email: form.value.email,
        code: form.value.code,
        password: form.value.password,
        confirmPassword: form.value.confirmPassword
      });
      userStore.setUser(res);
      showToast('注册成功');
      router.push('/auth/login'); // 跳转到登录页
    } catch (error) {
      showToast(error.response.data.message || '注册失败');
    } finally {
      loading.value = false;
    }
  };

  return {
    form,
    sendRegisterCode,
    handleRegister
  };
};