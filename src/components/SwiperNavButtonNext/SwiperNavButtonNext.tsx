import { FC } from 'react';
import { useSwiper } from 'swiper/react';

export const SwiperNavButtonNext: FC = () => {
  const swiper = useSwiper();

  return (
    <img
      className="swiper-nav-button swiper-nav-button_next"
      onClick={() => swiper.slideNext()}
      alt="next"
      src="/nav-next.svg"
    />
  );
};
