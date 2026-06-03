import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  value: boolean;
  onChange: (value: boolean) => void;
  className?: string;
};

export const Switcher: FC<PropsType> = ({ className, value, onChange }) => {
  return (
    <div
      className={classNames('switcher', className)}
      onClick={() => onChange(!value)}
    >
      <input type="checkbox" checked={value} readOnly />
      <span className="switcher__ball" />
    </div>
  );
};
