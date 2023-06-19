import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './navigator.module.scss';
import Wrapper from '@/components/wrapper';
import { useRouter } from 'next/router';
import { UseAppContext } from '@/context/AppContext';
import { useSession } from 'next-auth/react';
import { MODAL_HEADER } from '@/lib/constants';
import { TabBar } from 'antd-mobile';
import { Col } from 'antd';
import Link from 'next/link';
import Footer2 from '@/components/navigator';

const BAR_STATE = {
  HOME: 'home',
  PROMOTION: 'promotion',
  CASHBACK: 'cashback',
  PAYBACK: 'payback',
  DW: 'dw',
  SLOT: 'slot',
  AFFILIATE: 'affiliate',
};

export default function Footer({ footerKey }) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const router = useRouter();
  const [activeKey, setActiveKey] = useState(BAR_STATE.HOME);
  // const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const pathname = router.pathname.replace('/', '');
    if (pathname === BAR_STATE.PROMOTION) {
      setActiveKey(pathname);
    } else if (pathname === BAR_STATE.SLOT) {
      setActiveKey(BAR_STATE.SLOT);
    } else if (pathname === BAR_STATE.CASHBACK) {
      setActiveKey(BAR_STATE.CASHBACK);
    } else if (pathname === BAR_STATE.PAYBACK) {
      setActiveKey(BAR_STATE.PAYBACK);
    } else if (pathname === BAR_STATE.AFFILIATE) {
      setActiveKey(BAR_STATE.AFFILIATE);
    } else {
      setActiveKey(BAR_STATE.HOME);
    }
  }, [router]);

  const setRouteActive = (value) => {
    switch (value) {
      case BAR_STATE.HOME:
        setActiveKey(BAR_STATE.HOME);
        router.push('/');
        break;
      case BAR_STATE.PROMOTION:
        if (session) {
          setActiveKey(BAR_STATE.PROMOTION);
          router.push(`/${BAR_STATE.PROMOTION}`);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { redirect: BAR_STATE.PROMOTION }, pathname: router.route });
        }
        break;
      case BAR_STATE.CASHBACK:
        if (session) {
          setActiveKey(BAR_STATE.CASHBACK);
          router.push(`/${BAR_STATE.CASHBACK}`);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { redirect: BAR_STATE.CASHBACK }, pathname: router.route });
        }
        break;
      case BAR_STATE.PAYBACK:
        if (session) {
          setActiveKey(BAR_STATE.PAYBACK);
          router.push(`/${BAR_STATE.PAYBACK}`);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { redirect: BAR_STATE.PAYBACK }, pathname: router.route });
        }
        break;
      case BAR_STATE.DW:
        if (session) {
          AppContext.action.setModalHeaderState(MODAL_HEADER.DEPOSIT_WITHDRAW);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { modal: MODAL_HEADER.DEPOSIT_WITHDRAW }, pathname: router.route });
        }
        break;
      case BAR_STATE.SLOT:
        if (session) {
          setActiveKey(BAR_STATE.SLOT);
          router.push(`/${BAR_STATE.SLOT}`);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { redirect: BAR_STATE.SLOT }, pathname: router.route });
        }
        break;
      case BAR_STATE.AFFILIATE:
        if (session) {
          setActiveKey(BAR_STATE.AFFILIATE);
          router.push(`/${BAR_STATE.AFFILIATE}`);
        } else {
          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
          router.push({ query: { redirect: BAR_STATE.AFFILIATE }, pathname: router.route });
        }
        break;
      default:
        setActiveKey(BAR_STATE.HOME);
        router.push('/');
        break;
    }
  };

  const tabs = [
    {
      key: BAR_STATE.HOME,
      title: 'หน้าหลัก',
      icon: (
        <Image
          src={'/images/logo/world88_720.webp'}
          className="object-contain"
          width={32}
          height={32}
          alt="world88 หน้าหลัก"
          loading="lazy"
        />
      ),
    },
    {
      key: BAR_STATE.PROMOTION,
      title: 'โปรโมชั่น',
      icon: (
        <Image
          src={'/images/icon/icon_promotion.png'}
          width={24}
          height={24}
          alt="world88 promotion"
          loading="lazy"
        />
      ),
    },
    // {
    //   key: BAR_STATE.CASHBACK,
    //   title: 'เครดิตเงินคืน',
    //   icon: (
    //     <Image
    //       src={'/images/icon/icon_cashback.png'}
    //       width={24}
    //       height={24}
    //       alt="world88 cashback เครดิตเงินคืน"
    //     />
    //   ),
    // },
    // {
    //   key: BAR_STATE.PAYBACK,
    //   title: 'คืนยอดเสีย',
    //   icon: (
    //     <Image
    //       src={'/images/icon/icon_income.png'}
    //       width={24}
    //       height={24}
    //       alt="world88 payback คืนยอดเสีย"
    //     />
    //   ),
    // },
    {
      key: BAR_STATE.DW,
      title: 'ฝาก-ถอน',
      icon: (
        <Image
          src={'/images/icon/icon_wallet.png'}
          width={24}
          height={24}
          alt="world88 เติมเงิน กระเป๋าตังค์ กระเป๋าเงิน"
          loading="lazy"
        />
      ),
    },
    {
      key: BAR_STATE.AFFILIATE,
      title: 'สร้างรายได้',
      icon: (
        <Image
          src={'/images/icon/icon_affiliate.png'}
          width={24}
          height={24}
          alt="world88 slot สร้างรายได้"
          loading="lazy"
        />
      ),
    },
  ];

  return (
    <section className={`${styles.wrapper} md:hidden fixed py-4`}>
      <div
        className={styles.tabbar}
        activekey={activeKey}
        onChange={(value) => setRouteActive(value)}
      >
        <div className={styles.indicator}>
          <div className={`${styles.list}`}>
            {tabs.map((item, idx) => (
              <div
                key={idx}
                className={styles.item}
                onClick={async () => {
                  setRouteActive(item.key);
                  <Footer2 footerKey={item.key} />;
                }}
              >
                <div className={`${styles['menu-wrapper']}`}>
                  <div className={`${styles['menu-icon']}`}>
                    <Image
                      src={item.icon.props.src}
                      width={item.icon.props.width}
                      height={item.icon.props.height}
                      alt=""
                      loading="lazy"
                    />
                  </div>
                </div>
                <div>
                  <figcaption
                    className={`${styles['text-title']} ${
                      item.key === activeKey ? styles.active : ''
                    }`}
                  >
                    {item.title}
                  </figcaption>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
