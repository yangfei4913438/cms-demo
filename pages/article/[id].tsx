import type { GetStaticProps, NextPage } from 'next';
import { dehydrate, useQuery } from '@tanstack/react-query';
import queryClient from 'core/queryClient';
import { loadTranslations } from 'ni18n';
import { ni18nConfig } from '../../ni18n.config';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';
import { queryKeys } from 'core/queryConsts';
import { getArticle } from 'http/articles';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';
import useUserInfo from 'hooks/useUserInfo';
import { useAppContext } from 'store/index';

export const getStaticProps: GetStaticProps = async ({ locale, params }) => {
  // 获取操作(因为没有权限，所以不能预先在服务端获取数据)
  // await queryClient.prefetchQuery(queryKeys.articles, () => getArticles('token'));

  return {
    props: {
      id: params?.id,
      dehydratedState: dehydrate(queryClient),
      // 写上用到的翻译文件命名空间，否则翻译内容不会在服务端渲染。(一个个的找引入组件中引用的，如果实在不想一个个找，那就全写上，不过一般是按需写上，没必要全加载进来。)
      ...(await loadTranslations(ni18nConfig, locale, ['home'])),
    },
  };
};

export const getStaticPaths = async ({ params }: { params: { id: string } }) => {
  return {
    paths: [{ params: { id: params?.id ?? '1' } }],
    fallback: true,
  };
};

const Article: NextPage<{ id: string }> = ({ id }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { userInfo } = useUserInfo();
  const { article, setArticle } = useAppContext();

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
      enabled: !!userInfo?.jwt,
    }
  );

  return (
    <>
      <PageHeader title={'Article Detail'} />
      <Layout>
        <div>{article && article.content}</div>
      </Layout>
    </>
  );
};

export default Article;
