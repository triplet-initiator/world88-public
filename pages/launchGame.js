import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { withAuth } from '@/helper/withAuth';
import { isMobile } from 'react-device-detect';
import ScreenLoading from '@/components/loading/screen-loading';
import { NEXT_AUTH_STATUS, STATUS_CODE } from '@/lib/constants';
import { useSession } from 'next-auth/react';
import { message } from 'antd';
import { UseLaunchGame } from '@/hook/useGame';

export default function LaunchGame({ authStatus, queryGssp }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  // const [gameUrl, setGameUrl] = useState(null);

  useEffect(() => {
    if (authStatus && authStatus.code === 1101) {
      window.close();
    }
  }, []);

  useEffect(() => {
    if (status === NEXT_AUTH_STATUS.UNAUTHENTICATED) {
      if (isMobile) {
        router.push('/logout?message=โทเคนหมดอายุ กรุณา login ใหม่อีกครั้ง');
      } else {
        window.close();
      }
    } else {
      onClickGame(router.query);
    }
  }, [router, status]);

  const onClickGame = async (item) => {
    const query = {
      providerCode: item.providerCode,
      gameCode: item.gameCode,
      currency: '',
      language: '',
      betLimit: '',
      redirectHomepage: '',
    };
    await UseLaunchGame(query).then((res) => {
      if (res.code === STATUS_CODE.Success) {
        if (res.gameUrl) {
          window.open(res.gameUrl, '_self');
        }
      } else {
        message.error(res.msg);
      }
    });
  };

  return (
    <>
      <ScreenLoading />
    </>
  );
}

export const getServerSideProps = withAuth(async (context) => {
  const { req, res } = context;
  // if (context.authStatus) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: setupLogOutUrl(context),
  //     },
  //   };
  // }

  return {
    props: {
      authStatus: context.authStatus || {},
      queryGssp: context.query,
    }, // will be passed to the page component as props
  };
});
