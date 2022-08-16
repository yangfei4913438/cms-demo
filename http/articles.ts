// 获取文章列表
export const getArticles = (token: string) => {
  return fetch('http://localhost:1337/api/articles?populate=*', {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => res.data);
};
