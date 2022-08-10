import type { NextPage, GetStaticProps } from 'next';
import PageHeader from 'components/pageHeader';
import Layout from 'components/layout';

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
  props: {
    name: 'mock server',
  },
});

const Home: NextPage<GetStaticProps> = ({ name }) => {
  return (
    <Layout>
      <PageHeader title={'mock server'} />
      <div>{name}</div>
    </Layout>
  );
};

export default Home;
