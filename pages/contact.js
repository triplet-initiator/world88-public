import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';

export default function Contact({}) {

  return (
    <>
      <Layout>
        <Wrapper>
          <h1 className="h-full text-center">ช่องทางติดต่อเรา</h1>
          <h2 className="h-full text-center">
            สำหรับคุณลูกค้าที่มีข้อสงสัยเกี่ยวกับทางเว็บหรือต้องการสอบถามปัญหาเรา
          </h2>
          <h2 className="h-full text-center text-amber-400">Call Center 24 ชั่วโมง</h2>
          <section className="flex justify-center items-center">
            <a href={'https://qr-official.line.me/gs/M_959xqsra_GW.png'} target="_blank">
              <img
                className="mx-auto mt-10 relative w-full lg:h-320 md:h-400 h-200"
                src={'/images/line/icon_line.jpeg'}
                alt=""
              />
            </a>
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
