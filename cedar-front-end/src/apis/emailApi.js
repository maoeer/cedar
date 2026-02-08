import axios from '@/utils/request';

// 发送邮箱
export const sendEmailCaptcha = async (email) => {
  if (!email) {
    throw new Error('邮箱不能为空');
  }

  // 邮箱格式
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailReg.test(email)) {
    throw new Error('邮箱格式错误');
  }

  try {
    const res = await axios.post('/email/get-code', { email });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};

