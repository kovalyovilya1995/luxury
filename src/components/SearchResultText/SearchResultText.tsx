import { FC } from 'react';
import classNames from 'classnames';

import './styles.scss';

type PropsType = {
  isLoading: boolean;
  text: string;
  count: number;
  className?: string;
};

export const SearchResultText: FC<PropsType> = ({
  className,
  isLoading,
  text,
  count,
}) => {
  return (
    <div className={classNames('search-result-text', className)}>
      <div className="search-result-text__find">
        Найдено&nbsp;
        {!isLoading && (
          <span className="search-result-text__find-count">
            {count} товаров
          </span>
        )}
        {isLoading && (
          <div className="search-result-text__find-count-skeleton" />
        )}
        &nbsp;по запросу
      </div>
      {text && <div className="search-result-text__content">{text}</div>}
    </div>
  );
};
