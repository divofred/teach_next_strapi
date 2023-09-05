import Link from 'next/link'
import React from 'react'

import Header from './Header/Header'

import Container from '../ui/Container/Container'

interface LayoutProps {
  children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Header />
      <main>
        <Container>{children}</Container>
        <Link
          href={'/rules'}
          style={{
            position: 'fixed',
            bottom: '1rem',
            left: '1rem',
            color: 'lightgray',
            fontSize: '1rem',
          }}
        >
          Правила
        </Link>
      </main>
    </>
  )
}

export default React.memo(Layout)
