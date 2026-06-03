import { FC, useState, useMemo, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

import { Icon } from '../ui/Icon';
import { Counter } from '../ui/Counter';
import { MenuFilterList } from './MenuFilterList';
import { MenuFilterItem } from './MenuFilterItem';
import type { Product } from '../../types';
import { data as mockProducts } from '../../components/CatalogList/mock';

import './styles.scss';
import { Response } from '../../store/types';
import axios from 'axios';

type PropsType = {
  onChangeAllFilters: (filters: {
    typeProduct: string;
    brands: string[];
    isOnlyStock: boolean;
    // colors: string[];
  }) => void;
  typeProduct: string;
  brands: string[];
  isOnlyStock: boolean;
  // colors: string[];
  typeProductOptions?: any[];
  brandsOptions?: any[];
  categoryId?: number;
  categories: any[];
  initialTotal: number;
  className?: string;
};

export const FilterMobile: FC<PropsType> = ({
  className,
  onChangeAllFilters,
  typeProduct,
  brands,
  isOnlyStock,
  typeProductOptions,
  brandsOptions,
  categoryId,
  categories,
  initialTotal,
  // colors,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenSecond, setIsOpenSecond] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('');

  const [localTypeProduct, setLocalTypeProduct] = useState('');
  const [localBrands, setLocalBrands] = useState<string[]>([]);
  const [localIsOnlyStock, setLocalIsOnlyStock] = useState(false);
  const [total, setTotal] = useState(initialTotal);
  // const [localColors, setLocalColors] = useState<string[]>([]);

  const getTypeId = useCallback(() => {
    return categories
      .find((category: any) => category.id === categoryId)
      ?.types.find((type: any) => type.title === localTypeProduct)?.id;
  }, [categoryId, categories, localTypeProduct]);

  const getBrandIds = useCallback(() => {
    return categories
      .find((category: any) => category.id === categoryId)
      ?.brands.filter((brand: any) => localBrands.includes(brand.title))
      ?.map((brand: any) => brand.id);
  }, [categoryId, categories, localBrands]);

  useEffect(() => {
    setLocalTypeProduct(typeProduct);
    setLocalBrands(brands);
    setLocalIsOnlyStock(isOnlyStock);
    // setLocalColors(colors);
  }, [isOpen, brands, isOnlyStock, typeProduct]);
  // }, [isOpen, brands, colors, isOnlyStock, typeProduct]);

  useEffect(() => {
    if (!isOpen) return;

    let urlWithoutText = `/products/search?page=0&size=10`;

    if (localBrands.length) {
      const ids = getBrandIds();

      if (ids?.length) {
        urlWithoutText += '&brandIds=' + ids.join('&brandIds=');
      }
    }

    if (localTypeProduct) {
      const id = getTypeId();

      if (id) {
        urlWithoutText += '&typeId=' + id;
      }
    }

    if (categoryId) {
      urlWithoutText += '&categoryIds=' + categoryId;
    }

    if (localIsOnlyStock) {
      urlWithoutText += '&inStock=true';
    }

    const url = urlWithoutText;
    axios
      .get(url)
      .then((response: Response<any>) => {
        if (response.status !== 200 || typeof response.data === 'string') {
          throw new Error('bad response');
        }
        setTotal(response.data.totalElements);
      })
      .catch((error) => {
        console.error(error);
        setTotal(0);
      });
  }, [
    localTypeProduct,
    localBrands,
    localIsOnlyStock,
    categoryId,
    getBrandIds,
    getTypeId,
    isOpen,
  ]);
  // }, [localTypeProduct, localBrands, localIsOnlyStock, localColors]);

  const handleApplyFilters = () => {
    setIsOpen(false);
    onChangeAllFilters({
      typeProduct: localTypeProduct,
      brands: localBrands,
      isOnlyStock: localIsOnlyStock,
      // colors: localColors,
    });
  };

  const handleResetFilters = () => {
    setIsOpen(false);
    onChangeAllFilters({
      typeProduct: '',
      brands: [],
      isOnlyStock: false,
      // colors: [],
    });
  };

  const handleChangeFilter = (
    type: string,
    value?: string | string[] | boolean
  ) => {
    if (type === 'product' && typeof value === 'string') {
      return setLocalTypeProduct(value);
    }

    if (type === 'brand' && Array.isArray(value)) {
      return setLocalBrands(value);
    }

    if (type === 'isOnlyStock' && typeof value === 'boolean') {
      return setLocalIsOnlyStock(value);
    }

    // if (type === 'color' && Array.isArray(value)) {
    //   return setLocalColors(value);
    // }
  };

  const selectedCount = useMemo(() => {
    let count = 0;

    if (typeProduct) count++;
    if (isOnlyStock) count++;
    if (brands.length) {
      count += brands.length;
    }
    // if (colors.length) {
    //   count += colors.length;
    // }

    return count;
  }, [typeProduct, isOnlyStock, brands.length]);
  // }, [typeProduct, isOnlyStock, brands.length, colors.length]);

  const handleOpenCurrentFilter = (value: string) => {
    setCurrentFilter(value);
    setIsOpenSecond(true);
  };

  return (
    <div className={classNames('filter-mobile', className)}>
      <MenuFilterList
        isOpen={isOpen}
        typeProduct={localTypeProduct}
        brands={localBrands}
        // colors={localColors}
        onChangeOpen={setIsOpen}
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
        isOnlyStock={localIsOnlyStock}
        productCount={total}
        onChangeFilter={handleChangeFilter}
        onOpenCurrentFilter={handleOpenCurrentFilter}
        typeProductOptions={typeProductOptions}
        brandsOptions={brandsOptions}
      />
      {isOpen && (
        <MenuFilterItem
          isOpen={isOpenSecond}
          currentFilter={currentFilter}
          onChangeFilter={handleChangeFilter}
          typeProduct={localTypeProduct}
          brands={localBrands}
          // colors={localColors}
          typeProductOptions={typeProductOptions}
          brandsOptions={brandsOptions}
          onClose={() => setIsOpenSecond(false)}
        />
      )}
      <div className="filter-mobile__button" onClick={() => setIsOpen(true)}>
        {t('filters')}
        <Icon name="filter" color="rgba(var(--grey-800))" size={1.5} />
        {!!selectedCount && <Counter value={selectedCount} />}
      </div>
    </div>
  );
};
