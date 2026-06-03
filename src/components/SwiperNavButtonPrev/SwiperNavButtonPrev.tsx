import { FC } from 'react';
import { useSwiper } from 'swiper/react';

export const SwiperNavButtonPrev: FC = () => {
  const swiper = useSwiper();

  return (
    <img
      className="swiper-nav-button swiper-nav-button_prev"
      onClick={() => swiper.slidePrev()}
      alt="prev"
      src="/nav-prev.svg"
    />
  );
};
