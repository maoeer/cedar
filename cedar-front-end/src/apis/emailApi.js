import axios from '@/utils/request';
import { showToast } from '@/components/Toast/toastPlugin';

// 发送邮箱
export const sendEmailCaptcha = async (email) => {
  if (!email) {
    showToast('邮箱不能为空');
    throw new Error('邮箱不能为空');
  }

  // 邮箱格式
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailReg.test(email)) {
    showToast('请输入正确的邮箱格式');
    throw new Error('邮箱格式错误');
  }

  try {
    const res = await axios.post('/email/get-code', { email });
    showToast('成功发送验证码');
    console.log(res);
    return res;
  } catch (error) {
    showToast('发送验证码失败');
    throw error;
  }
};

