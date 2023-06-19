import Image from 'next/image';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import Link from 'next/link';
import styles from '@/styles/index.module.scss';
import { useSession } from 'next-auth/react';
import { UseAppContext } from '@/context/AppContext';
import PromotionCarousel from '@/components/carousel/promotion';
import { Row, Col, Typography, Button, message } from 'antd';
import { MODAL_HEADER, GAME_CATEGORY, STATUS_CODE } from '@/lib/constants';
import { isMobile, isTablet, isDesktop } from 'react-device-detect';
import { useState, useEffect } from 'react';
import { UseProvidersByCategory } from '@/hook/useProvider';
import { UseLaunchGame } from '@/hook/useGame';
import { useRouter } from 'next/router';
import { withAuth } from '@/helper/withAuth';

import { UseFetchAffiliate } from '@/hook/useAffiliate';

const PROVIDERS_PATH = {
  UFA: 'ufa',
  SLOT: 'slot',
  CASINO: 'casino',
  FISHING: 'fishing-games',
  SPORT: 'sport',
  LOTTO: 'lotto',
  TABLE: 'table-games',
  ARCADE: 'arcade',
  OTHER: 'other',
};

const CATEGORY_LIST = [
  {
    game: GAME_CATEGORY.SLOT,
    provider: PROVIDERS_PATH.SLOT,
    name: 'สล็อต',
    path: '/images/newIcon/icon_slot.webp',
  },
  {
    game: GAME_CATEGORY.UFA,
    provider: PROVIDERS_PATH.UFA,
    name: 'UFA',
    path: '/images/newIcon/icon_ufa.webp',
  },
  {
    game: GAME_CATEGORY.LIVE_CASINO,
    provider: PROVIDERS_PATH.CASINO,
    name: 'คาสิโน',
    path: '/images/newIcon/icon_casino.webp',
  },
  {
    game: GAME_CATEGORY.FISHING_GAMES,
    provider: PROVIDERS_PATH.FISHING,
    name: 'ยิงปลา',
    path: '/images/newIcon/icon_fishing.webp',
  },
  {
    game: GAME_CATEGORY.SPORT_BOOK,
    provider: PROVIDERS_PATH.SPORT,
    name: 'กีฬา',
    path: '/images/newIcon/icon_sport.webp',
  },
  {
    game: GAME_CATEGORY.LOTTO,
    provider: PROVIDERS_PATH.LOTTO,
    name: 'หวย',
    path: '/images/newIcon/icon_lotto.webp',
  },
  {
    game: GAME_CATEGORY.TABLE_GAMES,
    provider: PROVIDERS_PATH.TABLE,
    name: 'เกมส์โต๊ะ',
    path: '/images/newIcon/icon_table.webp',
  },
  {
    game: GAME_CATEGORY.ARCADE,
    provider: PROVIDERS_PATH.ARCADE,
    name: 'Arcade',
    path: '/images/newIcon/icon_arcade.webp',
  },
  {
    game: GAME_CATEGORY.OTHER,
    provider: PROVIDERS_PATH.OTHER,
    name: 'อื่นๆ',
    path: '/images/newIcon/icon_other.webp',
  },
];

