import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useUserInfo from 'hooks/useUserInfo';
import { getArticle } from 'http/articles';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote';
import NextLink from 'components/ui/nextLink';
import MDVideo from 'components/ui/markdown/video';
import MDImage from 'components/ui/markdown/image';
import MDPre from 'components/ui/markdown/pre';
import React, { DOMElement, FC } from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { formatTime } from 'utils/times';
import rehypeHighlight from 'rehype-highlight';
import conf from 'conf';

const components = {
  nextLink: (props: {
    // 超链接
    href: string;
    // 自定义类名
    className?: string;
    // 是否当前页打开，默认当前页面打开
    self?: boolean;
    // title属性(seo权重1份)
    title?: string;
  }) => {
    return <NextLink {...props} />;
  },
  pre: (props: { className: string; children: DOMElement<any, any> }) => {
    return <MDPre className={props.className}>{props.children}</MDPre>;
  },
  Video: (props: React.DetailedHTMLProps<React.VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>) => {
    return <MDVideo {...props} />;
  },
  Image: (props: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) => {
    return <MDImage {...props} />;
  },
};

interface IArticleDetail {
  id: string;
}

const ArticleDetail: FC<IArticleDetail> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [detail, setDetail] = useState<Article>();
  const [source, setSource] = useState<MDXRemoteSerializeResult>();

  const query = () => {
    let options = {};
    if (router.locale) {
      options = {
        ...options,
        locale: [router.locale === 'zh' ? 'zh-Hans' : 'en'],
      };
    }
    return getArticle(userInfo?.jwt!, id, options).then((res) => {
      // 本地更新
      setDetail(res);
      // 更新 markdown
      parseContent(res.content).then(setSource);
    });
  };

  useQuery(queryKeys.filterArticles({ id }), query, {
    // 存在令牌才可以发起查询
    enabled: !!userInfo?.jwt && !!id && router.isReady,
  });

  const parseContent = (content: string) => {
    return serialize(content, {
      mdxOptions: { rehypePlugins: [rehypeHighlight] },
    });
  };

  useEffect(() => {
    if (router && detail) {
      // 根据语言选出对应的内容
      const row = detail.locales.find((o) => o.locale === router.locale)!;
      if (row) {
        router.replace('/article/[id]', `/article/${row.id}`, { locale: router.locale });
      }
    }
  }, [detail, detail?.locales, router, router.locale]);

  return (
    <div className="mx-auto max-w-screen-lg overflow-auto p-8">
      <div className="prose prose-lg max-w-none">
        {detail && (
          <div className="space-y-2">
            <h2 className="!my-0 text-3xl font-bold dark:text-white">{detail.title}</h2>
            <div className="text-gray-5 flex space-x-4 text-base">
              <div className="space-x-1">
                <span className="font-bold">{t('filter.sort.updatedAt')}:</span> {formatTime(detail.updatedAt)}
              </div>
              <div className="space-x-1">
                <span className="font-bold">{t('categories')}:</span>
                {detail.categories.map((o) => (
                  <label className="badge badge-secondary" key={o.id}>
                    {o.name}
                  </label>
                ))}
              </div>
              <div className="space-x-1">
                <span className="font-bold">{t('tags')}:</span>
                {detail.tags.map((row) => (
                  <NextLink
                    href={{ pathname: '/tag/[id]', query: { id: row.id } }}
                    self={conf.showDetailSelf}
                    className="badge badge-primary no-underline"
                    key={row.id}
                  >
                    {row.name}
                  </NextLink>
                ))}
              </div>
            </div>
          </div>
        )}
        {source && (
          <article className="markdown-area">
            <MDXRemote {...source} components={components as any} lazy />
          </article>
        )}
      </div>
    </div>
  );
};

export default ArticleDetail;
