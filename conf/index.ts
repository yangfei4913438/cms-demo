// 定义一些基础配置
const conf = {
  // localStorage 存储数据，加密时使用的盐
  salt: 6662333,
  // 是否开启浏览器存储加密，一般来说生产环境下需要开启。
  encrypt: false,
  // 默认使用的加密进制，加密进制的取值范围是2-36，其中24-30产生的数据量是最少的。
  defaultHex: 24,
  // 文章的分类中英文ID，避免请求其他分类的数据
  categories: [1, 2],
  // 筛选面版默认开启配置
  filters: {
    // 模糊搜索
    search: false,
    // 时间范围
    timeRange: false,
    // 排序
    sort: false,
    // 排序
    pagination: false,
    // 每页最小数据量
    pageSizeMin: 5,
    // 每页最大数据量
    pageSizeMax: 50,
  },
  // cms api base url
  baseURL: 'http://localhost:1337',
  // 文章明细，是否在当前页面打开
  showDetailSelf: true,
  // 本地缓存
  cache: {
    enabled: true, // 查询结果是否开启本地缓存
    expired: 1000 * 60 * 60 * 24 * 7, // 过期时间为7天
    cleanExpired: true, // 过期的数据是不是要清理掉, 定时任务会根据这里的配置决定要不要删除存储的数据
    cleanInterval: 1000 * 60 * 10, // 每10分钟执行一次数据清理
  },
};

export default conf;
