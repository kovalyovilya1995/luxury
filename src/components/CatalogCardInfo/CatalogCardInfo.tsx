import { FC, useState, useCallback, useEffect } from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

import { CatalogCardPreview } from '../CatalogCardPreview';
import { ModalFeedback } from '../modals/ModalFeedback';
import { ModalFeedbackSuccess } from '../modals/ModalFeedbackSuccess';
import { Product } from '../../types';
import { Response } from '../../store/types';

import './styles.scss';

type PropsType = {
  product: Product;
  className?: string;
  isMobile?: boolean;
};

export const CatalogCardInfo: FC<PropsType> = ({
  className,
  product,
  isMobile,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenSecondModal, setIsOpenSecondModal] = useState(false);
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
    if (!isMobile) return;

    getInterestingProducts();
  }, [getInterestingProducts, isMobile]);

  const handleGoToCard = (id: number) => {
    navigate(`/catalog/all/${id}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleApplyFeedback = () => {
    setIsOpenModal(false);
    setIsOpenSecondModal(true);
  };

  return (
    <div className={classNames('catalog-card-info', className)}>
      <ModalFeedback
        isOpen={isOpenModal}
        product={product}
        onClose={() => setIsOpenModal(false)}
        onApply={handleApplyFeedback}
      />
      <ModalFeedbackSuccess
        isOpen={isOpenSecondModal}
        onClose={() => setIsOpenSecondModal(false)}
      />
      <div className="catalog-card-info__header">
        <div className="catalog-card-info__header-brand">
          {product.brand?.title}
        </div>
        <div className="catalog-card-info__header-name">{product.title}</div>
        <div className="catalog-card-info__header-material">
          {product.materials}
        </div>
        <div className="catalog-card-info__header-price">
          {t('price-on-request')}
        </div>
      </div>

      {!isMobile && (
        <button
          className="catalog-card-info__button button"
          onClick={() => setIsOpenModal(true)}
        >
          {t('check-availability')}
        </button>
      )}

      <div className="catalog-card-info__description">
        {product.description}
      </div>

      <div className="catalog-card-info__characteristics">
        <div className="catalog-card-info__characteristics-title">
          Характеристики
        </div>
        <div className="catalog-card-info-characteristic">
          <div className="catalog-card-info-characteristic__key">
            {t('brand')}:
          </div>
          <div className="catalog-card-info-characteristic__value">
            {product.brand?.title}
          </div>
        </div>
        <div className="catalog-card-info-characteristic">
          <div className="catalog-card-info-characteristic__key">
            {t('country')}:
          </div>
          <div className="catalog-card-info-characteristic__value">
            {product.country || '–'}
          </div>
        </div>
        <div className="catalog-card-info-characteristic">
          <div className="catalog-card-info-characteristic__key">
            {t('material')}:
          </div>
          <div className="catalog-card-info-characteristic__value">
            {product.materials || '–'}
          </div>
        </div>
        {product.volume && (
          <div className="catalog-card-info-characteristic">
            <div className="catalog-card-info-characteristic__key">
              {t('volume')}:
            </div>
            <div className="catalog-card-info-characteristic__value">
              {product.volume}
            </div>
          </div>
        )}
      </div>

      {isMobile && !!products?.length && (
        <div className="catalog-card-info__like">
          <div className="catalog-card-info__like-header">
            {t('you-may-like')}
          </div>
          <div className="catalog-card-info__like-products">
            {products.map((card) => (
              <CatalogCardPreview
                key={card.id}
                {...card}
                onGoToCard={handleGoToCard}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
