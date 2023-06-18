import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/affiliate.module.scss';
import Image from 'next/image';
import Wrapper from '@/components/wrapper';
import { UseAppContext } from '@/context/AppContext';
import { Button, message, Spin } from 'antd';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import Loading from '@/components/loading';
import { UseCheckAmountOfCashBackAndPayBack, UsePayback } from '@/hook/usePromotion';
import { STATUS_CODE } from '@/lib/constants';
import {
  UseFetchAffiliateInfo,
  UseFetchAffiliateBalance,
  UseGetBalance,
} from '@/hook/useAffiliate';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

export default function Affiliate({}) {
  const AppContext = UseAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [affiliateLoading, setAffiliateLoading] = useState(false);
  const [affiliateButtonLoading, setAffiliateButtonLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [timeFetch, setTimeFetch] = useState('00.00');
  const [linkAffiliate, setLinkAffiliate] = useState('');
  const [description, setDescription] = useState('');
  const [withdrawalRemaining, setWithdrawalRemaining] = useState(0);
  const [amountWithdraw, setAmountWithdraw] = useState(0);
  const [amountWithdrawMin, setAmountWithdrawMin] = useState(0);
  const [amountWithdrawMax, setAmountWithdrawMax] = useState(0);
  const [showLink, setShowLink] = useState(false);

  useEffect(() => {
    const _affiliateInfo = async () => await getAffiliateInfo();
    _affiliateInfo();
  }, []);

  const getAffiliateInfo = async () => {
    await UseFetchAffiliateInfo().then(async (res) => {
      setTimeFetch(res.timestamp);
      if (res.code === STATUS_CODE.Success) {
        setShowLink(true);
        setLinkAffiliate(res.link);
        setDescription(res.description);
        setAmount(res.amount);
        setWithdrawalRemaining(res.withdrawalRemaining);
        setAmountWithdrawMin(res.minWithdraw);
        setAmountWithdrawMax(res.maxWithdraw);
      } else {
        setShowLink(false);
        message.error(res.cause || res.msg);
      }
      setIsLoading(false);
    });
  };

  const fetchAffiliateBalance = async () => {
    setAffiliateLoading(true);
    await UseFetchAffiliateBalance().then(async (res) => {
      setTimeFetch(res.timestamp);
      if (res.code === STATUS_CODE.Success) {
        setAmount(res.amount);
        setWithdrawalRemaining(res.withdrawalRemaining);
        setAmountWithdrawMin(res.minWithdraw);
        setAmountWithdrawMax(res.maxWithdraw);
      } else {
        message.error(res.cause || res.msg);
      }
      setIsLoading(false);
      setTimeout(() => {
        setAffiliateLoading(false);
      }, 1000);
    });
  };

  const getAffiliate = async () => {
    const query = {
      amount: Number(amountWithdraw),
    };
    setAffiliateButtonLoading(true);
    await UseGetBalance(query).then(async (res) => {
      setTimeFetch(res.timestamp);
      if (res.code === STATUS_CODE.Success) {
        await getAffiliateInfo();
        await AppContext.action.getBalance();
        message.success(`รับเครดิตเงิน สำเร็จ!`);
      } else {
        message.error(res.cause || res.msg);
      }
      setIsLoading(false);
      setTimeout(() => {
        setAffiliateButtonLoading(false);
      }, 1000);
    });
  };

  const handleAmountChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      setAmountWithdraw(value);
    }
  };

  const handleAmountBlur = () => {
    if (amountWithdraw >= amountWithdrawMin && amountWithdraw <= amountWithdrawMax) {
      getAffiliate(amountWithdraw);
    } else {
      message.error('ไม่สามารถทำรายการได้');
    }
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(linkAffiliate)
      .then(() => {
        message.success('คัดลอกลิงก์สำเร็จ');
      })
      .catch((error) => {
        message.error(error);
      });
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        <Layout>
          <Wrapper>
            <section className={styles.wrapper}>
              <section className={styles.bg}>
                <div className="text-5xl mb-8 mt-8 text-center">สร้างรายได้</div>
                {showLink && (
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex justify-center ${styles.input} text-black mb-4 rounded-lg border border-gray-300 bg-gray-100 p-4 transition duration-300 hover:scale-105`}
                    >
                      {linkAffiliate}
                    </div>
                    <button className={styles.button} onClick={() => copyLink()}>
                      <span className={`${styles['button_lg']}`}>
                        <span className={`${styles['button_sl']}`}></span>
                        <span className={`${styles['button_text']}`}>คัดลอกลิงก์</span>
                      </span>
                    </button>
                  </div>
                )}
                <section className={styles.box}>
                  <h3>รายได้</h3>
                  <section className="flex justify-center items-center">
                    <div className="w-5 h-5 relative mr-2">
                      <Image
                        src={'/images/icon/icon_bath.png'}
                        alt=""
                        className="object-contain"
                        fill
                        loading="lazy"
                      />
                    </div>
                    <div className="text-4xl">
                      {amount.toLocaleString('th-TH', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    {affiliateLoading ? (
                      <LoadingOutlined className="p-2" style={{ fontSize: '14px' }} />
                    ) : (
                      <RedoOutlined
                        className="pl-2 __pointer"
                        style={{ fontSize: '20px' }}
                        onClick={() => {
                          fetchAffiliateBalance();
                        }}
                      />
                    )}
                  </section>
                  <section className="flex items-center justify-center mt-1">
                    <span className="mr-1">ข้อมูล ณ เวลา</span>
                    <div>{dayjs(timeFetch).format('HH:mm')}</div>
                    <span className="ml-1">น.</span>
                  </section>
                  <div className="mt-5">
                    <label htmlFor="amount">จำนวนเงิน</label>
                    <br />
                    <input
                      className={`${styles.input} text-black ml-4 w-48 mt-5 text-center`}
                      type="number"
                      value={amountWithdraw}
                      onChange={handleAmountChange}
                      disabled={!showLink}
                    />
                  </div>
                  {affiliateButtonLoading ? (
                    <LoadingOutlined className="p-2" style={{ fontSize: '35px' }} />
                  ) : (
                    <Button
                      type="primary mt-6"
                      onClick={() =>
                        withdrawalRemaining > 0
                          ? handleAmountBlur()
                          : message.error('ท่านทำรายการเกินจำนวนเงินหรือจำนวนครั้งที่กำหนด')
                      }
                      disabled={!showLink}
                      style={{ color: 'white' }}
                    >
                      รับเงิน
                    </Button>
                  )}
                </section>
                <ul className="mt-6 text-xl">
                  <li>
                    <span
                      className="text-amber-400"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </li>
                </ul>
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
