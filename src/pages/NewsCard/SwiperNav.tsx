import { FC } from 'react';
import { useSwiper } from 'swiper/react';
import classNames from 'classnames';

import { Icon } from '../../components/ui/Icon';

type PropsType = {
  nav: 'prev' | 'next';
};

export const SwiperNav: FC<PropsType> = ({ nav }) => {
  const swiper = useSwiper();

  const icon = nav === 'prev' ? 'arrow-left2' : 'arrow-right3';

  return (
    <div
      className={classNames('news-card__photo-carousel-arrow', {
        '-prev': nav === 'prev',
        '-next': nav === 'next',
      })}
      onClick={() => (nav === 'prev' ? swiper.slidePrev() : swiper.slideNext())}
    >
      <Icon name={icon} color="rgba(var(--grey-600))" pointer size={1.5} />
    </div>
  );
};
