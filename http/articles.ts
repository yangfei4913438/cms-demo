import { token } from 'http/auth';

// 获取文章列表
export const getArticles = () => {
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
