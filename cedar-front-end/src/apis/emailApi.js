import request from '@/utils/request';

// 发送邮箱
export const sendEmailCode = async ({ email, scene }) => {
  if (!email) {
    throw new Error('邮箱不能为空');
  }

  // 邮箱格式
  const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailReg.test(email)) {
    throw new Error('邮箱格式错误');
  }

  try {
    const res = await request.post('/email/get-code', { email, scene });
    console.log(res);
    return res;
  } catch (error) {
    throw error;
  }
};


