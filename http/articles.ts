import qs from 'qs';
import conf from 'conf';

const createOptions = (options: object = {}, isDetail: boolean = false) => {
  // 需要的字段
  const infoFields = ['title', 'description', 'updatedAt', 'createdAt'];
  const fullFields = ['title', 'content', 'description', 'updatedAt', 'createdAt'];

  const populate = {
    images: {
      fields: ['name', 'width', 'height', 'hash', 'url', 'provider'],
    },
  };

  return qs.stringify(
    {
      populate: isDetail
        ? { ...populate, localizations: { data: { fields: fullFields } } }
        : populate,
      fields: isDetail ? fullFields : infoFields,
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
  return fetch(`${conf.baseURL}/api/articles?${argsStr}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => ({ list: parseData(res.data), pagination: res.meta.pagination }));
};

// 获取文章详情
export const getArticle = (token: string, id: string, options: object = {}) => {
  // 生成查询参数
  const argsStr = createOptions(options, true);
  return fetch(`${conf.baseURL}/api/articles/${id}?${argsStr}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => parseDetail(res.data));
};

// 解析文章
const parseDetail = (detail: any): Article => {
  const {
    id,
    attributes: {
      title,
      description,
      content,
      images: {
        // 标题图只有一个，所以数据结构是这样的。
        data: {
          attributes: { name, url, width, height, provider, hash },
        },
      },
      localizations: { data },
      updatedAt,
      createdAt,
    },
  } = detail;

  const locales: OtherArticle[] = data.map((row: any) => {
    const {
      id,
      attributes: { title, content, description, updatedAt, createdAt, locale },
    } = row;

    return {
      id,
      title,
      content,
      description,
      updatedAt,
      createdAt,
      locale,
    };
  });

  return {
    id,
    title,
    content,
    description,
    image: { name, url, width, height, provider, hash },
    locales,
    updatedAt,
    createdAt,
  };
};

// 解析文章列表
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
