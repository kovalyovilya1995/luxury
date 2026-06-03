import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  value: number;
  className?: string;
};

export const Counter: FC<PropsType> = ({ value, className }) => {
  const length = value.toString().length;

  return (
    <div className={classNames('counter', className)} data-length={length}>
      {value}
    </div>
  );
};
