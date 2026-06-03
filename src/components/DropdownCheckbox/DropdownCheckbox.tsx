import { FC, useState } from 'react';
import classNames from 'classnames';

import { Icon } from '../ui/Icon';
import { Checkbox } from '../ui/Checkbox';

import './styles.scss';

type PropsType = {
  className?: string;
  title: string;
  options: string[];
  selected: string[];
  onChange: (value: any) => void;
};

export const DropdownCheckbox: FC<PropsType> = ({
  className,
  options,
  title,
  selected,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const isAllSelected = options.every((option) => selected.includes(option));

  const handleSelect = (item: string, value: boolean) => {
    let newSelected = [];

    if (value) {
      newSelected = [...selected, item];
    } else {
      newSelected = selected.filter((selectedItem) => selectedItem !== item);
    }

    onChange(newSelected);
  };

  const handleAllSelect = () => {
    let newSelected = [...selected];

    if (isAllSelected) {
      newSelected = selected.filter((item) => !options.includes(item));
    } else {
      options.forEach((item) => {
        if (!selected.includes(item)) {
          newSelected.push(item);
        }
      });
    }
    onChange(newSelected);
  };

  const handleChangeOpen = (event: any) => {
    event.stopPropagation();

    setIsOpen(!isOpen);
  };

  return (
    <div
      className={classNames(
        'dropdown-checkbox',
        { 'dropdown-checkbox_open': isOpen },
        className
      )}
    >
      <div className="dropdown-checkbox-header" onClick={handleChangeOpen}>
        <div className="dropdown-checkbox-header-title">
          <Checkbox
            label={title}
            value={isAllSelected}
            onChange={handleAllSelect}
          />
        </div>
        <Icon
          className={classNames('dropdown-checkbox-header-icon', {
            'dropdown-checkbox-header-icon_open': isOpen,
          })}
          name="arrow-down"
          color="rgba(var(--grey-600))"
          pointer
          size={1.5}
        />
      </div>
      <div
        className={classNames('dropdown-checkbox-list', {
          'dropdown-checkbox-list_hidden': !isOpen,
        })}
      >
        {options.map((item) => (
          <Checkbox
            key={item}
            className="dropdown-checkbox-list-item"
            label={item}
            value={selected.includes(item)}
            onChange={(value) => handleSelect(item, value)}
          />
        ))}
      </div>
    </div>
  );
};
