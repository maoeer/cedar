import { createVNode, render } from 'vue';
import Toast from '@/components/Toast/index.vue';

// 创建 Dom 容器，用于挂载 Toast 组件
const container = document.createElement('div');
document.body.appendChild(container);

// 创建 Toast 组件的虚拟节点（VNode），并渲染到容器中
let toastVNode = null;
const initToast = () => {
  toastVNode = createVNode(Toast);
  render(toastVNode, container);
};

// 全局 Toast 方法，方便调用组件的 openToast
const showToast = (message) => {
  if (!toastVNode) {
    // 初次调用时初始化组件
    initToast();
  }
  toastVNode.component.exposed.openToast(message);
};

// 注册为 Vue 组件
export default {
  install(app) {
    /**
     * 挂载到全局，调用方式：
     * import { getCurrentInstance } from 'vue'; 
     * 
     * const { proxy } = getCurrentInstance();
     * proxy.$toast('全局提示');
     */
    app.config.globalProperties.$toast = showToast;
  }
};
