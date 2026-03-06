const { formatTime } = require('../utils/formatTime');

// 请求响应日志拦截器
const requestResponseLogger = (req, res, next) => {
  // 捕获请求信息
  const requestInfo = {
    time: formatTime(),
    method: req.method,
    path: req.originalUrl,
    headers: req.headers,
    body: req.body
  };

  // 打印请求信息
  console.log('\n===== [REQUEST] =====');
  console.log(JSON.stringify(requestInfo, null, 2));

  // 重写 res.json 方法，捕获响应体
  const originalJson = res.json;
  res.json = function (data) {
    const responseInfo = {
      time: formatTime(),
      code: res.code,
      responseBody: data
    };

    // 打印响应信息
    console.log('===== [RESPONSE] =====');
    console.log(JSON.stringify(responseInfo, null, 2));
    console.log('======================\n');

    return originalJson.call(this, data);  // 打印响应信息
  }

  next();
};

module.exports = requestResponseLogger;