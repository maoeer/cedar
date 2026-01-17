import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import '@/assets/styles/index.scss';

const pinia = createPinia();

const app = createApp(App);
// 挂载路由
app.use(router);
// 挂载 Pinia
app.use(pinia);
app.mount('#app');

