import qs from 'qs';
import conf from 'conf';
import localcache from 'utils/localCache';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

// 使用utc时间，兼容不同地区的使用
dayjs.extend(utc);

const createOptions = (options: { [key: string]: any } = {}, isDetail: boolean = false) => {
  // 需要的字段明细
  const infoFields = ['title', 'description', 'updatedAt', 'createdAt', 'locale'];
  const fullFields = ['title', 'content', 'description', 'updatedAt', 'createdAt', 'locale'];

  // 基础字段
  const base = {
    images: {
      fields: ['name', 'width', 'height', 'hash', 'url', 'provider'],
    },
    tags: { fields: ['name'] },
    categories: { fields: ['name'] },
  };

  // 文章详情
  const detail = {
    ...base,
    // 多语言因为没有提供关联信息，所以不能作为明细直接使用，只能取概要信息
    localizations: { fields: infoFields },
  };

  return qs.stringify(
    {
      populate: isDetail ? detail : base,
      fields: isDetail ? fullFields : infoFields,
      ...options,
      filters: {
        ...(options?.filters ?? {}),
        categories: {
          id: {
            $in: [1, 2], // 每个产品的分类都是确定的，不要把其他分类的数据查询过来。这里的两个ID对应不同的语言
          },
        },
      },
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
  const key = `/api/articles?${argsStr}`;
  const url = `${conf.baseURL}${key}`;

  const getData = () => {
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => ({ list: parseData(res.data), pagination: res.meta.pagination }));
  };

  return localcache.getCache(`GET${key}`, getData);
};

// 获取文章详情
export const getArticle = (token: string, id: string, options: object = {}) => {
  // 生成查询参数
  const argsStr = createOptions(options, true);
  const key = `/api/articles/${id}?${argsStr}`;
  const url = `${conf.baseURL}${key}`;

  const getData = () => {
    return fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => parseDetail(res.data));
  };

  return localcache.getCache(`GET${key}`, getData);
};

// 解析文章
const parseDetail = (detail: any): Article => {
  const {
    id,
    attributes: {
      title,
      description,
      content,
      locale,
      images: {
        // 标题图只有一个，所以数据结构是这样的。
        data: {
          attributes: { name, url, width, height, provider, hash },
        },
      },
      localizations: { data },
      categories: { data: cData },
      tags: { data: tData },
      updatedAt,
      createdAt,
    },
  } = detail;

  const locales: OtherArticle[] = data.map((row: any) => {
    const {
      id,
      attributes: { title, description, updatedAt, createdAt, locale },
    } = row;

    return {
      id,
      title,
      description,
      updatedAt,
      createdAt,
      locale: locale === 'zh-Hans' ? 'zh' : locale, // 前后端对语言key定义不一致，使用之前，需要处理成和前端一致。
    };
  });

  const categories = cData.map((row: any) => ({ id: row.id, name: row.attributes.name }));
  const tags = tData.map((row: any) => ({ id: row.id, name: row.attributes.name }));

  return {
    id,
    title,
    content,
    description,
    locale: locale === 'zh-Hans' ? 'zh' : locale, // 前后端对语言key定义不一致，使用之前，需要处理成和前端一致。,
    image: { name, url, width, height, provider, hash },
    locales,
    categories,
    tags,
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
        locale,
        images: {
          // 标题图只有一个，所以数据结构是这样的。
          data: {
            attributes: { name, url, width, height, provider, hash },
          },
        },
        categories: { data: cData },
        tags: { data: tData },
        updatedAt,
        createdAt,
      },
    }) => {
      const categories = cData.map((row: any) => ({ id: row.id, name: row.attributes.name }));
      const tags = tData.map((row: any) => ({ id: row.id, name: row.attributes.name }));

      return {
        id,
        title,
        description,
        locale: locale === 'zh-Hans' ? 'zh' : locale, // 前后端对语言key定义不一致，使用之前，需要处理成和前端一致。,
        image: { name, url, width, height, provider, hash },
        categories,
        tags,
        updatedAt,
        createdAt,
      };
    }
  );
};
