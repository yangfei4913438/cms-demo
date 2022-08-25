import { dehydrate } from '@tanstack/react-query';
import queryClient from 'core/queryClient';
import { loadTranslations } from 'ni18n';
import { ni18nConfig } from '../../ni18n.config';
import { NextPage } from 'next';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';
import Articles from 'components/Articles';
import { useEffect } from 'react';
import { useAppContext } from 'store/index';
import { useRouter } from 'next/router';

export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const paths = locales?.map((locale) => ({ params: { id: 'null' }, locale }));
  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ locale, params }: { locale: string; params: { id: string } }) => {
  // 获取操作(因为没有权限，所以不能预先在服务端获取数据)
  // await queryClient.prefetchQuery(queryKeys.articles, () => getArticles('token'));

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      // 写上用到的翻译文件命名空间，否则翻译内容不会在服务端渲染。(一个个的找引入组件中引用的，如果实在不想一个个找，那就全写上，不过一般是按需写上，没必要全加载进来。)
      ...(await loadTranslations(ni18nConfig, locale, ['home'])),
      id: params.id,
    },
  };
};

const Tag: NextPage<{ id: string }> = ({ id }) => {
  const router = useRouter();
  const { setTagId } = useAppContext();

  useEffect(() => {
    if (router.query?.id || id) {
      const tagId = (router.query?.id as string) ?? id;
      setTagId(tagId);
    }
  }, [id, router.locale, router.query?.id, setTagId]);

  return (
    <>
      <PageHeader title={`Tag Articles`} />
      <Layout>
        <Articles isTag={true} />
      </Layout>
    </>
  );
};

export default Tag;
