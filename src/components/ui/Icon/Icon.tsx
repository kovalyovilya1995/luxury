import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  name: string;
  color?: string;
  className?: string;
  size?: number;
  height?: number;
  width?: number;
  pointer?: boolean;
  handleClick?: () => void;
};

export const Icon: FC<PropsType> = ({
  name,
  color = 'rgba(var(--white))',
  className,
  size,
  height = 1.125,
  width = 1.125,
  pointer = false,
  handleClick = () => {},
}) => {
  const iconHeight = (size || height) + 'rem';
  const iconWidth = (size || width) + 'rem';
  const cursor = pointer ? 'pointer' : 'default';

  /* Есть два типа иконок:
   *  - regular - которым можно задать цвет
   *  - colored - которые имеют элементы разных цветов. Они не подразумевают перекрашивание
   *
   * colored иконки задаются при помощи префикса в виде буквы и дефиса, например 'c-search'.
   */
  const coloredIconsPrefixes = /^f-|^c-/;
  const type = coloredIconsPrefixes.test(name) ? 'colored' : 'regular';

  return (
    <i
      className={classNames('icon', className)}
      onClick={handleClick}
      style={{
        WebkitMaskImage: type === 'colored' ? 'unset' : `url('/${name}.svg')`,
        background:
          type === 'colored'
            ? `no-repeat url('/${name}.svg') transparent`
            : 'auto',
        color,
        height: iconHeight,
        width: iconWidth,
        cursor: cursor,
      }}
    />
  );
};
