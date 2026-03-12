import request from '@/utils/request';
import { isEmailValid } from '@/utils/validate'

// 发送邮箱
export const sendEmailCode = async ({ email, scene }) => {
  if (!email) {
    throw new Error('邮箱不能为空');
  }

  // 邮箱格式
  if (!isEmailValid(email)) {
    throw new Error('邮箱格式错误');
  }

  try {
    await request.post('/email/get-code', { email, scene });
  } catch (error) {
    throw error;
  }
};


