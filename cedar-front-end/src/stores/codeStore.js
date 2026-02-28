import { defineStore } from 'pinia';
import { ref } from 'vue';

const DURATION = 60; // 60秒倒计时

export const useCodeStore = defineStore('code', () => {
  // 发送验证码的时间戳
  const emailSendStartTime = ref(0);
  // 剩余秒数
  const emailRemainSeconds = ref(0);
  // 定时器
  let countdownTimer = null;

  // 计算剩余秒数的核心方法
  const calculateRemainSeconds = () => {
    if (emailSendStartTime.value === 0) {
      emailRemainSeconds.value = 0;
      return;
    }

    // 已流逝时间 = (当前时间 - 发送时间) / 1000（毫秒转秒）
    const elapsed = Math.floor((Date.now() - emailSendStartTime.value) / 1000);
    // 剩余时间 = 60 - 已流逝时间（最小为0）
    const remain = DURATION - elapsed;
    emailRemainSeconds.value = remain > 0 ? remain : 0;
  };

  // 开始倒计时
  const startCountdown = () => {
    // 先清除已有定时器
    clearCountdownTimer();
    // 立即计算一次
    calculateRemainSeconds();
    // 剩余时间 > 0，启动计时器
    if (emailRemainSeconds.value > 0) {
      // 每秒更新剩余秒数
      countdownTimer = setInterval(() => {
        calculateRemainSeconds();
        // 剩余秒数为0时清除定时器
        if (emailRemainSeconds.value <= 0) {
          clearCountdownTimer();
        }
      }, 1000);
    }
  };

  // 发送验证码时，记录当前时间戳
  const setEmailSendTime = () => {
    emailSendStartTime.value = Date.now();
    startCountdown();
  };

  // 每次页面刷新都会初始化，避免刷新倒计时丢失
  const initCountdown = () => {
    calculateRemainSeconds();
    startCountdown();
  }

  // 清除定时器
  const clearCountdownTimer = () => {
    if (countdownTimer) {
      clearInterval(countdownTimer);
      countdownTimer = null;
    }
  };

  // 重置倒计时
  const resetEmailCode = () => {
    emailSendStartTime.value = 0;
    emailRemainSeconds.value = 0;
    clearCountdownTimer();
  };

  return {
    emailSendStartTime,
    emailRemainSeconds,
    setEmailSendTime,
    resetEmailCode,
    initCountdown
  };
}, {
  persist: {
    paths: [
      'emailSendStartTime'
    ] // 仅持久化时间戳，刷新后能读取
  }
});