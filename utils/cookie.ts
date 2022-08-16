// 存储cookie
function setCookie(key: string, value: string, days: number) {
  let d = new Date();
  d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
  let expires = 'expires=' + d.toUTCString();
  document.cookie = key + '=' + value + ';path=/;' + expires;
  // console.info(document.cookie)
}

// 获取cookie
function getCookie(key: string) {
  let value = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return value ? value[2] : null;
}

// 清除cookie
function delCookie(key: string) {
  setCookie(key, '', -1);
}

// 清空cookie
const clearCookies = () => {
  const keys = document.cookie.match(/[^ =;]+(?==)/g);
  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString() + ';max-age=0';
    }
  }
};

const cookie = {
  setCookie,
  getCookie,
  delCookie,
  clearCookies,
};

export default cookie;
