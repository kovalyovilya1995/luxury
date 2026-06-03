import { FC, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
// @ts-ignore
import ImageZoom from 'react-image-zooom';

import { Icon } from '../../ui/Icon';
import { baseURL } from '../../..';

import './styles.scss';

type PropsType = {
  photos: number[];
  active: number;
  onClose: () => void;
  className?: string;
};

export const ModalPhoto: FC<PropsType> = ({
  className,
  photos,
  active,
  onClose,
}) => {
  const [innerWidth, setInnerWidth] = useState(0);
  const [activePhoto, setActivePhoto] = useState(active);
  const [activeIndex, setActiveIndex] = useState(
    () => photos.findIndex((photo) => photo === active) || 0
  );
  const scroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const callback = () => {
      setInnerWidth(scroll.current?.clientWidth || 0);
    };

    setInnerWidth(scroll.current?.clientWidth || 0);
    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  const handleNext = () => {
    if (!showArrowRight) return;
    const newActiveIndex = activeIndex + 1;

    setActivePhoto(photos[newActiveIndex]);
    setActiveIndex(newActiveIndex);
  };

  const handlePrev = () => {
    if (!showArrowLeft) return;
    const newActiveIndex = activeIndex - 1;

    setActivePhoto(photos[newActiveIndex]);
    setActiveIndex(newActiveIndex);
  };

  const widthLine = innerWidth / photos.length;
  const showArrowRight = activeIndex + 1 < photos.length;
  const showArrowLeft = !!activeIndex;

  return (
    <div className={classNames('modal-photo', className)}>
      <Icon
        name="close2"
        handleClick={onClose}
        className="modal-photo__close"
        color="rgba(var(--grey-600))"
        pointer
        size={2}
      />
      <div className="modal-photo__content">
        {photos.map((photo) => (
          <ImageZoom
            src={`${baseURL}/images/${photo}`}
            key={photo}
            alt="img"
            zoom="150"
            className={classNames('modal-photo__active-img', {
              'modal-photo__active-img_show': activePhoto === photo,
            })}
          />
        ))}
        <div className="modal-photo__scroll-wrapper">
          <div className="modal-photo__scroll" ref={scroll}>
            <div
              className="modal-photo__scroll-item"
              style={{
                width: `${widthLine}px`,
                transform: `translateX(${activeIndex * widthLine}px)`,
              }}
            />
          </div>
          <div className="modal-photo__scroll-label">
            {activeIndex + 1} из {photos.length}
          </div>
        </div>
        <Icon
          name="arrow-right4"
          handleClick={handleNext}
          className={classNames('modal-photo__arrow-right', {
            'modal-photo__arrow-right_show': showArrowRight,
          })}
          color="rgba(var(--grey-600))"
          size={2.5}
        />
        <Icon
          name="arrow-right4"
          handleClick={handlePrev}
          className={classNames('modal-photo__arrow-left', {
            'modal-photo__arrow-left_show': showArrowLeft,
          })}
          color="rgba(var(--grey-600))"
          size={2.5}
        />
      </div>
    </div>
  );
};
