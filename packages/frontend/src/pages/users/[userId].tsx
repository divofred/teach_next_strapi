import Layout from '@/src/components/layout/Layout';
import Profile from '@/src/components/pages/Profile/Profile';
import { client } from '@/src/lib/client';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const res = await client.get(`/users/${query?.userId}?populate=*`);
  const user = res?.data;
  if (!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return { props: { user } };
};

const UserIdPage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ user }) => {
  return (
    <Layout>
      <Profile {...user} />
    </Layout>
  );
};
export default UserIdPage;
