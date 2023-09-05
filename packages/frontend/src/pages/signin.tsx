import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import { getCookie } from 'cookies-next';
import Layout from '@/src/components/layout/Layout';
import SigninSignup from '../components/SigninSignup/SigninSignup';

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie('token', { req, res });
  if (!!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

const SigninSignupPage: NextPage = () => {
  return (
    <Layout>
      <SigninSignup />
    </Layout>
  );
};
export default React.memo(SigninSignupPage);
