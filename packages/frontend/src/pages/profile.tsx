import Layout from '@/src/components/layout/Layout';
import Profile from '../components/pages/Profile/Profile';
import React from 'react';

const ProfilePage: React.FC = () => {
  return (
    <Layout>
      <Profile />
    </Layout>
  );
};
export default React.memo(ProfilePage);
