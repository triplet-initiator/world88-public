import { SessionProvider, useSession } from 'next-auth/react';
// import '@fortawesome/fontawesome-svg-core/styles.css';
// import { config } from '@fortawesome/fontawesome-svg-core';
// config.autoAddCss = false;

import 'antd/dist/reset.css';
import '@/styles/global.scss';
import '@/styles/reset.css';

import { AppWrapper } from '@/context/AppContext';
import { withAuth, setupLogOutUrl } from '@/helper/withAuth';

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <AppWrapper>
        <Component {...pageProps} />
      </AppWrapper>
    </SessionProvider>
  );
}
