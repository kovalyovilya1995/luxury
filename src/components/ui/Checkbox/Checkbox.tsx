import { FC, useMemo } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  value: boolean;
  label: string;
  onChange: (value: boolean) => void;
  isToLower?: boolean;
  className?: string;
};

const CUSTOM_COLOR_MAP: Record<string, string> = {
  Желтый: 'checkbox-yellow',
  Коричневый: 'checkbox-brown',
  Красный: 'checkbox-red',
  Оранжевый: 'checkbox-orange',
  Зеленый: 'checkbox-green',
  Синий: 'checkbox-blue',
  Фиолетовый: 'checkbox-violet',
  Серый: 'checkbox-grey',
  Белый: 'checkbox-white',
  Черный: 'checkbox-black',
};

export const Checkbox: FC<PropsType> = ({
  className,
  value,
  label,
  isToLower = false,
  onChange,
}) => {
  const customColor = useMemo(() => CUSTOM_COLOR_MAP[label], [label]);

  return (
    <div className={classNames('checkbox', className, customColor)}>
      <input
        type="checkbox"
        onChange={() => onChange(!value)}
        checked={value}
        id={'checkbox' + label}
        className={classNames('checkbox__field', {
          'checkbox__field_custom-color': !!customColor,
        })}
      />
      <label htmlFor={'checkbox' + label} className="checkbox__label">
        {isToLower ? label.toLowerCase() : label}
      </label>
    </div>
  );
};
