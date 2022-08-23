import type { NextPage, GetStaticProps } from 'next';
import { dehydrate } from '@tanstack/react-query';
import { loadTranslations } from 'ni18n';
import { ni18nConfig } from '../ni18n.config';

import queryClient from 'core/queryClient';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';
import Articles from 'components/Articles';

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 获取操作(因为没有权限，所以不能预先在服务端获取数据)
  // await queryClient.prefetchQuery(queryKeys.articles, () => getArticles('token'));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      // 写上用到的翻译文件命名空间，否则翻译内容不会在服务端渲染。(一个个的找引入组件中引用的，如果实在不想一个个找，那就全写上，不过一般是按需写上，没必要全加载进来。)
      ...(await loadTranslations(ni18nConfig, locale, ['home'])),
    },
  };
};

const Home: NextPage<GetStaticProps> = () => {
  return (
    <>
      <PageHeader title={'Articles'} />
      <Layout>
        <Articles />
      </Layout>
    </>
  );
};

export default Home;
