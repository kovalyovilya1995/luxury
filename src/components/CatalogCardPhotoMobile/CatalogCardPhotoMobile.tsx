import { FC, useState, useEffect } from 'react';
import classNames from 'classnames';
import { Swiper, SwiperSlide, SwiperClass } from 'swiper/react';
import { Mousewheel, Navigation } from 'swiper/modules';

import { ModalPhotoMobile } from '../modals/ModalPhotoMobile';
import { Product } from '../../types';
import { baseURL } from '../..';

import './styles.scss';

type PropsType = {
  product: Product;
  className?: string;
};

export const CatalogCardPhotoMobile: FC<PropsType> = ({
  className,
  product,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>();
  const [innerWidth, setInnerWidth] = useState(window.innerWidth);
  useEffect(() => {
    const callback = () => {
      setInnerWidth(window.innerWidth);
    };

    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  const widthLine = (innerWidth - 32) / (product.imageIds?.length ?? 1);

  const handleChangeShowNawButtons = ({ activeIndex }: SwiperClass) => {
    setActiveIndex(activeIndex);
  };

  const showScroll = (product.imageIds?.length ?? 0) > 1;
  const showSlider = !!product.imageIds?.length && product.imageIds?.length > 1;

  return (
    <div className={classNames('catalog-card-photo-mobile', className)}>
      {!!product.imageIds?.length && !!activePhoto && (
        <ModalPhotoMobile
          initialActiveIndex={activeIndex}
          photos={product.imageIds}
          onClose={() => setActivePhoto(null)}
        />
      )}
      {showSlider && (
        <div>
          <Swiper
            slidesPerView={1}
            speed={800}
            slidesOffsetBefore={16}
            slidesOffsetAfter={-16}
            onActiveIndexChange={handleChangeShowNawButtons}
            mousewheel
            modules={[Mousewheel, Navigation]}
          >
            {product.imageIds?.map((photo) => (
              <SwiperSlide key={photo}>
                <img
                  className={classNames('catalog-card-photo-mobile__img')}
                  // src={photo}
                  src={`${baseURL}/images/${photo}`}
                  onClick={() => setActivePhoto(photo)}
                  alt="furniture"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {!showSlider && (
        <div className="flex-center">
          <img
            className={classNames('catalog-card-photo-mobile__img')}
            // src={photo}
            src={`${baseURL}/images/${product.imageId}`}
            onClick={() => setActivePhoto(product.imageId)}
            alt="furniture"
          />
        </div>
      )}
      {showScroll && (
        <div className="catalog-card-photo-mobile__scroll">
          <div
            className="catalog-card-photo-mobile__scroll-item"
            style={{
              width: `${widthLine}px`,
              transform: `translateX(${activeIndex * widthLine}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
};
