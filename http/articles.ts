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
    .then((res) => parseData(res.data));
};

// 模糊匹配
export const filterArticles = (token: string, search: string) => {
  return fetch(`http://localhost:1337/api/articles?populate=*&_q=${search}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => parseData(res.data));
};

// 新的结构体
interface Articles {
  id: number;
  title: string;
  content: string;
  description: string;
  image: {
    name: string;
    width: number;
    height: number;
    hash: string;
    url: string;
    provider: string;
  };
  locale: string;
  updatedAt: string;
  createdAt: string;
  publishedAt: string;
}

// 数据转换
const parseData = (data: any): Articles[] => {
  if (data) {
    return data.map((row: any) => {
      const attributes = row.attributes.images.data.attributes;
      return {
        id: row.id,
        title: row.attributes.title,
        description: row.attributes.description,
        content: row.attributes.content,
        image: {
          name: attributes.name,
          url: attributes.url,
          width: attributes.width,
          height: attributes.height,
          provider: attributes.provider,
          hash: attributes.hash,
        },
        locale: row.attributes.locale,
        updatedAt: row.attributes.updatedAt,
        createdAt: row.attributes.createdAt,
        publishedAt: row.attributes.publishedAt,
      };
    });
  }
  return [];
};
