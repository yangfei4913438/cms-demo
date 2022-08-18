// 查询key列表
export const queryKeys = {
  // 生成文章列表过滤关键字
  filterArticles: (filter: object) => ['articles', JSON.stringify(filter)],
};
