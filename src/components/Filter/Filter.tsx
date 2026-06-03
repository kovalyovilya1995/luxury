import { FC } from 'react';
import { Animate } from 'react-simple-animate';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Dropdown } from '../Dropdown';
import { Switcher } from '../ui/Switcher';

import './styles.scss';

type PropsType = {
  onChangeFilter: (type: string, value?: string | string[] | boolean) => void;
  typeProduct: string;
  brands: string[];
  isOnlyStock: boolean;
  // colors: string[];
  typeProductOptions?: any[];
  brandsOptions?: any[];
  className?: string;
};

export const Filter: FC<PropsType> = ({
  className,
  onChangeFilter,
  typeProduct,
  brands,
  isOnlyStock,
  typeProductOptions,
  brandsOptions,
  // colors,
}) => {
  const { t } = useTranslation();

  const handleResetFilters = () => {
    if (!showResetFilters) return;

    onChangeFilter('reset');
  };

  const showResetFilters = !!typeProduct || !!brands.length || isOnlyStock;
  // !!typeProduct || !!brands.length || isOnlyStock || !!colors.length;

  return (
    <div className={classNames('filter', className)}>
      {!!typeProductOptions?.length && (
        <Dropdown
          options={typeProductOptions}
          title={t('type-of-product')}
          selected={typeProduct}
          classNameList="filter__product-list"
          onChange={(value) => onChangeFilter('product', value)}
        />
      )}

      {!!brandsOptions?.length && (
        <Dropdown
          options={brandsOptions}
          title={t('brand')}
          withSearch
          multiple
          selected={brands}
          classNameList="filter__brand-list"
          onChange={(value) => onChangeFilter('brand', value)}
        />
      )}
      {/* <Dropdown
        options={colorOptions}
        title="Цвет"
        multiple
        selected={colors}
        classNameList="filter__color-list"
        onChange={(value) => onChangeFilter('color', value)}
      /> */}
      <div className="filter__switcher">
        <div className="filter__switcher-label">
          {t('only-products-in-stock')}
        </div>
        <Switcher
          value={isOnlyStock}
          onChange={(value) => onChangeFilter('isOnlyStock', value)}
        />
      </div>
      <Animate
        play={showResetFilters}
        start={{ opacity: 0 }}
        end={{ opacity: 1 }}
        easeType="ease-in"
        duration={0.3}
      >
        <button className="button filter__button" onClick={handleResetFilters}>
          {t('reset-filters')}
        </button>
      </Animate>
    </div>
  );
};
