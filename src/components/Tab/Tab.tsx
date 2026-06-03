import { FC } from 'react';
import classNames from 'classnames';

import { TabType } from '../../types';
import { Icon } from '../ui/Icon';
import { tabMap } from '../../pages/Catalog/constants';

import './styles.scss';

type PropsType = {
  item: TabType;
  isActive?: boolean;
  hasClose?: boolean;
  isToLower?: boolean;
  isCategory?: boolean;
  onClick?: (value: TabType) => void;
  onClose?: (value: TabType) => void;
};

export const Tab: FC<PropsType> = ({
  item,
  isActive = false,
  hasClose = false,
  isToLower = false,
  isCategory = false,
  onClick = () => {},
  onClose = () => {},
}) => (
  <div
    className={classNames('tab', {
      tab_active: isActive,
      tab_capitalize: isToLower,
    })}
    onClick={() => onClick(item)}
  >
    {isToLower
      ? item.label.toLowerCase()
      : isCategory && localStorage.getItem('lang') === 'ENG'
      ? tabMap[item.label].charAt(0).toUpperCase() + tabMap[item.label].slice(1)
      : item.label}
    {hasClose && (
      <Icon
        name="close2"
        color="rgba(var(--grey-400))"
        handleClick={() => onClose(item)}
        size={1.5}
      />
    )}
  </div>
);
