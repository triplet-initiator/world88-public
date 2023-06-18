import { useState, useEffect } from 'react';
import Layout from '@/components/layout';
import styles from '@/styles/payback.module.scss';
import Image from 'next/image';
import { UseAppContext } from '@/context/AppContext';
import { Button, message } from 'antd';
import { LoadingOutlined, RedoOutlined } from '@ant-design/icons';
import Loading from '@/components/loading';
import { UseCheckAmountOfCashBackAndPayBack, UsePayback } from '@/hook/usePromotion';
import { STATUS_CODE } from '@/lib/constants';
import dayjs from 'dayjs';

export default function Payback({}) {
  const AppContext = UseAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [cashbackLoading, setCashbackLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [timeFetch, setTimeFetch] = useState('00.00')

  useEffect(() => {
    const _fetchAmountOfCashback = async () => await fetchAmountOfCashback();
    _fetchAmountOfCashback();
  }, []);

  const fetchAmountOfCashback = async () => {
    const query = {
      type: 'PAYBACK',
    };

    setCashbackLoading(true);
    await UseCheckAmountOfCashBackAndPayBack(query).then((res) => {
      setTimeFetch(res.timestamp)
      if (res.code === STATUS_CODE.Success) {
        setAmount(res.amount);
      } else {
        setAmount(0);
      }
      setIsLoading(false);
      setTimeout(() => {
        setCashbackLoading(false);
      }, 1000);
    });
  };

  const getPayback = async () => {
    await UsePayback().then(async (res) => {
      if (res.code === STATUS_CODE.Success) {
        await fetchAmountOfCashback();
        await AppContext.action.getBalance();
        message.success(`รับเครดิตคืนยอดเสีย จำนวน ${res.totalAmount} บาท สำเร็จ!`);
      } else {
        message.error(res.cause || res.msg);
      }
    });
  };

  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        <Layout>
          {/* <Wrapper> */}
          <section className={styles.wrapper}>
            <section className={styles.bg}>
              <div className="text-5xl mb-8">คืนยอดเสีย</div>
              <section className={styles.box}>
                <h3>จำนวนเงิน</h3>
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
                  {cashbackLoading ? (
                    <LoadingOutlined className="p-2" style={{ fontSize: '14px' }} />
                  ) : (
                    <RedoOutlined
                      className="pl-2 __pointer"
                      style={{ fontSize: '20px' }}
                      onClick={() => {
                        fetchAmountOfCashback();
                      }}
                    />
                  )}
                </section>
                <section className="flex items-center justify-center mt-1">
                  <span className="mr-1">ข้อมูล ณ เวลา</span>
                  <div>{dayjs(timeFetch).format('HH:mm')}</div>
                  <span className="ml-1">น.</span>
                </section>
                <Button type="primary mt-6" onClick={() => getPayback()}>
                  รับเงิน
                </Button>
              </section>
              <ul className="mt-6 text-xl">
                <li>
                  <span className="text-amber-400">
                    * คืนยอดเสีย จะเริ่มตัดยอดใหม่ทุกวันเวลา 00:00 น.
                  </span>
                </li>
                <li>
                  <span className="text-amber-400">
                    * ยอดเงินที่แสดงจะเป็นยอดที่คิดจากยอดเสียของเมื่อวาน
                  </span>
                </li>
                <li>
                  <span className="text-amber-400">
                    * หากได้รับโปรโมชั่นแล้ว จะไม่สามารถรับได้อีกในวันนั้น
                  </span>
                </li>
                <li>
                  <span className="text-amber-400">* หากเกิดปัญหาการใช้งานกรุณาแจ้งแอดมิน</span>
                </li>
              </ul>
            </section>
          </section>
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
