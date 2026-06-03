import { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Mousewheel, Navigation, Zoom } from 'swiper/modules';
import 'swiper/css/zoom';

import { baseURL } from '../../..';
import { Icon } from '../../ui/Icon';

import './styles.scss';

type PropsType = {
  photos: number[];
  initialActiveIndex: number;
  onClose: () => void;
  className?: string;
};

export const ModalPhotoMobile: FC<PropsType> = ({
  className,
  photos,
  initialActiveIndex,
  onClose,
}) => {
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const callback = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  const handleChangeShowNawButtons = ({ activeIndex }: SwiperClass) => {
    setActiveIndex(activeIndex);
  };

  const widthLine = (innerWidth - 32) / photos.length;

  return (
    <div className={classNames('modal-photo-mobile', className)}>
      <Icon
        name="close2"
        handleClick={onClose}
        className="modal-photo-mobile__close"
        color="rgba(var(--grey-800))"
        size={1.5}
      />
      <div className="modal-photo-mobile__content">
        <Swiper
          slidesPerView={1}
          speed={800}
          zoom
          onActiveIndexChange={handleChangeShowNawButtons}
          initialSlide={activeIndex}
          mousewheel
          modules={[Zoom, Navigation, Mousewheel]}
        >
          {photos.map((photo) => (
            <SwiperSlide key={photo}>
              <div className="swiper-zoom-container">
                <img
                  className={classNames('modal-photo-mobile__img')}
                  // src={photo}
                  src={`${baseURL}/images/${photo}`}
                  alt="furniture"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="modal-photo-mobile__scroll">
          <div
            className="modal-photo-mobile__scroll-item"
            style={{
              width: `${widthLine}px`,
              transform: `translateX(${activeIndex * widthLine}px)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};
