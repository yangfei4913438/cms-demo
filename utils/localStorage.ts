import cookie from 'utils/cookie';

/**
 * encryptor 加密程序
 * @param {String} str 待加密字符串
 * @param {Number} xor 异或值
 * @param {Number} hex 加密后的进制数
 * @return {String} 加密后的字符串
 */
function encryptor(str: string, xor: number, hex: number) {
  let resultList = [];
  hex = hex <= 25 ? hex : hex % 25;

  for (let i = 0; i < String(str).length; i++) {
    // 提取字符串每个字符的ascll码
    const charCode = String(str).charCodeAt(i);
    // 进行异或加密
    const code = Number(charCode) ^ xor;
    // 异或加密后的字符转成 hex 位数的字符串
    const strCode = code.toString(hex);
    // 添加
    resultList.push(strCode);
  }

  let splitStr = String.fromCharCode(hex + 97);
  return resultList.join(splitStr);
}

/**
 * decryptor 解密程序
 * @param {String} str 待加密字符串
 * @param {Number} xor 异或值
 * @param {Number} hex 加密后的进制数
 * @return {String} 加密后的字符串
 */
function decryptor(str: string, xor: number, hex: number) {
  let resultList = [];
  hex = hex <= 25 ? hex : hex % 25;
  // 解析出分割字符
  let splitStr = String.fromCharCode(hex + 97);
  // 分割出加密字符串的加密后的每个字符
  let strCharList = str.split(splitStr);

  for (let i = 0; i < strCharList.length; i++) {
    // 将加密后的每个字符转成加密后的 ascll 码
    let charCode = parseInt(strCharList[i], hex);
    // 异或解密出原字符的ascll码
    charCode = charCode ^ xor;
    let strChar = String.fromCharCode(charCode);
    resultList.push(strChar);
  }
  return resultList.join('');
}

// localStorage 存储数据，加密时使用的盐的默认值
const defaultSalt = 66622333;

// 存储数据
function setValue(key: string, val: any, encrypt: boolean = false, salt: number = defaultSalt) {
  // 如果用户关闭了本地存储功能，或者使用隐身模式。使用localStorage会让浏览器抛出异常，导致程序无法执行。
  // 所以这里要进行异常处理

  // 保存数据前，先将数据用JSON进行序列化
  let value = JSON.stringify(val);

  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
    value = encryptor(value, salt, 16);
  }

  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // 默认cookie存储1天
    let days = 1;
    // 如果是语言类型，那就存储1年
    if (key === 'lang') {
      days = 365;
    }
    cookie.setCookie(key, value, days);
  }
}

// 会话存储
function setValueSession(key: string, val: any, encrypt: boolean = false, salt: number = defaultSalt) {
  // 保存数据前，先将数据用JSON进行序列化
  let value = JSON.stringify(val);

  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
    value = encryptor(value, salt, 16);
  }

  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    // 默认cookie存储1天
    let days = 1;
    // 如果是语言类型，那就存储1年
    if (key === 'lang') {
      days = 365;
    }
    cookie.setCookie(key, value, days);
  }
}

// 获取数据
function getValue(key: string, encrypt: boolean = false, salt: number = defaultSalt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
  }

  let value;
  try {
    value = localStorage.getItem(key);
  } catch (e) {
    value = cookie.getCookie(key);
  }

  if (value) {
    // 解密
    if (encrypt) {
      value = decryptor(value, salt, 16);
    }
    // 返回的数据，需要用JSON进行反序列化
    return JSON.parse(value);
  } else {
    return '';
  }
}

// 会话取数据
function getValueSession(key: string, encrypt: boolean = false, salt: number = defaultSalt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
  }
  let value;
  try {
    value = sessionStorage.getItem(key);
  } catch (e) {
    value = cookie.getCookie(key);
  }

  if (value) {
    // 解密
    if (encrypt) {
      value = decryptor(value, salt, 16);
    }
    // 返回的数据，需要用JSON进行反序列化
    return JSON.parse(value);
  } else {
    return '';
  }
}

// 删除数据
function delValue(key: string, encrypt: boolean = false, salt: number = defaultSalt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
  }

  try {
    localStorage.removeItem(key);
  } catch (e) {
    cookie.delCookie(key);
  }
}

// 会话删除数据
function delValueSession(key: string, encrypt: boolean = false, salt: number = defaultSalt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt, 16);
  }

  try {
    sessionStorage.removeItem(key);
  } catch (e) {
    cookie.delCookie(key);
  }
}

/***
 * 清空缓存
 */
function clearData() {
  // 清空全部数据
  try {
    localStorage.clear();
  } catch (e) {
    cookie.clearCookies();
  }
}
/***
 * 会话清空缓存
 */
function clearDataSession() {
  try {
    sessionStorage.clear();
  } catch (e) {
    cookie.clearCookies();
  }
}

const storage = {
  defaultSalt,
  setValue,
  getValue,
  delValue,
  clearData,
  setValueSession,
  getValueSession,
  delValueSession,
  clearDataSession,
};

export default storage;
