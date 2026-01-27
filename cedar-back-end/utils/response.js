/**
 * 时间格式化工具：将时间戳转为 YYYY-MM-DD HH:mm:ss 格式
 * @param {Number} timestamp - 毫秒时间戳
 * @return {String} 格式化后的时间字符串
 */
const formatTime = (timestamp = Date.now()) => {
  const date = new Date(timestamp);
  
  // 补零函数
  const padZero = (num) => {
    return num.toString().padStart(2, '0');
  }

  // 年月日
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1);
  const day = padZero(date.getDate());

  // 时分秒
  const hour = padZero(date.getHours());
  const minute = padZero(date.getMinutes());
  const second = padZero(date.getSeconds());

  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

// 状态码集合
const statusMap = {
  200: '操作成功',
  400: '客户端错误',
  401: '未登录',
  500: '服务器错误',
  999: '未知状态'
}

/**
 * 统一响应工具函数
 */
const sendResponse = (res, code, message, data, error = null) => {
  // 查询传入的 code 是否已定义
  if (!statusMap[code]) {
    code = 999;
  }

  // 定义响应结构
  const response = {
    code,
    message: message || statusMap[code],
    data,
    time: formatTime()
  };

  // 仅错误状态码时添加 error 字段
  if (error) {
    response.error = error;
  }

  // 发送响应
  res.status(code).json(response);
};

module.exports = {
    success: (res, message, data = {}) => {
      sendResponse(res, 200, message, data);
    },
    clientError: (res, message) => { 
      sendResponse(res, 400, message);
    },
    unAuth: (res, message) => {
      sendResponse(res, 401, message);
    },
    serverError: (res, message, error) => {
      sendResponse(res, 500, message, null, error);
    }
};
