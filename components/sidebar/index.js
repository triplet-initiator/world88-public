/* eslint-disable react-hooks/exhaustive-deps */
import styles from './sidebar.module.scss';
import { UseAppContext } from '@/context/AppContext';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSession } from 'next-auth/react';

import { useRouter } from 'next/router';
import { isMobile } from 'react-device-detect';
import Image from 'next/image';
import Link from 'next/link';

import { DoubleLeftOutlined, DoubleRightOutlined } from '@ant-design/icons';
import { Divider, Menu, Button, Typography } from 'antd';
import { menus, marketingMenus, contactMenus } from '@/lib/data';

export default function Sidebar({}) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const { asPath } = useRouter();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(AppContext.state.isSidebarActive);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    setCollapsed(!AppContext.state.isSidebarActive);
  }, [AppContext.state.isSidebarActive]);

  useEffect(() => {
    AppContext.action.setKeyPath(router.pathname.replace(/\//g, ''));
  }, [router]);

  return (
    <>
      {/* <Profile isSideBar /> */}
      <aside
        className={`${styles.sidebar} ${
          AppContext.state.isSidebarActive ? styles.active : styles.inactive
        }`}
      >
        <section
          className={`${styles['side-header']} ${
            AppContext.state.isSidebarActive ? styles.active : styles.inactive
          } hidden lg:flex`}
        >
          <section
            className={`${styles['expand-icon']} ${
              AppContext.state.isSidebarActive ? styles.active : styles.inactive
            }`}
            onClick={() => {
              AppContext.action.toggleSidebar();
              toggleCollapsed();
            }}
          >
            <Button
              type="primary"
              icon={
                AppContext.state.isSidebarActive ? <DoubleLeftOutlined /> : <DoubleRightOutlined />
              }
            />
          </section>
          {AppContext.state.isSidebarActive && (
            <>
              <section className={styles.content}>
                <Link href={'/slot'}>
                  <div className="flex items-center gap-x-2 __pointer">
                    <Image
                      className="object-contain"
                      src={'/images/slot/pgsoft.svg'}
                      width={24}
                      height={24}
                      alt="pgsoft"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <Link href={'/slot'}>
                  <div className="flex items-center gap-x-2 __pointer">
                    <Image
                      className="object-contain"
                      src={'/images/slot/joker.svg'}
                      width={24}
                      height={24}
                      alt="pgsoft"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <Link href={'/lotto'}>
                  <div className="flex items-center gap-x-2 __pointer">
                    <Image
                      className="object-contain"
                      src={'/images/provider/huay_dragon.png'}
                      width={24}
                      height={24}
                      alt="wildtech huay dragon หวย"
                      loading="lazy"
                    />
                  </div>
                </Link>
              </section>
            </>
          )}
        </section>
        <section className={AppContext.state.isSidebarActive ? '' : 'hidden md:block'}>
          <Menu
            key={'category'}
            mode="inline"
            theme="dark"
            inlineCollapsed={!AppContext.state.isSidebarActive}
            selectedKeys={AppContext.state.keyPath}
            items={menus}
            onClick={(info) => {
              if (isMobile) {
                AppContext.action.toggleSidebar();
              }
              router.push(`/${info.key}`);
            }}
          />
          <section className="mx-auto w-11/12">
            <Divider style={{ borderColor: '#46398E' }} />
          </section>
          <Menu
            key={'marketing'}
            mode="inline"
            theme="dark"
            inlineCollapsed={!AppContext.state.isSidebarActive}
            selectedKeys={AppContext.state.keyPath}
            items={marketingMenus}
            onClick={(info) => {
              if (isMobile) {
                AppContext.action.toggleSidebar();
              }
              router.push(`/${info.key}`);
            }}
          />
          <section className="mx-auto w-11/12">
            <Divider style={{ borderColor: '#46398E' }} />
          </section>
          <Menu
            key={'contact'}
            mode="inline"
            theme="dark"
            inlineCollapsed={!AppContext.state.isSidebarActive}
            selectedKeys={AppContext.state.keyPath}
            items={contactMenus}
            onClick={(info) => {
              if (isMobile) {
                AppContext.action.toggleSidebar();
              }
              router.push(`/${info.key}`);
            }}
          />
        </section>
      </aside>
    </>
  );
}