export default function Home({ firstdata }) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const [providers, setProviders] = useState(firstdata.providers);
  const [isLoading, setIsLoading] = useState(true);
  const [activeButton, setActiveButton] = useState('');
  const [providersPath, setProvidersPath] = useState('');
  const [mobile, setMobile] = useState(false);
  const [tablet, setTablet] = useState(false);
  const [desktop, setDesktop] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMobile(isMobile);
    setTablet(isTablet);
    setDesktop(isDesktop);
    setButton(GAME_CATEGORY.SLOT, PROVIDERS_PATH.SLOT);
  }, []);

  const getProvider = async (category, path) => {
    const activeButton = category;
    if (category === GAME_CATEGORY.UFA) category = GAME_CATEGORY.SPORT_BOOK;
    const query = {
      category: category,
    };

    setIsLoading(true);
    await UseProvidersByCategory(query).then((res) => {
      if (res.code === STATUS_CODE.Success) {
        setDataProvider(res, activeButton, path);
      } else {
        message.error(res.cause || res.msg);
      }
    });
  };

  const setDataProvider = async (data, active, path) => {
    if (active === GAME_CATEGORY.UFA) {
      setProviders(await data.providers.filter((item) => item.providerCode === GAME_CATEGORY.UFA));
    } else if (active === GAME_CATEGORY.SPORT_BOOK) {
      setProviders(await data.providers.filter((item) => item.providerCode !== GAME_CATEGORY.UFA));
    } else {
      setProviders(data.providers);
    }
    setButton(active, path);
    setIsLoading(false);
  };

  const setButton = async (active, path) => {
    setActiveButton(active);
    setProvidersPath(path);
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
        console.log('res :', res);
        if (res.code === STATUS_CODE.Success) {
          if (res.gameUrl) {
            window.open(res.gameUrl, '_blank', 'popup');
          }
        } else {
          message.error(res.cause || res.msg);
        }
      });
    }
  };

  if (tablet || desktop) {
    return (
      <>
        <Layout>
          <section style={{ backgroundColor: '#16122d' }}>
            <Wrapper>
              <section>
                <Row gutter={[16, 16]}>
                  <Col md={12} xs={24}>
                    <section className="text-center">
                      <figure className="m-0">
                        <div className="relative text-center">
                          <Image
                            src={'/images/logo/world88_720.webp'}
                            className="object-contain"
                            width={160}
                            height={160}
                            alt="world88"
                            loading="lazy"
                          />
                        </div>
                      </figure>
                      <figcaption className="text-2xl font-semibold font-display">
                        {session ? (
                          <Button
                            key="OK"
                            shape="round"
                            type="primary"
                            className="text-2xl mb-2"
                            size="large"
                          >
                            <Link href={'/slot'}>เล่นเกมส์</Link>
                          </Button>
                        ) : (
                          <Button
                            key="OK"
                            shape="round"
                            type="primary"
                            className="text-2xl mb-2"
                            size="large"
                            href={'/signup'}
                          >
                            สมัครสมาชิก
                          </Button>
                        )}
                        <div>เว็บเดียวจบครบทุกการเดิมพัน</div>
                        <div>ทำรายการด้วยระบบอัตโนมัติ ครบจบในที่เดียว</div>
                      </figcaption>
                    </section>
                  </Col>
                  <Col md={12} xs={24}>
                    <figure>
                      <div className="relative text-center">
                        <Image
                          src={'/images/jinny.png'}
                          className="object-contain"
                          width={300}
                          height={300}
                          alt="world88"
                          loading="lazy"
                        />
                      </div>
                    </figure>
                  </Col>
                </Row>
              </section>
            </Wrapper>
          </section>
          <PromotionCarousel />
          <Wrapper style={{ 'overflow-x': 'hidden' }}>
            <div className="flex">
              <div className="w-1/6 overflow-hidden mt-3">
                {CATEGORY_LIST?.map((item, idx) => (
                  <div key={idx} className="mt-2">
                    <button
                      className={`${styles['category-card']} ${
                        item.game === activeButton ? styles.active : ''
                      } grid grid-cols-2`}
                      onClick={() => {
                        getProvider(item.game, item.provider);
                      }}
                    >
                      <section className="mt-1">
                        <Image
                          src={item.path}
                          width={50}
                          height={50}
                          alt="world88 slot"
                          loading="lazy"
                          className="img-fluid"
                          style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                      </section>
                      <section className="flex flex-col justify-center mt-6 mx-2 text-left whitespace-nowrap">
                        <figcaption className=" text-white text-truncate">{item.name}</figcaption>
                      </section>
                    </button>
                  </div>
                ))}
              </div>
              <div className="w-5/6 overflow-x-hidden ml-5 mr-5">
                <Row className="mt-4">
                  {providers?.map((item, idx) => (
                    <Col
                      key={idx}
                      xs={12}
                      sm={12}
                      md={12}
                      lg={8}
                      xl={4}
                      style={{ maxHeight: '200px' }}
                    >
                      <figure
                        className="provider-card"
                        onClick={async () => {
                          if (session) {
                            if (item.providerCode === 'UFA') {
                              const params = {
                                providerCode: item.providerCode,
                                gameCode: item.providerCode,
                              };
                              await onClickGame(params);
                            } else if (item.providerCode === 'HDG') {
                              const params = {
                                providerCode: item.providerCode,
                                gameCode: 'HDG-LT-1',
                              };
                              await onClickGame(params);
                            } else {
                              router.push(`/${providersPath}/${item.providerCode.toLowerCase()}`);
                            }
                          } else {
                            AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
                          }
                        }}
                      >
                        <section className="w-full h-40 md:h-60 lg:h-60 relative">
                          <Image
                            className="card-image"
                            src={item.image}
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
              </div>
            </div>
          </Wrapper>
          {/* <Wrapper>
            <Row className="mt-4" gutter={{ xs: 8, sm: 16, md: 24 }}>
              {providers?.map((item, idx) => (
                <Col key={idx} className="my-1" xl={4} lg={6} md={8} xs={12}>
                  <figure
                    className="provider-card"
                    onClick={async () => {
                      if (session) {
                        if (item.providerCode === 'UFA') {
                          const params = {
                            providerCode: item.providerCode,
                            gameCode: item.providerCode,
                          };
                          await onClickGame(params);
                        } else if (item.providerCode === 'HDG') {
                          const params = {
                            providerCode: item.providerCode,
                            gameCode: 'HDG-LT-1',
                          };
                          await onClickGame(params);
                        } else {
                          router.push(`/${providersPath}/${item.providerCode.toLowerCase()}`);
                        }
                      } else {
                        AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
                      }
                    }}
                  >
                    <section className="w-full lg:h-40 md:h-60 h-32 relative">
                      <Image
                        className="card-image"
                        src={item.image}
                        alt={idx}
                        width={50}
                        height={50}
                        loading="lazy"
                      />
                    </section>
                    <figcaption className="mt-2">{item.name}</figcaption>
                  </figure>
                </Col>
              ))}
            </Row>
          </Wrapper> */}
        </Layout>
      </>
    );
  } else {
    return (
      <>
        <Layout>
          <section className="mb-2">
            <Wrapper>
              <section>
                <section className="text-center">
                  <figure className="m-0">
                    <div className="relative text-center">
                      <Image
                        src={'/images/logo/world88_720.webp'}
                        className="object-contain"
                        width={160}
                        height={160}
                        alt="world88"
                        loading="lazy"
                      />
                    </div>
                  </figure>
                  <figcaption className="text-xl font-semibold font-display">
                    {session ? (
                      <Button
                        key="OK"
                        shape="round"
                        type="primary"
                        className="text-2xl mb-2"
                        size="large"
                      >
                        <Link href={'/slot'}>เล่นเกมส์</Link>
                      </Button>
                    ) : (
                      <Button
                        key="OK"
                        shape="round"
                        type="primary"
                        className="text-2xl mb-2"
                        size="large"
                        href={'/signup'}
                      >
                        สมัครสมาชิก
                      </Button>
                    )}
                    <div>เว็บเดียวจบครบทุกการเดิมพัน</div>
                    <div className="whitespace-nowrap">
                      ทำรายการด้วยระบบอัตโนมัติ ครบจบในที่เดียว
                    </div>
                  </figcaption>
                </section>
              </section>
            </Wrapper>
          </section>
          <section>
            <PromotionCarousel />
          </section>
          {session ? (
            <section className="mt-1 mb-1">
              <div className="flex items-center justify-between">
                <button
                  className={`${styles['provider-box']} grid grid-cols-2`}
                  onClick={() => {
                    router.push(`/cashback`);
                  }}
                >
                  <section className="mt-1">
                    <Image
                      src={'/images/icon/icon_cashback.png'}
                      width={50}
                      height={50}
                      alt="world88 slot"
                      loading="lazy"
                    />
                  </section>
                  <section className="mt-6 mx-2 text-left whitespace-nowrap">
                    <figcaption className=" text-white">เครดิตเงินคืน</figcaption>
                  </section>
                </button>
                <button
                  className={`${styles['provider-box']} grid grid-cols-2`}
                  onClick={() => {
                    router.push(`/payback`);
                  }}
                >
                  <section className="mt-1">
                    <Image
                      src={'/images/icon/icon_income.png'}
                      width={50}
                      height={50}
                      alt="world88 slot"
                      loading="lazy"
                    />
                  </section>
                  <section className="mt-6 mx-2 text-left whitespace-nowrap">
                    <figcaption className=" text-white">คืนยอดเสีย</figcaption>
                  </section>
                </button>
              </div>
            </section>
          ) : (
            <section className="mb-1" />
          )}
          <session className="max-h-52">
            <div className="flex">
              <div className={`${styles.h} w-1/3 overflow-hidden`}>
                {CATEGORY_LIST?.map((item, idx) => (
                  <div key={idx} className="mt-2">
                    <button
                      className={`${styles['provider-box']} ${
                        item.game === activeButton ? styles.active : ''
                      } grid grid-cols-2`}
                      onClick={() => {
                        getProvider(item.game, item.provider);
                      }}
                    >
                      <section className="mt-1">
                        <Image
                          src={item.path}
                          width={50}
                          height={50}
                          alt="world88 slot"
                          loading="lazy"
                        />
                      </section>
                      <section className="mt-6 mx-2 text-left whitespace-nowrap">
                        <figcaption className=" text-white">{item.name}</figcaption>
                      </section>
                    </button>
                  </div>
                ))}
              </div>
              <div className={`${styles.h} w-2/3 overflow-x-hidden ml-1 mr-1`}>
                <session>
                  <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
                    {providers?.map((item, idx) => (
                      <Col key={idx} xl={4} lg={6} md={8} xs={12}>
                        <figure
                          className="provider-card"
                          onClick={async () => {
                            if (session) {
                              if (item.providerCode === 'UFA') {
                                const params = {
                                  providerCode: item.providerCode,
                                  gameCode: item.providerCode,
                                };
                                await onClickGame(params);
                              } else if (item.providerCode === 'HDG') {
                                const params = {
                                  providerCode: item.providerCode,
                                  gameCode: 'HDG-LT-1',
                                };
                                await onClickGame(params);
                              } else {
                                router.push(`/${providersPath}/${item.providerCode.toLowerCase()}`);
                              }
                            } else {
                              AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
                            }
                          }}
                        >
                          <section className="w-full lg:h-40 md:h-60 h-32 relative">
                            <Image
                              className={`${styles['card-image-mobile']}`}
                              src={item.image}
                              alt={idx}
                              width={50}
                              height={50}
                              loading="lazy"
                            />
                          </section>
                        </figure>
                      </Col>
                    ))}
                  </Row>
                </session>
              </div>
            </div>
          </session>
        </Layout>
      </>
    );
  }
}

export const getServerSideProps = withAuth(async (context) => {
  const query = {
    category: GAME_CATEGORY.SLOT,
  };
  const data = await UseProvidersByCategory(query);

  return {
    props: {
      firstdata: data,
    },
  };
});
