// 定义一些基础配置
const conf = {
  // localStorage 存储数据，加密时使用的盐
  salt: 6662333,
  // 是否开启浏览器存储加密，一般来说生产环境下需要开启。
  encrypt: false,
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
};

export default conf;
