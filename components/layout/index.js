import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import Meta from '../meta';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Navigator from '@/components/navigator';
import Sidebar from '@/components/sidebar';
import styles from '@/components/layout/layout.module.scss';
import ScreenLoading from '@/components/loading/screen-loading';

import { UseAppContext } from '@/context/AppContext';
import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Layout({ children, title }) {
  const { data: session, status } = useSession();
  const AppContext = UseAppContext();
  const router = useRouter();
  const [mobile, setMobile] = useState(true);

  useEffect(() => {
    setMobile(isMobile);
  }, []);

  return (
    <>
      <Meta title={title} />
      <Header />
      <Sidebar />
      <main
        id="main"
        className={`${styles.main} ${
          AppContext.state.isSidebarActive ? 'sidebar-active' : 'sidebar-inactive'
        }`}
      >
        {children}
      </main>
      <Navigator />
      <Footer />
    </>
  );
}

Layout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.array,
};
