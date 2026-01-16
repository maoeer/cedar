import axios from 'axios';

const service = axios.create({
  baseURL: 'http://localhost:3000/api', 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  }
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    console.error('请求发送失败（拦截器）：', error.message);
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    //（后端统一返回格式：{ code: 数字, data: 数据, msg: 提示语 }）
    const res = response.data;

    // 成功
    if (res.code === 200) {
      return res.data;
    }

    // 失败
    console.error('请求失败（业务逻辑）：', res.msg || '未知错误');
    // 抛出错误
    return Promise.reject(new Error(res.msg || '未知错误'));
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default service;