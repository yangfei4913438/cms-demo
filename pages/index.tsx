import type { NextPage, GetStaticProps } from 'next';
import { useMemo } from 'react';
import { useQuery, dehydrate } from '@tanstack/react-query';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

import queryClient from 'core/queryClient';
import { getArticles } from 'http/articles';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';

// 因为cms的时间都根据utc时间存储，所以解析的时候，需要按utc去解析
dayjs.extend(utc);

export const getStaticProps: GetStaticProps = async ({ locale }) => {
  // 获取操作
  await queryClient.prefetchQuery(['articles'], getArticles);

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

interface Articles {
  id: number;
  title: string;
  content: string;
  description: string;
  image: {
    name: string;
    width: number;
    height: number;
    hash: string;
    url: string;
    provider: string;
  };
  locale: string;
  updatedAt: string;
  createdAt: string;
  publishedAt: string;
}

const Home: NextPage<GetStaticProps> = ({ name }) => {
  const { data } = useQuery(['articles'], getArticles);

  const list: Articles[] = useMemo(() => {
    if (data) {
      return data.map((row: any) => {
        const attributes = row.attributes.images.data.attributes;
        return {
          id: row.id,
          title: row.attributes.title,
          description: row.attributes.description,
          content: row.attributes.content,
          image: {
            name: attributes.name,
            url: attributes.url,
            width: attributes.width,
            height: attributes.height,
            provider: attributes.provider,
            hash: attributes.hash,
          },
          locale: row.attributes.locale,
          updatedAt: row.attributes.updatedAt,
          createdAt: row.attributes.createdAt,
          publishedAt: row.attributes.publishedAt,
        };
      });
    }
    return [];
  }, [data]);

  return (
    <Layout>
      <>
        <PageHeader title={'TX CMS API'} />
        <div className="w-full h-full overflow-auto space-y-12 p-4 bg-[#f1f1f1]">
          {list.map((row) => {
            return (
              <div
                className="w-full flex bg-white box-border overflow-hidden rounded-md shadow-md"
                style={{ height: 200 }}
                key={row.id}
              >
                <img
                  className="h-full"
                  style={{ width: 360 }}
                  src={`http://localhost:1337${row.image.url}`}
                  alt={row.image.name}
                />
                <div className="h-full flex-1 flex flex-col items-start justify-start p-6">
                  <div className="w-full h-8 text-2xl font-bold flex items-center">
                    <p>{row.title}</p>
                  </div>
                  <div className="w-full flex-1">{row.description}</div>
                  <div className="w-full flex justify-between items-center">
                    <div>{dayjs.utc(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
                    <button className="btn btn-md btn-outline btn-ghost">了解更多</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </>
    </Layout>
  );
};

export default Home;
