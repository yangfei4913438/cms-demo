import type { NextPage, GetStaticProps } from 'next';
import { useQuery, dehydrate } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import queryClient from 'core/queryClient';
import { getArticles } from 'http/articles';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';
import List from 'components/List';
import { queryKeys } from 'core/queryConsts';

import useUserInfo from 'hooks/useUserInfo';

// 因为cms的时间都根据utc时间存储，所以解析的时候，需要按utc去解析
dayjs.extend(utc);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 获取操作(因为没有权限，所以不能预先在服务端获取数据)
  // await queryClient.prefetchQuery(queryKeys.articles, () => getArticles('token'));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const Home: NextPage<GetStaticProps> = () => {
  const { userInfo } = useUserInfo();

  const { data } = useQuery(queryKeys.articles, () => getArticles(userInfo?.jwt!), {
    enabled: !!userInfo?.jwt,
  });

  return (
    <Layout>
      <>
        <PageHeader title={'TX CMS API'} />
        <div className="w-full h-full overflow-auto bg-[#f1f1f1]">
          <List data={data} />
        </div>
      </>
    </Layout>
  );
};

export default Home;
