import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './category.module.scss';
import Wrapper from '@/components/wrapper';
import { useRouter } from 'next/router';
import { UseAppContext } from '@/context/AppContext';
import { Row, Col} from 'antd';
import Link from 'next/link';
import { menus } from '@/lib/data';

export default function Category({ activeKey }) {
  const AppContext = UseAppContext();
  const router = useRouter();
  const [categoryPath, setCategoryPath] = useState('');
  const [lineId, setLineId] = useState('');

  useEffect(() => {}, []);

  return (
    <section>
      <Wrapper>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {menus.map((item, idx) => {
            return (
              <Col className="my-1" xl={3} lg={6} md={6} xs={6} key={idx}>
                <Link href={`/${item.key}`}>
                  <section
                    className={`${styles['category-card']} ${
                      item.key === activeKey ? styles.active : ''
                    }`}
                  >
                    <img
                      src={item.icon.props.children.props.src}
                      width={32}
                      height={32}
                      alt={item.icon.props.children.props.alt}
                      loading="lazy"
                    />
                    <figcaption className="text-sm font-semibold text-white ml-1 font-display">
                      {item.label}
                    </figcaption>
                  </section>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Wrapper>
    </section>
  );
}
