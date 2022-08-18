import qs from 'qs';

const createOptions = (options: object = {}) => {
  return qs.stringify(
    {
      populate: {
        images: {
          fields: ['name', 'width', 'height', 'hash', 'url', 'provider'],
        },
      },
      fields: ['title', 'description', 'updatedAt', 'createdAt'],
      ...options,
    },
    {
      encodeValuesOnly: true, // prettify URL
    }
  );
};

// 获取文章列表
export const getArticles = (token: string, options: object = {}) => {
  // 生成查询参数
  const argsStr = createOptions(options);
  return fetch(`http://localhost:1337/api/articles?${argsStr}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => parseData(res.data));
};

// 数据转换
const parseData = (data: any): Articles[] => {
  if (!data) return [];
  return data.map((row: any) => {
    // 标题图只有一个，所以数据结构是这样的。
    const attributes = row.attributes.images.data.attributes;
    return {
      id: row.id,
      title: row.attributes.title,
      description: row.attributes.description,
      image: {
        name: attributes.name,
        url: attributes.url,
        width: attributes.width,
        height: attributes.height,
        provider: attributes.provider,
        hash: attributes.hash,
      },
      updatedAt: row.attributes.updatedAt,
      createdAt: row.attributes.createdAt,
    };
  });
};
