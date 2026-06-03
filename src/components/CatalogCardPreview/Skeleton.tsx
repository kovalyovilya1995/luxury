import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  className?: string;
};

export const Skeleton: FC<PropsType> = ({ className }) => {
  return (
    <div className={classNames('catalog-card-preview-skeleton', className)}>
      <div className="catalog-card-preview-skeleton__img" />
      <div className="catalog-card-preview-skeleton__brand" />
      <div className="catalog-card-preview-skeleton__name" />
    </div>
  );
};
