import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import Image from 'next/image';
import { withAuth, setupLogOutUrl } from '@/helper/withAuth';
import { Col, Row, Button, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { GAME_CATEGORY } from '@/lib/constants';
import { UseGamesByCategory } from '@/hook/useGame';
import { UseLaunchGame } from '@/hook/useGame';
import Loading from '@/components/loading';
import { STATUS_CODE } from '@/lib/constants';
import { isMobile } from 'react-device-detect';
import styles from '../../styles/search.module.scss';

export default function CasinoGame({}) {
  const router = useRouter();
  const [games, setGames] = useState([]);
  const [showGame, setShowGame] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [mobile, setMobile] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const { provider } = router.query;
    const _getGames = async (provider) => await getGames(provider);
    setMobile(isMobile);
    if (provider) {
      _getGames(provider);
    }
  }, [router]);

  const getGames = async (providerCode) => {
    const query = {
      providerCode: providerCode.toUpperCase(),
      category: GAME_CATEGORY.LIVE_CASINO,
    };

    setIsLoading(true);
    await UseGamesByCategory(query).then((res) => {
      setGames(res.games);
      setShowGame(res.games);
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

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearch = () => {
    const filteredGames = games.filter((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    filteredGames.length === 0 ? setShowGame(games) : setShowGame(filteredGames);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

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
          <Wrapper>
            <div className="flex justify-between">
              <section className="mt-4">
                <Button
                  className="back-button mb-4"
                  icon={<ArrowLeftOutlined className="align-sub icon" />}
                  onClick={() => (mobile ? router.push('/') : router.push('/casino'))}
                >
                  กลับ
                </Button>
              </section>
              <div className="mt-3">
                <input
                  className={styles.input}
                  type="text"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <section>
              <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                {showGame?.map((item, idx) => (
                  <Col key={idx} className="my-4" xl={4} lg={6} md={8} xs={8}>
                    <figure
                      className="game-card"
                      onClick={() => {
                        onClickGame(item);
                      }}
                    >
                      <section className="w-full md:h-40 h-20 relative">
                        <img
                          src={item.image}
                          className="card-image"
                          alt={idx}
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                      </section>
                      <figcaption className="mt-2">{item.name}</figcaption>
                    </figure>
                  </Col>
                ))}
              </Row>
            </section>
          </Wrapper>
        </Layout>
      </>
    );
  }
}

export const getServerSideProps = withAuth(async (context) => {
  const { req, res } = context;
  if (context.authStatus) {
    return {
      redirect: {
        permanent: false,
        destination: setupLogOutUrl(context),
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
});
