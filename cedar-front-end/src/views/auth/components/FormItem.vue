<script setup>
import { computed } from 'vue';
import { useCaptchaStore } from '@/stores/captchaStore';

defineProps({
  label: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  placeholder: {
    type: String
  },
  type: {
    type: String,
    default: 'text'
  },
  isCaptcha: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['sendCaptcha', 'update:modelValue']);

const captchaStore = useCaptchaStore();

// 按钮文案逻辑
const captchBtnText = computed(() => {
  const remian = captchaStore.emailRemainSeconds;
  return remian > 0 
    ? `${remian}s后重新获取` 
    : '获取验证码';
});
     
const handleSendCaptcha = (e) => {
  e.preventDefault();
  if (captchaStore.emailRemainSeconds > 0) return;
  emit('sendCaptcha');
};

const handleInput = (e) => {
  emit('update:modelValue', e.target.value);
};
</script>

<template>
  <div class="form-item">
    <label :for="id">{{ label }}</label>

    <input 
      v-if="!isCaptcha"
      :type="type"
      :placeholder="placeholder"
      :id="id"
      :name="name"
      :value="modelValue"
      @input="handleInput">

    <div v-else class="form-item-captcha">
      <input
        type="text"
        :placeholder="placeholder"
        :id="id"
        :name="name"
        :value="modelValue"
        @input="handleInput">

      <button 
        :disabled="captchaStore.emailRemainSeconds > 0"
        @click="handleSendCaptcha">
        {{ captchBtnText }}
      </button>
    </div>  
  </div>
</template>

<style scoped lang="scss">
// 表单列表
.form-item {
  display: grid;
  gap: 5px;

  // 表单输入框
  input {
    padding: 14px 16px;
    border: 1px solid $input-border-color;
    border-radius: 12px;

    &:focus {
      border-color: $primary-color;
      box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
    }
  }

  // 表单验证码
  .form-item-captcha {
    display: flex;
    align-items: center;
    gap: 10px;

    // 表单验证码中的输入框
    input {
      flex: 1;
    }
    
    // 表单验证码中的按钮
    button {
      height: 100%;
      padding: 0 16px;
      border-radius: 12px;
      min-width: 120px;
      font-weight: 600;
    }
  }
}
</style>