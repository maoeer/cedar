/**
 * 时间格式化工具：将时间戳转为 YYYY-MM-DD HH:mm:ss 格式
 * @param {Number} timestamp - 毫秒时间戳
 * @return {String} 格式化后的时间字符串
 */
exports.formatTime = (timestamp = Date.now()) => {
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
