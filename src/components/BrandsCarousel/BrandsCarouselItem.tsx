import { FC } from 'react';
import { useSwiperSlide } from 'swiper/react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';

import { useMedia } from '../../hooks';

import './styles.scss';
import { baseURL } from '../..';

type PropsType = {
  id: number;
  imageId: number;
  title: string;
};

export const BrandsCarouselItem: FC<PropsType> = ({ id, imageId, title }) => {
  const swiperSlide = useSwiperSlide();
  const navigate = useNavigate();
  const isMobile = useMedia('(max-width: 550px)');

  const isVisible = isMobile
    ? swiperSlide.isActive
    : Object.values(swiperSlide).some(Boolean);

  return (
    <div
      className={classNames('brands-carousel-item', {
        'brands-carousel-item_visited': isVisible,
      })}
      onClick={() => navigate(`/brands/${id}`)}
    >
      {imageId && (
        <img
          className="brands-carousel-item__img"
          alt="brand"
          src={`${baseURL}/images/${imageId}`}
        />
      )}
      <div className="brands-carousel-item__name">{title?.toUpperCase()}</div>
    </div>
  );
};
