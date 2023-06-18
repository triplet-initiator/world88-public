import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { UseGetBalance } from '@/hook/useUser';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import styles from '@/styles/cashback.module.scss';
import Image from 'next/image';
import { UseAppContext } from '@/context/AppContext';
import { withAuth, setupLogOutUrl } from '@/helper/withAuth';
import { Divider, Typography, Button, message } from 'antd';
import {
  VerticalAlignBottomOutlined,
  VerticalAlignTopOutlined,
  CopyOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CloseOutlined,
  LoadingOutlined,
  RedoOutlined,
} from '@ant-design/icons';
import Loading from '@/components/loading';
import { UseCheckAmountOfCashBackAndPayBack, UseCashback } from '@/hook/usePromotion';
import { STATUS_CODE } from '@/lib/constants';
import dayjs from 'dayjs';

export default function Cashback({ }) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const router = useRouter();
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
      type: 'CASHBACK',
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

  const getCashBack = async () => {
    await UseCashback().then(async (res) => {
      if (res.code === STATUS_CODE.Success) {
        await fetchAmountOfCashback();
        await AppContext.action.getBalance();
        message.success(`รับเครดิตเงินคืน จำนวน ${res.totalAmount} บาท สำเร็จ!`);
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
              <div className="text-5xl mb-8">เครดิตเงินคืน</div>
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
                    {' '}
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
                <Button type="primary mt-6" onClick={() => getCashBack()}>
                  รับเครดิต
                </Button>
              </section>
              <ul className="mt-6 text-xl">
                <li>
                  <span className="text-amber-400">
                    * เครดิตเงินคืน จะเริ่มนับใหม่ทุกวันเวลา 00:00 น.
                  </span>
                </li>
                <li>
                  <span className="text-amber-400">
                    * รับได้วันละ 1 ครั้ง
                  </span>
                </li>
                <li>
                  <span className="text-amber-400">* เงินคืนสูงสุดไม่เกิน 500 บาท (ยอดฝาก 10,000 บาท)</span>
                </li>
                <li>
                  <span className="text-amber-400">* ลูกค้าต้องทำเทริน 5 เท่าจากยอดที่รับถึงจะถอนได้</span>
                </li>
                <li>
                  <span className="text-amber-400">* ถอนได้ไม่จำกัด แต่ต้องถอนออกให้หมด ถ้าถอนไม่หมดยอดเงินคงเหลือจะเหลือ 0 ทันที</span>
                </li>
                <li>
                  <span className="text-amber-400">* เมื่อลูกค้ารับคืนยอดฝากแล้วลูกค้าจะติดโปรโมชั่น</span>
                </li>
                <li>
                  <span className="text-amber-400">* หากต้องการยกเลิกโปรโมชั่นกรุณาติดต่อแอดมิน หรือรอหลังเที่ยงคืน (ต้องเล่นยอดที่รับมาให้หมด)</span>
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
