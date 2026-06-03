import { FC, useState, useRef, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Icon } from '../ui/Icon';
import { Input } from '../ui/Input';
import { DropdownCheckbox } from '../DropdownCheckbox';
import { Checkbox } from '../ui/Checkbox';
import { useElementScroll } from '../../hooks';

import './styles.scss';

type SimpleOptions = string[];
type DifficultOptions = { title: string; options: SimpleOptions }[];

type PropsType = {
  className?: string;
  classNameList?: string;
  title: string;
  options: string[] | { title: string; options: string[] }[];
  withSearch?: boolean;
  multiple?: boolean;
  isMobile?: boolean;
  selected: string | string[];
  onChange: (value: string | string[]) => void;
};

export const Dropdown: FC<PropsType> = ({
  className,
  classNameList,
  options,
  title,
  withSearch = false,
  multiple = false,
  isMobile = false,
  selected,
  onChange,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(isMobile ? true : false);
  const [searchText, setSearchText] = useState('');
  const refScroll = useRef<any>();
  const { isEndVisible } = useElementScroll(refScroll, isOpen);

  const isDifficult = typeof options[0] === 'object';

  const filteredOptions = useMemo(() => {
    if (isDifficult || !searchText || !withSearch) return options;

    return (options as string[]).filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [isDifficult, options, searchText, withSearch]);

  const handleChangeOpen = (event: any) => {
    if (isMobile) return;
    event.stopPropagation();

    setIsOpen(!isOpen);
  };

  const handleSelect = (event: any, value: string) => {
    event.stopPropagation();

    if (selected === value) {
      return onChange([]);
    }

    onChange(value);
  };

  const handleSelectMultiple = (item: string, value: boolean) => {
    let newSelected = [];

    if (value) {
      newSelected = [...(selected as string[]), item];
    } else {
      newSelected = (selected as string[]).filter(
        (selectedItem) => selectedItem !== item
      );
    }

    onChange(newSelected);
  };

  return (
    <div
      className={classNames(
        'dropdown',
        {
          dropdown_open: isOpen,
          dropdown_mobile: isMobile,
        },
        className
      )}
    >
      <div className="dropdown-header" onClick={handleChangeOpen}>
        <div className="dropdown-header-title">{title}</div>
        {!isMobile && (
          <Icon
            className={classNames('dropdown-header-icon', {
              'dropdown-header-icon_open': isOpen,
            })}
            name="arrow-down"
            color="rgba(var(--grey-600))"
            pointer
            size={1.5}
          />
        )}
      </div>
      <div
        className={classNames(
          'dropdown-list',
          {
            'dropdown-list_hidden': !isOpen,
          },
          classNameList
        )}
      >
        {withSearch && (
          <Input
            className="dropdown-list__search"
            type="search"
            value={searchText}
            onChange={setSearchText}
          />
        )}
        <div
          className={classNames('dropdown-list__scroll', {
            'dropdown-list__scroll_mask': !isEndVisible,
            'dropdown-list_multiple': multiple || isDifficult,
          })}
          ref={refScroll}
        >
          {isDifficult &&
            (options as DifficultOptions).map((item) => (
              <DropdownCheckbox
                key={item.title}
                onChange={onChange}
                title={item.title}
                selected={selected as string[]}
                options={item.options}
              />
            ))}
          {!isDifficult &&
            !multiple &&
            (options as SimpleOptions).map((item) => {
              const isSelected = item === selected;

              return (
                <div
                  key={item}
                  onClick={(event) => handleSelect(event, item)}
                  className={classNames(
                    'dropdown-list-item dropdown-list-item_simple',
                    {
                      'dropdown-list-item_selected': isSelected,
                    }
                  )}
                >
                  {item}
                  {isSelected && (
                    <Icon
                      className="dropdown-list-item__check"
                      name="check"
                      color="rgba(var(--orange))"
                      size={0.65125}
                    />
                  )}
                </div>
              );
            })}
          {!isDifficult &&
            multiple &&
            (filteredOptions as SimpleOptions).map((item) => (
              <Checkbox
                key={item}
                className="dropdown-list-item"
                label={item}
                isToLower={title === t('brand')}
                value={selected.includes(item)}
                onChange={(value) => handleSelectMultiple(item, value)}
              />
            ))}
        </div>
      </div>
    </div>
  );
};
