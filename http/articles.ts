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
    .then((res) => ({ list: parseData(res.data), pagination: res.meta.pagination }));
};

// 数据转换
const parseData = (data: any[]): Articles[] => {
  return data.map(
    ({
      id,
      attributes: {
        title,
        description,
        images: {
          // 标题图只有一个，所以数据结构是这样的。
          data: {
            attributes: { name, url, width, height, provider, hash },
          },
        },
        updatedAt,
        createdAt,
      },
    }) => ({
      id,
      title,
      description,
      image: { name, url, width, height, provider, hash },
      updatedAt,
      createdAt,
    })
  );
};
