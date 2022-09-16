import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useUserInfo from 'hooks/useUserInfo';
import { getArticle } from 'http/articles';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import NextLink from 'components/ui/nextLink';
import React, { type FC } from 'react';
import conf from 'conf';
import Markdown from 'components/ui/markdown';
import dayjs from 'dayjs';
import cx from 'classnames';

interface IArticleDetail {
  id: string;
}

const ArticleDetail: FC<IArticleDetail> = ({ id }) => {
  const { t } = useTranslation('ui');
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const [article, setArticle] = useState<Article>();

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
      setArticle(res);
    });
  };

  useQuery(queryKeys.filterArticles({ id }), query, {
    // 存在令牌才可以发起查询
    enabled: !!userInfo?.jwt && !!id && router.isReady,
  });

  useEffect(() => {
    if (router && article) {
      // 根据语言选出对应的内容
      const row = article.locales.find((o) => o.locale === router.locale)!;
      if (row) {
        router.replace('/article/[id]', `/article/${row.id}`, { locale: router.locale });
      }
    }
  }, [article, article?.locales, router, router.locale]);

  const getReadTime = (md: string) => {
    const str = md + '';
    const imgs1 = str.split('<img').length - 1;
    const imgs2 = str.split('<Image').length - 1;
    const imgs = imgs1 + imgs2;
    const end = str.replace(/<img.*?src="(.*?)".*?\/?>/gi, '').replace(/<Image.*?src="(.*?)".*?\/?>/gi, '');
    const strNum = end.length;

    let num = 0;
    if (imgs > 10) {
      const len = imgs - 10;
      num = Array.from({ length: len }, (_, idx) => idx)
        .map((o) => 12 - o)
        .reduce((a, b) => a + b);
    }

    return Math.ceil(strNum / 275 + num + (imgs % 10) * 3);
  };

  return (
    <div className="h-screen w-screen overflow-auto">
      <div className="x-grid py-8 lg:py-16">
        <div className="prose prose-lg max-w-lg lg:col-span-10 lg:max-w-none">
          {article && (
            <div className="space-y-6">
              <div className="space-y-4 text-center">
                <h4 className="text-2xl font-bold">{article.title}</h4>
                <div className="flex items-center space-x-4 text-sm font-normal text-gray-400">
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-calendar3"
                      viewBox="0 0 16 16"
                    >
                      <path d="M14 0H2a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zM1 3.857C1 3.384 1.448 3 2 3h12c.552 0 1 .384 1 .857v10.286c0 .473-.448.857-1 .857H2c-.552 0-1-.384-1-.857V3.857z" />
                      <path d="M6.5 7a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm-9 3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm3 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                    </svg>
                    {t('date.updated')}
                    {dayjs.utc(article.updatedAt).local().format(t('date.format'))}
                  </span>
                  <span className="flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      className="bi bi-stopwatch"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8.5 5.6a.5.5 0 1 0-1 0v2.9h-3a.5.5 0 0 0 0 1H8a.5.5 0 0 0 .5-.5V5.6z" />
                      <path d="M6.5 1A.5.5 0 0 1 7 .5h2a.5.5 0 0 1 0 1v.57c1.36.196 2.594.78 3.584 1.64a.715.715 0 0 1 .012-.013l.354-.354-.354-.353a.5.5 0 0 1 .707-.708l1.414 1.415a.5.5 0 1 1-.707.707l-.353-.354-.354.354a.512.512 0 0 1-.013.012A7 7 0 1 1 7 2.071V1.5a.5.5 0 0 1-.5-.5zM8 3a6 6 0 1 0 .001 12A6 6 0 0 0 8 3z" />
                    </svg>
                    {t('need-time', { times: getReadTime(article.content) })}
                  </span>
                </div>
              </div>
              <div className="flex h-full w-full space-x-2">
                <div className="text-sm font-normal">{t('tags')}:</div>
                <div className={cx('flex flex-1 flex-wrap items-start gap-2 overflow-auto')}>
                  {article!.tags.map((tag) => (
                    <NextLink
                      href={{ pathname: '/tag/[id]', query: { id: tag.id } }}
                      self={conf.showDetailSelf}
                      className="badge badge-md badge-primary no-underline"
                      key={tag.id}
                    >
                      {tag.name}
                    </NextLink>
                  ))}
                </div>
              </div>
              <div className="divider" />
              <Markdown content={article.content} className="pb-16" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
