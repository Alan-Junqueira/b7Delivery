import React from 'react';
import styles from './styles.module.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper';
import 'swiper/css';

const Banner = () => {
  return (
    <div className={styles.container}>
      <Swiper
        slidesPerView={1}
        className={styles.swiper}
        loop={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false
        }}
        modules={[Autoplay]}
      >
        <SwiperSlide className={styles.slide}>
          <img src="/assets/banner1.png" alt="" />
        </SwiperSlide>
        <SwiperSlide className={styles.slide}>
          <img src="/assets/banner2.png" alt="" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Banner;
