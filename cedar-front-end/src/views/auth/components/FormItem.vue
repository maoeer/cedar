<script setup>
import { computed } from 'vue';
import { useCodeStore } from '@/stores/codeStore';

// 需要传递的参数
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
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  isCode: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['sendCode', 'update:modelValue']);

const codeStore = useCodeStore();

// 按钮文案逻辑
const captchBtnText = computed(() => {
  const remian = codeStore.emailRemainSeconds;
  return remian > 0 
    ? `${remian}s后重新获取` 
    : '获取验证码';
});
     
const handleSendCode = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (codeStore.emailRemainSeconds > 0) return;
  emit('sendCode');
};

const handleInput = (e) => {
  const value = e.target.value.trim();
  emit('update:modelValue', value);
};
</script>

<template>
  <div class="form-item">
    <label :for="id" class="form-item__label">{{ label }}</label>

    <div :class="{ 'form-item__code': isCode }" class="form-item__content">
      <input 
        :type="type" 
        :id="id"
        :name="name"
        :value="modelValue"
        :placeholder="placeholder"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck: false 
        @input="handleInput">

      <button 
        v-if="isCode"
        class="form-item__code-btn"
        :disabled="codeStore.emailRemainSeconds > 0"
        @click="handleSendCode">
        {{ captchBtnText }}
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
$input-height: 44px;

// 表单列表
.form-item {
  display: grid;
  gap: 8px;
  margin-bottom: 16px;

  &__label {
    font-size: 14px;
    color: $text-color;
    font-weight: 500;
  }

  &__content {
    position: relative;
    height: $input-height;

    input {
      width: 100%;
      height: 100%;
      padding: 0 16px;
      border: 1px solid $input-border-color;
      border-radius: 12px;
      font-size: 16px;
      transition: all 0.2s ease;

      &:focus {
        border-color: $primary-color;
        box-shadow: 0 0 0 3px rgba(67, 97, 238, 0.15);
         outline: none;
      }

      &:-webkit-autofill {
        box-shadow: 0 0 0 $input-height white inset;
        -webkit-text-fill-color: $text-color;
      }
    }
  }

  &__code {
    display: flex;
    align-items: center;
    gap: 10px;

    input {
      flex: 1;
    }

    &-btn {
      height: 100%;
      padding: 0 16px;
      border: none;
      border-radius: 12px;
      min-width: 120px;
      font-size: 14px;
      font-weight: 600;
      color: $primary-color;
      background: $primary-light;
      cursor: pointer;
      transition: all 0.2s ease;

      &:disabled {
        color: $disabled-text-color;
        background: $disabled-bg-color;
        cursor: not-allowed; // 禁用态光标
      }

      // 悬浮样式(除不可以)
      &:hover:not(:disabled) {
        color: $second-color;
        background: $second-light;
      }
    }
  }

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
  // .form-item-code {
  //   display: flex;
  //   align-items: center;
  //   gap: 10px;

  //   // 表单验证码中的输入框
  //   input {
  //     flex: 1;
  //   }
    
  //   // 表单验证码中的按钮
  //   button {
  //     height: 100%;
  //     padding: 0 16px;
  //     border-radius: 12px;
  //     min-width: 120px;
  //     font-weight: 600;
  //     color: $primary-color;
  //     background: $primary-light;
  //   }
  // }
}
</style>