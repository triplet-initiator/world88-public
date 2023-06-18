import Head from 'next/head';
import PropTypes from 'prop-types';
import { BRAND_NAME, TITLE, DESCRIPTION, WEBSITE } from '@/seo/index';
import { envConfig } from '@/lib/config';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Meta({ title = TITLE }) {
  const router = useRouter();
  const [canonical, setCanonical] = useState('');

  useEffect(() => {
    setCanonical(router.route);
  }, [router]);
  return (
    <Head>
      <title>{title}</title>
      <meta property="og:image" content={`${envConfig.baseUrl}/images/logo/wildtech.png`} />
      <meta property="og:title" content={TITLE} key="title" />
      <meta name="description" content={DESCRIPTION} />
      <link rel="canonical" href={`${WEBSITE}${canonical}`} />

      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/favicon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
      <link rel="shortcut icon" href="/favicon/favicon.png" />
      <meta name="viewport" content="initial-scale=1, width=device-width" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="msapplication-config" content="/favicon/browserconfig.xml" />
      <meta name="theme-color" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
    </Head>
  );
}

Meta.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  image: PropTypes.string,
};
