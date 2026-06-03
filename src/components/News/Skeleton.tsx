import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  className?: string;
};

export const Skeleton: FC<PropsType> = ({ className }) => {
  return (
    <div className={classNames('news-card-skeleton', className)}>
      <div className="news-card-skeleton__img" />
      <div className="news-card-skeleton__content">
        <div className="news-card-skeleton__name" />
        <div className="news-card-skeleton__text" />
        <div className="news-card-skeleton__text" />
        <div className="news-card-skeleton__name" />
      </div>
    </div>
  );
};
