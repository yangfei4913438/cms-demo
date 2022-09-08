import conf from 'conf';
import localcache from 'utils/localCache';
import { createOptions } from 'http/helper';

const createArticleOptions = (options: { [key: string]: any } = {}, isDetail: boolean = false) => {
  // 需要的字段明细
  const infoFields = ['title', 'description', 'updatedAt', 'createdAt', 'locale'];
  const fullFields = ['title', 'content', 'description', 'updatedAt', 'createdAt', 'locale'];

  // 基础字段
  const base = {
    image: { fields: ['name', 'width', 'height', 'hash', 'url', 'provider'] },
    tags: { fields: ['name'] },
    category: { fields: ['name'] },
    catalogs: { fields: ['name', 'level'] },
  };

  // 文章详情
  const detail = {
    ...base,
    // 多语言因为没有提供关联信息，所以不能作为明细直接使用，只能取概要信息
    localizations: { fields: infoFields },
  };

  return createOptions({
    fields: isDetail ? fullFields : infoFields,
    populate: isDetail ? detail : base,
    options,
  });
};

// 获取文章列表
export const getArticles = (token: string, options: object = {}) => {
  // 生成查询参数
  const argsStr = createArticleOptions(options);
  const key = `/api/articles?${argsStr}`;
  const url = `${conf.cmsApi}${key}`;

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
  const argsStr = createArticleOptions(options, true);
  const key = `/api/articles/${id}?${argsStr}`;
  const url = `${conf.cmsApi}${key}`;

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
      localizations: { data },
      // 标题图只有一个，所以数据结构是这样的。
      image: { data: iData },
      category: { data: cData },
      tags: { data: tData },
      catalogs: { data: clData },
      updatedAt,
      createdAt,
    },
  } = detail;

  const category = { id: cData.id, name: cData.attributes.name };
  const tags = tData.map((row: any) => ({ id: row.id, name: row.attributes.name }));
  const catalogs = clData.map((row: any) => ({
    id: row.id,
    name: row.attributes.name,
    level: row.attributes.level,
  }));

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

  return {
    id,
    title,
    content,
    description,
    locale: locale === 'zh-Hans' ? 'zh' : locale, // 前后端对语言key定义不一致，使用之前，需要处理成和前端一致。,
    image: !!iData
      ? {
          name: iData.attributes.name,
          url: iData.attributes.url,
          width: iData.attributes.width,
          height: iData.attributes.height,
          provider: iData.attributes.provider,
          hash: iData.attributes.hash,
        }
      : undefined,
    category,
    tags,
    catalogs,
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
        locale,
        // 标题图只有一个，所以数据结构是这样的。
        image: { data: iData },
        category: { data: cData },
        tags: { data: tData },
        catalogs: { data: clData },
        updatedAt,
        createdAt,
      },
    }) => {
      const category = { id: cData.id, name: cData.attributes.name };
      const tags = tData.map((row: any) => ({ id: row.id, name: row.attributes.name }));
      const catalogs = clData.map((row: any) => ({
        id: row.id,
        name: row.attributes.name,
        level: row.attributes.level,
      }));

      return {
        id,
        title,
        description,
        locale: locale === 'zh-Hans' ? 'zh' : locale, // 前后端对语言key定义不一致，使用之前，需要处理成和前端一致。,
        image: !!iData
          ? {
              name: iData.attributes.name,
              url: iData.attributes.url,
              width: iData.attributes.width,
              height: iData.attributes.height,
              provider: iData.attributes.provider,
              hash: iData.attributes.hash,
            }
          : undefined,
        category,
        tags,
        catalogs,
        updatedAt,
        createdAt,
      };
    }
  );
};
