import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { UseAppContext } from '@/context/AppContext';
import { MODAL_HEADER } from '@/lib/constants';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// import required modules
import { Pagination, Autoplay } from 'swiper';

const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};

export default function PromotionCarousel({}) {
  const AppContext = UseAppContext();
  const { data: session } = useSession();
  const router = useRouter();
  return (
    <>
      <section style={{ backgroundColor: '#0a0136' }}>
        <Swiper
          pagination={true}
          modules={[Pagination, Autoplay]}
          className="mySwiper"
          slidesPerView={1}
          spaceBetween={10}
          onClick={(swiper) => {
            if (session) {
              if (swiper.clickedIndex === 0) {
                router.push('/affiliate');
              } else if (swiper.clickedIndex === 1) {
                router.push('/payback');
              } else {
                router.push('/promotion');
              }
            } else {
              AppContext.action.setModalHeaderState(MODAL_HEADER.LOGIN);
            }
            // console.log('swiper :', swiper);
          }}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 20,
            },
            // 768: {
            //   slidesPerView: 3,
            //   spaceBetween: 30,
            // },
            1024: {
              slidesPerView: 3,
              spaceBetween: 30,
            },
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
        >
          <SwiperSlide>
            <div className="w-full md:h-80 h-48 relative cursor-pointer">
              <img
                src={'/images/promotion/affliate_commission.png'}
                style={{ objectFit: 'contain' }}
                fill
                sizes="100%"
                alt="test"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full md:h-80 h-56 relative cursor-pointer">
              <img
                src={'/images/promotion/cashback_winlose.png'}
                style={{ objectFit: 'contain' }}
                fill
                sizes="100%"
                alt="test"
                priority
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full md:h-80 h-56 relative cursor-pointer">
              <img
                src={'/images/promotion/daily_bonus.png'}
                style={{ objectFit: 'contain' }}
                fill
                sizes="100%"
                alt="test"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="w-full md:h-80 h-56 relative cursor-pointer">
              <img
                src={'/images/promotion/new_register_bonus.png'}
                style={{ objectFit: 'contain' }}
                fill
                sizes="100%"
                alt="test"
                loading="lazy"
              />
            </div>
          </SwiperSlide>
        </Swiper>
      </section>
    </>
  );
}
