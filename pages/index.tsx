import type { NextPage, GetStaticProps } from 'next';
import { dehydrate } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import { loadTranslations } from 'ni18n';
import { ni18nConfig } from '../ni18n.config';

import queryClient from 'core/queryClient';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';
import List from 'components/List';

// 因为cms的时间都根据utc时间存储，所以解析的时候，需要按utc去解析
dayjs.extend(utc);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 获取操作(因为没有权限，所以不能预先在服务端获取数据)
  // await queryClient.prefetchQuery(queryKeys.articles, () => getArticles('token'));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      // 写上用到的翻译文件命名空间，否则翻译内容不会在服务端渲染。(一个个的找引入组件中引用的，如果实在不想一个个找，那就全写上，不过一般是按需写上，没必要全加载进来。)
      ...(await loadTranslations(ni18nConfig, locale, ['demo'])),
    },
  };
};

const Home: NextPage<GetStaticProps> = () => {
  return (
    <Layout>
      <>
        <PageHeader title={'TX CMS API'} />
        <div className="h-full w-full overflow-auto bg-[#f1f1f1]">
          <List />
        </div>
      </>
    </Layout>
  );
};

export default Home;
