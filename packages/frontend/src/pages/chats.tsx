import React from 'react';
import Layout from '@/src/components/layout/Layout';
import Chats from '../components/pages/Chats/Chats';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';

const ChatsPage: React.FC = () => {
  return (
    <Layout>
      <Chats />
    </Layout>
  );
};
export default React.memo(ChatsPage);
