import { ref } from 'vue';
import { useCaptchaStore } from '@/stores/captchaStore';
import { sendEmailCaptcha } from '@/apis/emailApi';
import { showToast } from '@/components/Toast/toastPlugin';

export const useCaptcha = (formType = 'login') => {
  // 获取验证码store
  const captchaStore = useCaptchaStore();

  // 表单数据
  const form = ref({
    email: '',
    captcha: '',
  });

  if (formType === 'register') {
    form.value.password = '';
    form.value.confirmPassword = '';
  }

  // 发送验证码方法
  const handleSendCaptcha = async () => {
    // 校验邮箱为空
    if (!form.value.email) {
      showToast('请输入邮箱');
      return;
    }

    // 校验倒计时未结束
    if (captchaStore.emailRemainSeconds > 0) {
      showToast('请勿重复发送验证码');
      return;
    }

    try {
      // 触发倒计时
      captchaStore.setEmailSendTime();
      // 调用发送验证码接口
      await sendEmailCaptcha(form.value.email);
      showToast('验证码发送成功');
    } catch (error) {
      showToast('验证码发送失败，请重试');
      console.error('发送验证码失败：', error);
    }
  };

  // 表单校验
  const validateForm = () => {
    if (!form.value.email) {
      showToast('请输入邮箱');
      return false;
    }

    if (!form.value.captcha) {
      showToast('请输入验证码');
      return false;
    }

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
      captcha: '',
    });

    if (formType === 'register') {
      form.value.password = '';
      form.value.confirmPassword = '';
    }

    // 重置倒计时
    captchaStore.resetEmailCaptcha();
  }

  return {
    form,
    handleSendCaptcha,
    validateForm,
    resetForm
  }
};