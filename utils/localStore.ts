import localforage from 'localforage';
import conf from 'conf';

/**
 * encryptor 加密程序
 * @param {String} str 待加密字符串
 * @param {Number} xor 异或值
 * @param {Number} hex 加密后的进制数
 * @return {String} 加密后的字符串
 */
function encryptor(str: string, xor: number, hex: number = conf.defaultHex) {
  let resultList = [];
  // 取值范围2-36
  hex = hex <= 36 && hex >= 2 ? hex : hex % 36;

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
function decryptor(str: string, xor: number, hex: number = conf.defaultHex) {
  let resultList = [];
  // 取值范围2-36
  hex = hex <= 36 && hex >= 2 ? hex : hex % 36;
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

// 存储数据
async function setValue<T = any>(key: string, val: T, encrypt: boolean = conf.encrypt, salt: number = conf.salt) {
  // 如果用户关闭了本地存储功能，或者使用隐身模式。使用localStorage会让浏览器抛出异常，导致程序无法执行。
  // 所以这里要进行异常处理

  // 保存数据前，先将数据用JSON进行序列化
  let value = JSON.stringify(val);

  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt);
    value = encryptor(value, salt);
  }

  await localforage.setItem(key, value);
}

// 获取数据
async function getValue(key: string, encrypt: boolean = conf.encrypt, salt: number = conf.salt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt);
  }

  // 取出序列化的内容
  let value: string | null = await localforage.getItem(key);

  if (value) {
    // 解密
    if (encrypt) {
      value = decryptor(value, salt);
    }
    // 返回的数据，需要用JSON进行反序列化
    return JSON.parse(value);
  } else {
    return '';
  }
}

// 删除数据
async function delValue(key: string, encrypt: boolean = conf.encrypt, salt: number = conf.salt) {
  // 数据进行加密处理
  if (encrypt) {
    key = encryptor(key, salt);
  }

  await localforage.removeItem(key);
}

/***
 * 清空缓存
 */
async function clearData() {
  // 清空全部数据
  await localforage.clear();
}

/**
 * 获取所有的key
 * */
async function getKeys(encrypt: boolean = conf.encrypt, salt: number = conf.salt) {
  const list = await localforage.keys();
  if (encrypt) {
    return list.map((item) => decryptor(item, salt));
  }
  return list;
}

const storage = {
  setValue,
  getValue,
  delValue,
  clearData,
  getKeys,
};

export default storage;
