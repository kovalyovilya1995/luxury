import { FC, useCallback, useState, useEffect } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

import { CatalogCardPreview } from '../CatalogCardPreview';
import { Product } from '../../types';
import { Response } from '../../store/types';

import './styles.scss';

type PropsType = {
  searchEmpty: boolean;
  isMobile: boolean;
  onGoToCard: (id: number) => void;
  className?: string;
};

export const ProductsNotFound: FC<PropsType> = ({
  className,
  searchEmpty,
  isMobile,
  onGoToCard,
}) => {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>();

  const getInterestingProducts = useCallback(async () => {
    const url = '/products/liked?page=0&size=20';

    try {
      const response: Response<Product[]> = await axios.get(url);
      if (response.status !== 200 || typeof response.data === 'string') {
        throw new Error('bad response');
      }

      if (response.data.content.length) {
        setProducts(response.data.content.slice(0, 4));
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (searchEmpty) return;

    getInterestingProducts();
  }, [getInterestingProducts, searchEmpty]);

  return (
    <div className={classNames('products-not-found', className)}>
      {!searchEmpty && (
        <>
          <div className="products-not-found__text">
            {t('not-found-search')}
          </div>
          {!!products?.length && (
            <>
              <div className="products-not-found__header">
                {t('you-may-like')}
              </div>
              <div className="products-not-found__products">
                {products.map((card) => (
                  <CatalogCardPreview
                    key={card.id}
                    {...card}
                    onGoToCard={onGoToCard}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {searchEmpty && (
        <>
          {!isMobile && (
            <>
              <div className="products-not-found__title">
                Ничего не удалось найти по вашему запросу
              </div>
              <div className="products-not-found__subtitle">
                Попробуйте отменить несколько фильтров, чтобы посмотреть больше
                товаров
              </div>
            </>
          )}

          {isMobile && (
            <div className="products-not-found__subtitle">
              Ничего не удалось найти по вашему запросу. Попробуйте отменить
              несколько фильтров, чтобы посмотреть больше товаров
            </div>
          )}
        </>
      )}
    </div>
  );
};
