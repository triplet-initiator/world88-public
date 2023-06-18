import dayjs from 'dayjs';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import styles from '@/styles/promotion.module.scss';
import { UseAppContext } from '@/context/AppContext';
import { withAuth, setupLogOutUrl } from '@/helper/withAuth';
import { Typography, Button, message } from 'antd';
import { UseFetchPromotion, UseGetPromotion } from '@/hook/usePromotion';
import Loading from '@/components/loading';
import { STATUS_CODE, PROMOTION_TPYE } from '@/lib/constants';

export default function Promotion({}) {
  const AppContext = UseAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [isButtonLoadding, setIsButtonLoadding] = useState(false);
  const [promotion, setPromotion] = useState([]);

  useEffect(() => {
    fetchPromotion();
  }, []);

  const fetchPromotion = async () => {
    const query = {
      type: 'PROMOTION',
    };

    setIsLoading(true);
    await UseFetchPromotion(query).then((res) => {
      setPromotion(res.promotion);
      setIsLoading(false);
    });
  };

  const setPromotionCategory = (category) => {
    let _category = 'ฟรีเครดิต';
    if (category === PROMOTION_TPYE.FIRST_DEPOSIT) _category = 'ฝากแรกของวัน';
    if (category === PROMOTION_TPYE.NEW_REGISTER) _category = 'สมาชิกใหม่';
    return _category;
  };

  const setWithdrawType = (type) => {
    let _type = 'เทิร์นโอเวอร์';
    if (type == 'WINLOSE') _type = 'แพ้ชนะ';
    return _type;
  };

  const receivePromotion = async (data) => {
    const params = {
      _id: data._id,
    };
    setIsButtonLoadding(true);
    await UseGetPromotion(params).then((res) => {
      if (res.code === STATUS_CODE.Success) {
        if (res.totalAmount) {
          message.success(`ได้รับแคชแบ็คจำนวน ${res.totalAmount} บาท`);
          AppContext.action.getBalance();
        } else {
          message.success(`รับโปรโมชั่นแล้ว กรุณาเติมเงิน`);
        }
      } else {
        message.error(res.msg);
      }
      setTimeout(() => {
        setIsButtonLoadding(false);
      }, 2000);
    });
  };

  if (isButtonLoadding) {
  }

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        <Layout>
          <Wrapper>
            <ul className="mt-6 text-xl">
              <li>
                <span className="text-amber-400">* ต้องกดรับโปรโมชั่นก่อนฝากเงินเท่านั้น!!!</span>
              </li>
              <li>
                <span className="text-amber-400">* หากได้รับโปรโมชั่นแล้ว โปรโมชั่นจะหายไป</span>
              </li>
              <li>
                <span className="text-amber-400">
                  * โปรโมชั่นรายวัน จะเริ่มนับใหม่ทุกวันเวลา 00:00 น.
                </span>
              </li>
              <li>
                <span className="text-amber-400">* หากเกิดปัญหาการใช้งานกรุณาแจ้งแอดมิน</span>
              </li>
            </ul>
            {promotion?.length ? (
              <section className="grid grid-cols-1 md:grid-cols-2">
                {promotion?.map((item, idx) => (
                  <div key={idx} className="">
                    <div className={`${styles['article-container']} mx-2 my-2`}>
                      <article className={`${styles['article-card']}`}>
                        <figure className={`${styles['article-image']}`}>
                          <img src={item.bannerUrl} alt="Promotion Image" />
                        </figure>
                        <div className={`${styles['article-content']}`}>
                          <h3 className={`${styles['title']} text-sky-800`}>{item.name}</h3>
                          <section className="mt-3">
                            <div className="text-2xl text-sky-800">
                              ระยะเวลาโปรโมชั่น:{' '}
                              {item.isUnlimited ? (
                                <span>ไม่มีกำหนด</span>
                              ) : (
                                <span>
                                  {dayjs(item.dateId.start).format('DD/MM/YYYY')} ถึง{' '}
                                  {dayjs(item.dateId.end).format('DD/MM/YYYY')}
                                </span>
                              )}
                            </div>
                          </section>
                          <section>
                            <div className="text-2xl text-sky-800">
                              ประเภท: {setPromotionCategory(item.type)}
                            </div>
                          </section>
                          <section>
                            <div className="text-xl text-sky-800">
                              เงื่อนไขการถอน: {setWithdrawType(item.withdrawCondition.typeWithdraw)}{' '}
                              จำนวน {item.withdrawCondition.amountMultiply} เท่า
                            </div>
                          </section>
                          <section className="mt-3 text-sky-800">
                            <div className="text-xl">รายละเอียดเพิ่มเติม:</div>
                            <article
                              dangerouslySetInnerHTML={{ __html: item.description || '-' }}
                            />
                          </section>
                          <section className="text-right">
                            {item.type !== PROMOTION_TPYE.CUSTOM ? (
                              <Button
                                type="primary"
                                loading={isButtonLoadding}
                                onClick={async () => {
                                  await receivePromotion(item);
                                }}
                              >
                                รับโปรโมชั่น
                              </Button>
                            ) : (
                              ''
                            )}
                          </section>
                        </div>
                      </article>
                    </div>
                  </div>
                ))}
              </section>
            ) : (
              <Wrapper>
                <h1 className="h-full text-center">ไม่มีโปรโมชั่นในขณะนี้</h1>
              </Wrapper>
            )}
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
