import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import toastPlugin from '@/components/Toast/toastPlugin';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import '@/assets/styles/index.scss';

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const app = createApp(App);
// 挂载路由
app.use(router);
// 挂载 Pinia
app.use(pinia);
// 挂载 Toast
app.use(toastPlugin);
app.mount('#app');

