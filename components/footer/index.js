import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './footer.module.scss';
import Wrapper from '@/components/wrapper';
import { useRouter } from 'next/router';
import { UseAppContext } from '@/context/AppContext';
import { Row, Col, Divider, FloatButton, message } from 'antd';
import { UseGetLineId } from '@/hook/useUser';
import Icon, { CustomerServiceOutlined, LeftOutlined } from '@ant-design/icons';
import { STATUS_CODE } from '@/lib/constants';

const LineSvg = () => (
  <svg
    t="1678485645145"
    className="icon"
    viewBox="0 0 1024 1024"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    p-id="2751"
    width="32"
    height="32"
  >
    <path
      d="M608.20001 408.4v142.2c0 3.6-2.8 6.4-6.4 6.4h-22.8c-2.2 0-4.2-1.2-5.2-2.6l-65.2-88v84.4c0 3.6-2.8 6.4-6.4 6.4h-22.8c-3.6 0-6.4-2.8-6.4-6.4v-142.2c0-3.6 2.8-6.4 6.4-6.4H502.00001c2 0 4.2 1 5.2 2.8l65.2 88v-84.4c0-3.6 2.8-6.4 6.4-6.4h22.8c3.6-0.2 6.6 2.8 6.6 6.2z m-164-6.4h-22.8c-3.6 0-6.4 2.8-6.4 6.4v142.2c0 3.6 2.8 6.4 6.4 6.4h22.8c3.6 0 6.4-2.8 6.4-6.4v-142.2c0-3.4-2.8-6.4-6.4-6.4z m-55 119.2h-62.2v-112.8c0-3.6-2.8-6.4-6.4-6.4h-22.8c-3.6 0-6.4 2.8-6.4 6.4v142.2c0 1.8 0.6 3.2 1.8 4.4 1.2 1 2.6 1.8 4.4 1.8h91.4c3.6 0 6.4-2.8 6.4-6.4v-22.8c0-3.4-2.8-6.4-6.2-6.4zM728.20001 402h-91.4c-3.4 0-6.4 2.8-6.4 6.4v142.2c0 3.4 2.8 6.4 6.4 6.4h91.4c3.6 0 6.4-2.8 6.4-6.4v-22.8c0-3.6-2.8-6.4-6.4-6.4H666.00001v-24h62.2c3.6 0 6.4-2.8 6.4-6.4V468c0-3.6-2.8-6.4-6.4-6.4H666.00001v-24h62.2c3.6 0 6.4-2.8 6.4-6.4v-22.8c-0.2-3.4-3-6.4-6.4-6.4zM960.00001 227.4V798c-0.2 89.6-73.6 162.2-163.4 162H226.00001c-89.6-0.2-162.2-73.8-162-163.4V226c0.2-89.6 73.8-162.2 163.4-162H798.00001c89.6 0.2 162.2 73.6 162 163.4z m-123.2 245.2c0-146-146.4-264.8-326.2-264.8-179.8 0-326.2 118.8-326.2 264.8 0 130.8 116 240.4 272.8 261.2 38.2 8.2 33.8 22.2 25.2 73.6-1.4 8.2-6.6 32.2 28.2 17.6 34.8-14.6 187.8-110.6 256.4-189.4 47.2-52 69.8-104.6 69.8-163z"
      fill="#03c100"
      p-id="2752"
    ></path>
  </svg>
);

export default function Footer({}) {
  const AppContext = UseAppContext();
  const router = useRouter();
  const [categoryPath, setCategoryPath] = useState('');
  const [lineId, setLineId] = useState('');

  useEffect(() => {
    const _getLineId = async () => await getLineId();
    _getLineId();
  }, []);

  useEffect(() => {
    const _path = router.asPath.split('/');
    if (['slot', 'casino', 'sport', 'lotto'].includes(_path[1]) && _path.length >= 3) {
      setCategoryPath(_path[1]);
    } else {
      setCategoryPath('');
    }
  }, [router]);

  const getLineId = async () => {
    await UseGetLineId().then((res) => {
      if (res.code === STATUS_CODE.Success) {
        setLineId(res?.lineId);
      } else {
        message.error(res.cause || res.msg);
      }
    });
  };

  return (
    <section
      className={`${styles.footer} ${
        AppContext.state.isSidebarActive ? styles.active : styles.inactive
      }`}
    >
      <FloatButton.Group
        shape="circle"
        className="bottom-[100px] md:bottom-16 right-[16px] md:right-10"
      >
        <FloatButton.BackTop tooltip={<div>กลับไปด้านบน</div>} className="back-top" />
        {categoryPath && (
          <FloatButton
            tooltip={<div>กลับไปที่หน้า {categoryPath}</div>}
            onClick={() => {
              router.push(`/${categoryPath}`);
            }}
            icon={<LeftOutlined />}
          />
        )}
        <FloatButton
          icon={<Icon component={LineSvg} />}
          tooltip={<div>ติดต่อเรา</div>}
          href={lineId}
          target="_blank"
          className="line-float"
        />
      </FloatButton.Group>
      <Wrapper style={{ overflow: 'hidden' }}>
        <Divider style={{ backgroundColor: '#46388e' }} />
        <Row gutter={{ xs: 8, sm: 16, md: 24 }}>
          <Col lg={12} xs={24}>
            <section className="relative text-center">
              <Image
                src={'/images/logo/world88_720.webp'}
                alt="world88.com"
                style={{ objectFit: 'contain' }}
                width="200"
                height="200"
                className="cursor-pointer"
                loading="lazy"
                onClick={() => {
                  router.push('/');
                }}
              />
            </section>
          </Col>
          <Col lg={12} xs={24} className="flex justify-center items-center flex-col">
            <section className="text-4xl text-center" style={{ color: '#FEDC57' }}>
              World88 ศูนย์รวมเว็บพนันออนไลน์ทุกชนิด
            </section>
            <section className="text-2xl mt-4 text-center" style={{ color: '#A39EBC' }}>
              <div>ฝาก-ถอนด้วยระบบออโต้ ทำรายการไม่กี่วินาที พร้อมรูปแบบการเล่นง่าย</div>
              <div>
                สมัครง่ายในไม่กี่ขั้นตอนบริการด้วยระบบออนไลน์มาตรฐานสากล เท่าไหร่ก็จ่าย
                ไม่มีลิมิตต่อวัน
              </div>
            </section>
          </Col>
        </Row>
        <Divider style={{ backgroundColor: '#46388e' }} />
        <section className="text-center text-2xl mb-4">
          COPYRIGHT©2022, WWW.WORLD88.COM ALL RIGHTS RESERVED.
        </section>
      </Wrapper>
    </section>
  );
}
