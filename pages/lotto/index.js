import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import Image from 'next/image';
import { UseAppContext } from '@/context/AppContext';
import { Col, Row, Divider, message } from 'antd';
import { MODAL_HEADER, GAME_CATEGORY } from '@/lib/constants';
import { UseProvidersByCategory } from '@/hook/useProvider';
import Loading from '@/components/loading';
import { STATUS_CODE } from '@/lib/constants';
import { UseLaunchGame } from '@/hook/useGame';
import { isMobile } from 'react-device-detect';
import Category from '@/components/category';

const gameData = {
  name: 'Huay Dragon',
  providerName: 'Huay Dragon',
  category: 'Lotto',
  gameCode: 'HDG-LT-1',
  providerCode: 'HDG',
  type: ['NEW'],
  isActive: true,
  isMaintenance: false,
  image: 'https://wildtech-asset.s3.ap-southeast-1.amazonaws.com/games-icon/hdg/hdg-lt-1.webp',
};

export default function Lotto({}) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProvider();
  }, []);

  const getProvider = async () => {
    const query = {
      category: GAME_CATEGORY.LOTTO,
    };

    setIsLoading(true);
    await UseProvidersByCategory(query).then((res) => {
      setProviders(res.providers);
      setIsLoading(false);
    });
  };

  const onClickGame = async (item) => {
    const query = {
      providerCode: item.providerCode,
      gameCode: item.gameCode,
      currency: '',
      language: '',
      betLimit: '',
      redirectHomepage: '',
    };

    if (isMobile) {
      const queryStr = Object.keys(query)
        .map((v) => `${v}=${query[v]}`)
        .join('&');
      window.open(window.location.origin + `/launchGame?${queryStr}`);
    } else {
      await UseLaunchGame(query).then((res) => {
        if (res.code === STATUS_CODE.Success) {
          if (res.gameUrl) {
            window.open(res.gameUrl, '_blank', 'popup');
          }
        } else {
          message.error(res.msg);
        }
      });
    }
  };

  // const onClickGame = async (item) => {
  //   const query = {
  //     providerCode: item.providerCode,
  //     gameCode: item.gameCode,
  //     currency: '',
  //     language: '',
  //     betLimit: '',
  //     redirectHomepage: '',
  //   };
  //   await UseLaunchGame(query).then((res) => {
  //     if (res.code === STATUS_CODE.Success) {
  //       // if (isMobile) {
  //       //   window.open(res.gameUrl, '_blank');
  //       // } else {
  //       popupWindow(res.gameUrl, '_blank', 1200, 1200);
  //       // }
  //     } else {
  //       message.error(res.msg);
  //     }
  //   });
  // };

  // function popupWindow(url, windowName, w, h) {
  //   const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
  //   const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;
  //   return window.open(
  //     url,
  //     windowName,
  //     `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
  //   );
  // }

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        <Layout>
          <Category activeKey={'lotto'} />
          <Wrapper>
            <section className="mt-4">
              <Row>
                {providers?.map((item, idx) => (
                  <Col key={idx} className="my-4" xs={12} sm={12} md={8} lg={8} xl={6}>
                    <figure
                      className="provider-card"
                      onClick={() => {
                        if (session) {
                          // router.push(`/lotto/${item.providerCode.toLowerCase()}`);
                          onClickGame(gameData);
                        } else {
                          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
                        }
                      }}
                    >
                      <section className="w-full h-40 md:h-60 lg:h-60 relative">
                        <img
                          src={item.image}
                          className="card-image"
                          alt={idx}
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                      </section>
                    </figure>
                  </Col>
                ))}
              </Row>
            </section>
            <section>
              <Divider className="lotto">
                <div className="text-3xl text-white">ตรวจหวย</div>
              </Divider>
              <section style={{ height: '90vh' }} className="relative overflow-auto">
                <iframe
                  className="w-full h-full absolute"
                  style={{ top: '-65px', height: 'calc(100% + 45px)' }}
                  src="https://huaydragon.com/results"
                ></iframe>
              </section>
            </section>
          </Wrapper>
        </Layout>
      </>
    );
  }
}

// export const getServerSideProps = withAuth(async (context) => {
//   const { req, res } = context;
//   console.log('context.authStatus', context.authStatus);
//   if (context.authStatus) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: setupLogOutUrl(context),
//       },
//     };
//   }

//   return {
//     props: {}, // will be passed to the page component as props
//   };
// });
