import Link from 'next/link';
import { FC } from 'react';
import styles from './Header.module.scss';
import Image from 'next/image';
import Nav from './Nav/Nav';
import Container from '../../ui/Container/Container';
import React from 'react';

const Header: FC = () => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.wrapper}>
          <Link className={styles.logo} href={'/'}>
            <Image src="/logo11.png" alt={'logo'} width={150} height={75} />
          </Link>
          <Nav />
        </div>
      </Container>
    </header>
  );
};
export default React.memo(Header);
