import { FC } from 'react';
import dayjs from 'dayjs';
import classNames from 'classnames';

import { isOldSafari } from '../../utils/isOldSafari';
import { ButtonMore } from '../ui/ButtonMore';

import './styles.scss';
import { baseURL } from '../..';

type PropsType = {
  id: number;
  imageId: number;
  titleRu: string;
  descriptionRus: string;
  newsDate: string;
  onClickCard?: () => void;
  className?: string;
};

export const Card: FC<PropsType> = ({
  imageId,
  titleRu,
  descriptionRus,
  newsDate,
  onClickCard,
  className,
}) => {
  return (
    <div
      className={classNames('card', className)}
      onClick={() => onClickCard?.()}
    >
      {imageId && (
        <img
          className="card__img"
          alt="news"
          src={`${baseURL}/images/${imageId}`}
        />
      )}
      <div className="card__content">
        <div>
          <div className="card__content-date">
            {dayjs(newsDate).format('D MMMM YYYY')}
          </div>
          <div
            className={classNames('card__content-title', {
              'card__content-title_vertical': !isOldSafari(),
            })}
          >
            {titleRu}
          </div>
        </div>
        <ButtonMore />
      </div>
    </div>
  );
};
