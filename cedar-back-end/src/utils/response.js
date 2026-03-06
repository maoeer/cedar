const { formatTime } = require('./formatTime');

// 状态码集合
const statusMap = {
  200: '操作成功',
  400: '客户端错误',
  401: '未登录',
  500: '服务器错误',
  999: '未知状态'
}

/**
 * 统一返回格式：
 * {
 *  code: 200,
 *  message: "操作成功",
 *  data: { 数据 },
 *  time: 2026-02-25 12:01:02,
 *  error: "错误信息" 
 * }
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
    console.log(error)
  }
};
