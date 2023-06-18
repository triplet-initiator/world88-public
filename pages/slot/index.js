import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/layout';
import Wrapper from '@/components/wrapper';
import Image from 'next/image';
import { UseAppContext } from '@/context/AppContext';
import { Col, Row } from 'antd';
import { MODAL_HEADER, GAME_CATEGORY } from '@/lib/constants';
import { UseProvidersByCategory } from '@/hook/useProvider';
import Loading from '@/components/loading';
import Category from '@/components/category';

export default function Slot({}) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const router = useRouter();

  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProvider();
  }, []);

  const getProvider = async () => {
    const query = {
      category: GAME_CATEGORY.SLOT,
    };

    setIsLoading(true);
    await UseProvidersByCategory(query).then((res) => {
      setProviders(res.providers);
      setIsLoading(false);
    });
  };
  if (isLoading) {
    return <Loading />;
  } else {
    return (
      <>
        <Layout>
          <Category activeKey={'slot'} />
          <Wrapper>
            <section className="mt-4">
              <Row>
                {providers?.map((item, idx) => (
                  <Col key={idx} className="my-4" xs={12} sm={12} md={8} lg={8} xl={6}>
                    <figure
                      className="provider-card"
                      onClick={() => {
                        if (session) {
                          router.push(`/slot/${item.providerCode.toLowerCase()}`);
                        } else {
                          AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
                        }
                      }}
                    >
                      <section className="w-full h-40 md:h-60 lg:h-60 relative">
                        <img
                          src={item.image}
                          className="card-image"
                          alt={idx}
                          width={100}
                          height={100}
                          loading="lazy"
                        />
                      </section>
                    </figure>
                  </Col>
                ))}
              </Row>
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
