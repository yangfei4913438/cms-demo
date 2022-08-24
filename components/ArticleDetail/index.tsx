import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useUserInfo from 'hooks/useUserInfo';
import { useAppContext } from 'store/index';
import { getArticle } from 'http/articles';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from 'core/queryConsts';
import React, { FC } from 'react';

interface IArticleDetail {
  id: string;
}

const ArticleDetail: FC<IArticleDetail> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { article, setArticle } = useAppContext();
  const [detail, setDetail] = useState<OtherArticle | Article>();

  const query = () => {
    let options = {};
    if (router.locale) {
      options = {
        ...options,
        locale: [router.locale === 'zh' ? 'zh-Hans' : 'en'],
      };
    }
    return getArticle(userInfo?.jwt!, id, options).then(setArticle);
  };

  useQuery(
    queryKeys.filterArticles({
      id,
      locale: router.locale,
    }),
    query,
    {
      // 存在令牌才可以发起查询
      enabled: !!userInfo?.jwt && !!id && router.isReady,
    }
  );

  useEffect(() => {
    if (router.locale && article) {
      const locales = article.locales.map((o) => o.locale);
      const isOther = locales.includes(router.locale);
      if (isOther) {
        // 根据语言选出对应的内容
        setDetail(() => article.locales.find((o) => o.locale === router.locale));
      } else {
        setDetail(() => article);
      }
    }
  }, [article, article?.locales, router.locale]);

  return <div>{detail && detail.content}</div>;
};

export default ArticleDetail;
