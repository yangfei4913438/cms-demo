import conf from 'conf/index';
import storage from 'utils/localStore';
import dayjs from 'dayjs';

// 本地缓存
interface ICache {
  // 缓存的utc时间
  utcTime: string;
  // 缓存有效期（单位：毫秒）
  expired: number;
  // 数据
  data: any;
}

/**
 *
 * 1、设置缓存
 * 2、获取缓存
 * 3、定时清理缓存
 * 4、设置缓存失效（主动清理缓存）
 *
 * 注意：这里用于存储一些大型数据，避免重复请求
 * */
class LocalCache {
  constructor() {
    // 服务端不运行清理任务
    if (conf.cache.enabled && typeof window !== 'undefined') {
      // 每10分钟清理一次数据
      setInterval(async () => {
        await this.job();
      }, conf.cache.cleanInterval);
    }
  }

  // 缓存的数据结构
  getNewCache(data: any): ICache {
    return {
      utcTime: dayjs().utc().toString(),
      expired: conf.cache.expired,
      data,
    };
  }

  // 设置缓存数据
  async setCache(key: string, data: any, encrypt: boolean = false, salt: number = conf.salt) {
    // 生成新的缓存
    const newCache = this.getNewCache(data);
    // 更新存储
    await storage.setValue<ICache>(key, newCache, encrypt, salt);
  }

  // 获取数据
  async getCache(key: string, getData: Function, encrypt: boolean = false, salt: number = conf.salt) {
    // 判断有没有开启缓存
    if (conf.cache.enabled) {
      const res: ICache = await storage.getValue(key, encrypt, salt);
      if (res) {
        // 取出存储的utc时间
        const utc = res.utcTime;
        // 取出有效时间，计算出过期时间
        const eTime = dayjs(utc).add(res.expired, 'ms');
        // 对比当前的utc时间，过期时间，判断数据是否过期了，没过期就直接返回缓存数据
        if (dayjs().utc() < eTime) {
          // 返回存储的缓存数据
          return res.data;
        }
      }
      // 存储过期，或者不存在，就执行新的请求
      const data = await getData();
      // 更新缓存
      await this.setCache(key, data);
      // 返回新获取的数据
      return data;
    }
    // 直接返回数据
    return await getData();
  }

  // 删除缓存
  async delCache(key: string, encrypt: boolean = false, salt: number = conf.salt) {
    const res: ICache = await storage.getValue(key, encrypt, salt);
    if (res) {
      await storage.delValue(key, encrypt, salt);
    }
  }

  async job(encrypt: boolean = false, salt: number = conf.salt) {
    const list: string[] = await storage.getKeys();
    for (const key of list) {
      const res: ICache = await storage.getValue(key, encrypt, salt);
      if (res) {
        // 取出存储的utc时间
        const utc = res.utcTime;
        // 取出有效时间，计算出过期时间
        const eTime = dayjs(utc).add(res.expired, 'ms');
        // 对比当前的utc时间，过期时间，判断数据是否过期了。如果同时配置了过期删除，这里就要删除该条数据
        if (dayjs().utc() >= eTime && conf.cache.cleanExpired) {
          await storage.delValue(key, encrypt, salt);
        }
      }
    }
  }
}

const localcache = new LocalCache();

export default localcache;
