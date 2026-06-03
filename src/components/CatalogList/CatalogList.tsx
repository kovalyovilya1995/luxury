import { FC, useState, useEffect, useMemo } from 'react';
import classNames from 'classnames';
import InfiniteScroll from 'react-infinite-scroll-component';

import { CatalogCardPreview, Skeleton } from '../CatalogCardPreview';
import { Product } from '../../types';

import './styles.scss';

type PropsType = {
  products: Product[];
  isLoading: boolean;
  total: number;
  onGoToCard: (id: number) => void;
  onNextPage: () => void;
  className?: string;
};

export const CatalogList: FC<PropsType> = ({
  className,
  isLoading,
  products,
  total,
  onGoToCard,
  onNextPage,
}) => {
  const [gridColumnCount, setGridColumnCount] = useState(0);

  useEffect(() => {
    const callback = () => {
      const list = document.getElementsByClassName('catalog-list__items')[0];
      if (!list) {
        setGridColumnCount(0);
        return;
      }

      const gridComputedStyle = window.getComputedStyle(list);
      const gridColumnCount = gridComputedStyle
        .getPropertyValue('grid-template-columns')
        .split(' ').length;

      setGridColumnCount(gridColumnCount);
    };

    callback();

    window.addEventListener('resize', callback);
    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  const skeletonCount = useMemo(() => {
    const productsCountInLastRow = products.length % gridColumnCount;
    if (!productsCountInLastRow) return gridColumnCount;

    return 2 * gridColumnCount - productsCountInLastRow;
  }, [gridColumnCount, products.length]);

  return (
    <div className={classNames('catalog-list', className)}>
      {!isLoading && (
        <InfiniteScroll
          className="catalog-list__items"
          dataLength={products.length}
          next={onNextPage}
          hasMore={total > products.length}
          loader={Array.from({ length: skeletonCount }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        >
          {products.map((card) => (
            <CatalogCardPreview
              key={card.id}
              {...card}
              onGoToCard={onGoToCard}
            />
          ))}
        </InfiniteScroll>
      )}

      {isLoading && (
        <div className="catalog-list__items">
          {Array.from({ length: 2 * skeletonCount }).map((_, index) => (
            <Skeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
};
