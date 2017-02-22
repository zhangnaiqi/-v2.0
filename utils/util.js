function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 判断目标是否是函数
 * @param {mixed} val
 * @returns {boolean}
 */
function isFunction( val ) {
  return typeof val === 'function';
}

module.exports = {
  isFunction: isFunction,
  formatTime: formatTime
}
