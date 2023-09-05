import { isAxiosError } from 'axios'
import { GetServerSideProps, InferGetServerSidePropsType, InferGetStaticPropsType } from 'next'
import React from 'react'

import Home from '@/src/components/pages/Home/Home'

import Layout from '../components/layout/Layout'
import { client } from '../lib/client'

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const res = await client.get('/users?populate=*')
    const users = res?.data

    for (let i = users?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = users[i]
      users[i] = users[j]
      users[j] = temp
    }

    return { props: { users } }
  } catch (error) {
    if (isAxiosError(error)) console.error(error.request, error.response)
    return { props: { users: null } }
  }
}

const HomePage: React.FC<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ users }) => {
  return (
    <Layout>
      <Home users={users} />
    </Layout>
  )
}
export default React.memo(HomePage)
