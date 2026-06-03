import { FC, useState, useMemo } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Icon } from '../ui/Icon';
import { Dropdown } from '../Dropdown';
import { Input } from '../ui/Input';

import './styles.scss';

type PropsType = {
  isOpen: boolean;
  currentFilter: string;
  onChangeFilter: (type: string, value?: string | string[] | boolean) => void;
  onClose: () => void;
  typeProduct: string;
  brands: string[];
  // colors: string[];
  typeProductOptions?: any[];
  brandsOptions?: any[];
  className?: string;
};

export const MenuFilterItem: FC<PropsType> = ({
  isOpen,
  currentFilter,
  typeProduct,
  brands,
  // colors,
  typeProductOptions,
  brandsOptions,
  onChangeFilter,
  onClose,
  className,
}) => {
  const { t } = useTranslation();
  const [searchText, setSearchText] = useState('');

  const filteredBrandOptions = useMemo(() => {
    if (!brandsOptions?.length) return [];
    if (!searchText) return brandsOptions;

    return brandsOptions.filter((option) =>
      option.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [brandsOptions, searchText]);

  return (
    <div
      className={classNames('menu-filter-item', className, {
        'menu-filter-item_open': !!isOpen,
      })}
    >
      <Icon
        name="arrow-left"
        color="rgba(var(--grey-800))"
        size={1.5}
        handleClick={onClose}
      />
      <div className="menu-filter-item__content" data-filter={currentFilter}>
        {currentFilter === 'product' && !!typeProductOptions?.length && (
          <Dropdown
            options={typeProductOptions}
            isMobile
            title={t('type-of-product')}
            selected={typeProduct}
            onChange={(value) => onChangeFilter('product', value)}
          />
        )}
        {currentFilter === 'brand' && !!brandsOptions?.length && (
          <>
            <Input type="search" value={searchText} onChange={setSearchText} />
            <Dropdown
              options={filteredBrandOptions}
              isMobile
              title={t('brand')}
              multiple
              selected={brands}
              onChange={(value) => onChangeFilter('brand', value)}
            />
          </>
        )}
        {/* {currentFilter === 'color' && (
          <Dropdown
            options={colorOptions}
            isMobile
            title="Цвет"
            multiple
            selected={colors}
            onChange={(value) => onChangeFilter('color', value)}
          />
        )} */}
      </div>
    </div>
  );
};
