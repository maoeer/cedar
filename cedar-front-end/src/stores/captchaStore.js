import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// 固定的倒计时间隔: 60s
const DURATION = 60;

export const useCaptchaStore = defineStore('captcha', () => {
  // 发送开始时间戳
  const emailSendStartTime = ref(0);

  // 计算倒计时剩余时间
  const emailRemainSeconds = computed(() => {
    if (emailSendStartTime.value === 0) return 0;

    // 计算公式：
    // (时间戳 - 开始时间) / 1000 = 已走的时间
    // 倒计时间隔 - 已走的时间 = 剩余时间
    const remainSeconds = Math.ceil(DURATION - (Date.now() - emailSendStartTime.value) / 1000);
    return remainSeconds > 0 ? remainSeconds : 0;
  });

  // 设置开始时间戳
  const setEmailSendTime = () => {
    emailSendStartTime.value = Date.now();
  };

  // 重置倒计时
  const resetEmailCaptcha = () => {
    emailSendStartTime.value = 0;
  };

  return {
    emailRemainSeconds,
    setEmailSendTime,
    resetEmailCaptcha
  }
}, {
  persist: true
});