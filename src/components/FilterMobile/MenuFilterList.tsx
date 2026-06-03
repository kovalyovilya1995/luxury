import { FC, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import { Animate } from 'react-simple-animate';
import { useTranslation } from 'react-i18next';

import { TabType } from '../../types';
import { Icon } from '../ui/Icon';
import { Switcher } from '../ui/Switcher';
import { Counter } from '../ui/Counter';
import { Tab } from '../Tab';
import { plural } from '../../i18n/utils';

import './styles.scss';

type PropsType = {
  isOpen: boolean;
  onChangeOpen: (value: boolean) => void;
  onChangeFilter: (type: string, value?: string | string[] | boolean) => void;
  onOpenCurrentFilter: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  isOnlyStock: boolean;
  typeProduct: string;
  brands: string[];
  // colors: string[];
  typeProductOptions?: any[];
  brandsOptions?: any[];
  productCount: number;
  className?: string;
};

export const MenuFilterList: FC<PropsType> = ({
  className,
  isOpen,
  isOnlyStock,
  typeProduct,
  brands,
  // colors,
  typeProductOptions,
  brandsOptions,
  productCount,
  onChangeFilter,
  onChangeOpen,
  onOpenCurrentFilter,
  onApplyFilters,
  onResetFilters,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const showGoods = useMemo(() => {
    return Boolean(
      typeProduct || isOnlyStock || brands.length
      // typeProduct || isOnlyStock || brands.length || colors.length
    );
  }, [typeProduct, isOnlyStock, brands.length]);
  // }, [typeProduct, isOnlyStock, brands.length, colors.length]);

  const handleRemoveItem = (type: string, value?: TabType) => {
    if (type === 'product') {
      onChangeFilter('product', '');
    }

    if (type === 'brand' && value) {
      const newBrands = brands.filter((brand) => brand !== value.label);
      onChangeFilter('brand', newBrands);
    }

    // if (type === 'color' && value) {
    //   const newColors = colors.filter((color) => color !== value.label);
    //   onChangeFilter('color', newColors);
    // }
  };

  return (
    <div
      className={classNames('menu-filter-list', className, {
        'menu-filter-list_open': isOpen,
      })}
    >
      <div>
        <div className="menu-filter-list__icons">
          <Icon
            name="close2"
            color="rgba(var(--grey-800))"
            className="menu-filter-list__close"
            size={1.5}
            handleClick={() => onChangeOpen(false)}
          />
          {showGoods && (
            <Icon
              name="clear-filter"
              color="rgba(var(--grey-800))"
              className="menu-filter-list__clear"
              size={1}
              handleClick={onResetFilters}
            />
          )}
        </div>
        <div className="menu-filter-list__content">
          {!!typeProductOptions?.length && (
            <div className="menu-filter-list-item-wrapper">
              <div
                className="menu-filter-list-item"
                onClick={() => onOpenCurrentFilter('product')}
              >
                <div className="menu-filter-list-item__label">
                  {t('type-of-product')}
                </div>
                <div className="menu-filter-list-item__action">
                  {typeProduct && <Counter value={1} />}
                  <Icon
                    name="arrow-right3"
                    color="rgba(var(--grey-600))"
                    size={1.5}
                  />
                </div>
              </div>
              {typeProduct && (
                <div className="menu-filter-list-item__tabs">
                  <Tab
                    item={{ label: typeProduct, path: typeProduct }}
                    onClose={() => handleRemoveItem('product')}
                    hasClose
                  />
                </div>
              )}
            </div>
          )}

          {!!brandsOptions?.length && (
            <div className="menu-filter-list-item-wrapper">
              <div
                className="menu-filter-list-item"
                onClick={() => onOpenCurrentFilter('brand')}
              >
                <div className="menu-filter-list-item__label">{t('brand')}</div>
                <div className="menu-filter-list-item__action">
                  {!!brands.length && <Counter value={brands.length} />}
                  <Icon
                    name="arrow-right3"
                    color="rgba(var(--grey-600))"
                    size={1.5}
                  />
                </div>
              </div>
              {!!brands.length && (
                <div className="menu-filter-list-item__tabs">
                  {brands.map((brand) => (
                    <Tab
                      key={brand}
                      isToLower
                      item={{ label: brand, path: brand }}
                      onClose={(value) => handleRemoveItem('brand', value)}
                      hasClose
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* <div className="menu-filter-list-item-wrapper">
            <div
              className="menu-filter-list-item"
              onClick={() => onOpenCurrentFilter('color')}
            >
              <div className="menu-filter-list-item__label">Цвет</div>
              <div className="menu-filter-list-item__action">
                {!!colors.length && <Counter value={colors.length} />}
                <Icon
                  name="arrow-right3"
                  color="rgba(var(--grey-600))"
                  size={1.5}
                />
              </div>
            </div>
            {!!colors.length && (
              <div className="menu-filter-list-item__tabs">
                {colors.map((color) => (
                  <Tab
                    key={color}
                    item={{ label: color, path: color }}
                    onClose={(value) => handleRemoveItem('color', value)}
                    hasClose
                  />
                ))}
              </div>
            )}
          </div> */}

          <div className="menu-filter-list-item">
            <div className="menu-filter-list-item__label">
              {t('only-products-in-stock')}
            </div>
            <Switcher
              value={isOnlyStock}
              onChange={(value) => onChangeFilter('isOnlyStock', value)}
            />
          </div>
        </div>
      </div>
      <Animate
        play={showGoods}
        start={{ opacity: 0 }}
        end={{ opacity: 1 }}
        easeType="ease-in"
        duration={0.3}
      >
        {showGoods && (
          <div className="menu-filter-list-wrapper">
            <button className="button" onClick={onApplyFilters}>
              {t('product-count', {
                num: productCount,
                value: plural(
                  {
                    RUS: ['товар', 'товара', 'товаров'],
                    ENG: ['product', 'products'],
                  },
                  productCount
                ),
              })}
            </button>
          </div>
        )}
      </Animate>
    </div>
  );
};
