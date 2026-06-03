import { FC, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel, Navigation, Autoplay } from 'swiper/modules';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-spinner-material';

import { getBrands } from '../../store/actionCreator';
import type { RootState } from '../../store';
import { SwiperNavButtonPrev } from '../SwiperNavButtonPrev';
import { SwiperNavButtonNext } from '../SwiperNavButtonNext';
import { BrandsCarouselItem } from './BrandsCarouselItem';
import { breakpoints } from './constants';

import 'swiper/css';
import 'swiper/css/navigation';
import './styles.scss';

type PropsType = {};

export const BrandsCarousel: FC<PropsType> = () => {
  const {
    data: brands,
    isLoading,
    isError,
  } = useSelector((state: RootState) => state.general.brands);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!brands.length) {
      getBrands(dispatch);
    }
  }, [dispatch, brands.length]);

  const slides = [...brands, ...brands];

  if (isError) {
    return;
  }

  if (isLoading) {
    return (
      <Spinner
        radius={50}
        stroke={2}
        color="rgba(var(--orange))"
        className="brands-carousel-swiper__spinner"
      />
    );
  }

  return (
    <Swiper
      slidesPerView={4}
      spaceBetween={24}
      centeredSlides
      initialSlide={2}
      speed={800}
      loop
      mousewheel
      autoplay={{
        delay: 4000,
        disableOnInteraction: false,
      }}
      breakpoints={breakpoints}
      modules={[Mousewheel, Navigation, Autoplay]}
      className="brands-carousel-swiper"
    >
      {slides.map((item, index) => (
        <SwiperSlide key={item.title + index}>
          <BrandsCarouselItem {...item} />
        </SwiperSlide>
      ))}
      <SwiperNavButtonPrev />
      <SwiperNavButtonNext />
    </Swiper>
  );
};
