import { InfinitySpin, ProgressBar } from 'react-loader-spinner';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import styles from './loading.module.scss';

export default function Loading({}) {
  return (
    <>
      <Layout>
        <Wrapper style={{ height: '100%' }}>
          <div className={`flex justify-center items-center ${styles['loading-height']}`}>
            {/* <InfinitySpin width="200" color="#1890ff" /> */}
            <ProgressBar
              height="180"
              width="180"
              ariaLabel="progress-bar-loading"
              wrapperStyle={{}}
              wrapperClass="progress-bar-wrapper"
              borderColor="#F4442E"
              barColor="#51E5FF"
            />
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
